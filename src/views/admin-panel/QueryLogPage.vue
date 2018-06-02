<template>
<v-container fluid grid-list-md >
    <Caption text="Application Users" />
    <v-card >
        <v-card-text>
          <v-form ref="formSearch" @keyup.native.enter="onExecuteQuery" >

              <v-layout row>     
                 <v-select :items="preDefinedQueryList" @change="onPreDefinedQuery" placeholder="Select a Query" max-height="auto" />
              </v-layout>

              <v-layout row> 
                  <v-text-field v-model="query" label="Write a query here" multi-line />
              </v-layout>

              <v-layout row>
                    <v-btn large color="primary" @click="onExecuteQuery">
                      <v-icon>search</v-icon>
                    </v-btn>
                    <v-btn large color="primary" @click="onSearchReset">
                      <v-icon>not_interested</v-icon>
                    </v-btn>
              </v-layout>

            </v-form>
        </v-card-text>

    </v-card>

    <v-spacer />

    <v-card>
        <v-card-title>
        <Caption text="Log Query Results" />
        <v-spacer></v-spacer>
        <v-text-field v-model="searchText" append-icon="search" label="Search" single-line hide-details ></v-text-field>
        </v-card-title>
  
        <v-card-text>
            <v-data-table :items="queryList" :headers="headers"  :rows-per-page-items="pages" :search="searchText" >
            <template slot="items" slot-scope="props">
                <td class="text-xs-left" v-for="field in fields" :key="field">{{ props.item[field] }}</td>
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your search for "{{ searchText }}" found no results.
            </v-alert>
            
            </v-data-table>
        </v-card-text>
    </v-card>



</v-container> 
</template>




<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { SelectItem } from "@/models/custom.models"
import { Vuetility, DataTableHeader } from "@/utils/vuetility";
import { Toolbox } from "@/utils/toolbox";
import { UtilsService } from "@/services/utils.service";

@Component
export default class QueryLogPage extends Vue {

  utilsService = new UtilsService();

  search = {};
  searchText = ""; 

  query = "";
  preDefinedQueryList:SelectItem[];
  onPreDefinedQuery(value){
    this.query = (value ? value : "");
  }

  headers:DataTableHeader[] = [];
  fields= [];
  queryList = [];
  pages = Vuetility.DataTable.defaultPages();

  constructor(){
      super();

      this.preDefinedQueryList = [];
      this.preDefinedQueryList.push({ value: "select * from Log t where t.Code=313 order by t.Id desc", text: "Login" });
      this.preDefinedQueryList.push({ value: "select t.Method, count(*) from Log t where t.Code=1010 group by t.Method", text: "WebSocket Connection Numbers" });
  } 
  
  onExecuteQuery() {
        if (this.query) {
            this.queryList.length = 0;
            this.headers.length = 0;
            this.fields.length = 0;
            this.utilsService.queryLog(this.query)
                .then(data => {
                    if (data && data.length && !Toolbox.isString(data)) { //>Toolbox.isString(data) resultasmessage
                        this.queryList = data;
                        for (var field in data[0]) {
                          this.headers.push({value:field, text:field});
                          this.fields.push(field);
                        }   
                    }
                });
        } else {
            Toolbox.showWarning("Please write a query");
        }
  }

  onSearchReset(){
      (<any>this.$refs.formSearch).reset();
  }
}
</script>