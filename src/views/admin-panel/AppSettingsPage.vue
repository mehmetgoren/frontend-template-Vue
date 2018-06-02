<template>

<v-container fluid grid-list-md >
    <Caption text="Application Settings" />
      <v-card>
        <v-card-title>
        <v-btn color="primary" @click="onSave"><v-icon left>save</v-icon> Save</v-btn>
        <v-spacer></v-spacer>
        <v-text-field v-model="searchText" append-icon="search" label="Search" single-line hide-details ></v-text-field>
        </v-card-title>
  
        <v-card-text>
            <v-data-table :headers="headers" :items="appSettingList"  :rows-per-page-items="pages" :search="searchText" >
            <template slot="items" slot-scope="props">
                <td class="text-xs-left"><v-text-field :rules="rules.Name" v-model="props.item.Name" /></td>
                <td class="text-xs-left"><v-text-field :rules="rules.Value" v-model="props.item.Value" /></td>
                <td class="text-xs-left"><v-text-field :rules="rules.DefaultValue" v-model="props.item.DefaultValue" /></td>
                <td class="text-xs-left"><v-text-field :rules="rules.Description" v-model="props.item.Description" /></td>
                <td class="text-xs-left"><v-text-field :rules="rules.Module" v-model="props.item.Module" /></td>
                <td class="text-xs-left"><v-checkbox :rules="rules.Enabled" v-model="props.item.Enabled" /></td>
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
import { AppSetting } from "@/models/entities";
import { AdminPanelService } from "@/services/admin-panel.service";
import { Toolbox } from "@/utils/toolbox";
import { UtilsService } from "@/services/utils.service";
import { Vuetility, DataTableHeader, Pagination } from "@/utils/vuetility";
import { ValidationRules,createValidationRules, isValid } from "@/utils/validation/createValidationRules";
import { Types } from "@/store/metadata";

@Component
export default class AppSettingsPage extends Vue {

    adminPanelService = new AdminPanelService();

    pages = Vuetility.DataTable.defaultPages() //Vuetility.// [5,10,25,50,100,250];
    headers:DataTableHeader[] = AppSettingsPage.createHeader();
    appSettingList:AppSetting[] = [];

    //validation
    rules:ValidationRules = null;
    //

    //search
    searchText:string=null;
    //
    

    async created(){
       this.rules = createValidationRules(Types.AppSetting, ["Name", "Value", "DefaultValue","Description", "Module","Enabled"]);
       this.appSettingList = await this.adminPanelService.getAppSettingList();
    }

    async onSave(e){
       const result = isValid(this.appSettingList, this.rules);
       if (result){
          Toolbox.showSaveMsg(await this.adminPanelService.updateAllAppSetting(this.appSettingList));
       }else
          Toolbox.showWarning("Your inputs are invalid.");
            
    }

    private static createHeader():DataTableHeader[]{
    return [
          { value: "Name", text: "Name", align: "left"},
          { value: "Value", text: "Value" },
          { value: "DefaultValue", text: "Default Value" },
          { value: "Description", text: "Description"},
          { value:"Module", text:"Module"},
          { value:"Enabled", text:"Enabled"}
        ];
    }
}

</script>