<template>
<v-container fluid grid-list-md >
    <Caption text="Roles" />

    <v-card>
        <v-card-title>
          <v-btn color="primary" @click="selected={}"><v-icon left>add</v-icon> Add New Item</v-btn>
          <v-spacer></v-spacer>
          <v-text-field  v-model="searchText"  append-icon="search"  label="Search" single-line hide-details ></v-text-field>
        </v-card-title>
    
        <v-card-text>
          <v-data-table :headers="headers" :items="roles" :rows-per-page-items="pages" :search="searchText" >

                <template slot="items" slot-scope="props">
                    <td class="text-xs-left">{{props.item.Name}}</td>
                    <td class="text-xs-left"><v-checkbox v-model="props.item.IsAdmin" disabled /></td>
                    <td class="text-xs-left">
                        <v-btn icon class="mx-0" @click="onEdit(props.item)">
                            <v-icon color="teal">edit</v-icon>
                        </v-btn>
                        <v-btn icon class="mx-0" @click="onDelete(props.item)">
                            <v-icon color="pink">delete</v-icon>
                        </v-btn>
                    </td>
                </template>

                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                        Your search for "{{ searchText }}" found no results.
                </v-alert>
            
            </v-data-table>
        </v-card-text>
    </v-card>

     <v-dialog v-model="selected" v-if="selected" @keydown.esc="selected=null" :persistent="true" max-width="500px" >
      <v-card>
        <DialogToolbar title="Edit Role" @onClose="selected=null" />
        <v-card-text>
            <v-form ref="form" lazy-validation @keyup.native.enter="onSave" >
              <v-container fluid >

                <v-layout row> 
                  <v-text-field :rules="rules.Name" label="Name" v-model="selected.Name" />
                </v-layout>
                

                <v-layout row>
                  <v-flex xs2>
                    <label>Is Admin</label>
                  </v-flex>
                  <v-flex xs10>
                    <v-checkbox :rules="rules.IsAdmin" v-model="selected.IsAdmin"/> 
                  </v-flex>          
                </v-layout>
                
              </v-container>
            </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn  @click="onSave">
            <v-icon>save</v-icon>
            Save
            </v-btn>
          <v-btn @click="onReset">
            <v-icon>clear</v-icon>
            Clear
            </v-btn>
        </v-card-actions>
      </v-card>

     </v-dialog>

</v-container>

</template>



<script lang="ts">

import { Component, Vue } from "vue-property-decorator";
import { DataTableHeader } from "@/utils/vuetility";
import { Role } from "@/models/entities";
import { AdminPanelService } from "@/services/admin-panel.service";
import { Toolbox } from "@/utils/toolbox";
import { ValidationRules, createValidationRules } from "@/utils/validation/createValidationRules";
import { Types } from "@/store/metadata";

@Component
export default class RolePage extends Vue {

  adminPanelService = new AdminPanelService();

  //datatable
  pages = [10,25,50];
  headers = RolePage.createHeader();
  selected:Role = null;
  roles:Role[] = [];

  private static createHeader():DataTableHeader[]{
      return [
          { value: "Name", text: "Name"},
          { value: "IsAdmin", text: "Is Admin", align:"center"}
        ];
  }
  //

  created(){
     this.rules = createValidationRules(Types.Role, ['Name', 'IsAdmin']);
     this.dataBind();
  }

  async dataBind(){
       this.roles = await this.adminPanelService.getRoles();
  }


  onSave(){
    if (Toolbox.isFormValid(this.$refs.form)){
        this.adminPanelService.saveRole(this.selected).then(data => {
                this.selected = null;
                Toolbox.showSaveMsg(data);
                if (data > 0)
                    this.dataBind();
        });
    }
  }

  async onDelete(role:Role){
      const result = await Toolbox.showConfirm("?","Are you sure to delete this record?");
      if (result){
          Toolbox.showDeleteMsg(await this.adminPanelService.deleteRole(role.RoleId));
          this.dataBind();
      }
  }

  onEdit(role:Role){
    this.selected = Object.assign({}, role);
  }
  
  onReset(e){
    (<any>this.$refs.form).reset();
  }

   //search
    searchText = null;
   //

  //validation
  rules:ValidationRules = null;
  //

}
</script>