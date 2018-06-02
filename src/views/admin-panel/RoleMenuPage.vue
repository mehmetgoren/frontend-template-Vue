<template>
<v-container fluid grid-list-md >
    <Caption text="Role Menu Authorities" />

        <v-layout row>
            <v-flex xs2>
                <v-card>
                    <v-card-title>
                        <v-toolbar dark color="primary" height="42" >
                            <v-toolbar-title>Roles</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                    </v-card-title>

                    <v-card-text>
                        <v-radio-group v-model="selectedRole" @change="onRoleChanged">
                        <v-radio
                            v-for="role in roles"
                            :key="role.RoleId"
                            :label="role.Name"
                            :value="role"
                        ></v-radio>
                        </v-radio-group>
                    </v-card-text>
                </v-card>              
            </v-flex>


            <v-flex xs10>
                <v-card>
                    <v-card-title>
                        <v-toolbar dark color="primary" height="64" >
                            <v-btn color="green" @click="onSave" :disabled="roleMenuList===null||roleMenuList.length===0"><v-icon left>save</v-icon>Save</v-btn>
                            <v-toolbar-title>Menu List</v-toolbar-title>
                        </v-toolbar>
                    </v-card-title>

                    <v-card-text>

                         <v-data-table :headers="headers" :items="roleMenuList" 
                          :rows-per-page-items="pages" :search="searchText" select-all item-key="RoleMenuId">
                                <template slot="headers" slot-scope="props">
                                <tr>
                                    <th>
                                    <v-checkbox v-model="toggleAll" :disabled="roleMenuList===null||roleMenuList.length===0"></v-checkbox>
                                    </th>
                                    <th v-for="header in props.headers" :key="header.text">
                                        <div class="text-xs-left">{{ header.text }}</div> 
                                    </th>
                                </tr>
                                </template>
                                <template slot="items" slot-scope="props">
                                <tr >
                                    <td>
                                        <v-checkbox v-model="props.item.HasAccess"></v-checkbox>
                                    </td>
                                    <td class="text-xs-left">{{ props.item.ParentName }}</td>
                                    <td class="text-xs-left">{{ props.item.Name }}</td>
                                    <td class="text-xs-left">{{ props.item.Route }}</td>
                                    <td class="text-xs-left">{{ props.item.OrderNum }}</td>
                                </tr>
                                </template>
                            </v-data-table>


                    </v-card-text>
                </v-card>
            </v-flex>


        </v-layout>
    
</v-container>
</template>


<script lang="ts">

import { Component, Vue } from "vue-property-decorator";
import { Role, V_RoleMenu } from "@/models/entities";
import { AdminPanelService } from "@/services/admin-panel.service";
import { DataTableHeader, Vuetility } from "@/utils/vuetility";
import { Toolbox } from "@/utils/toolbox";

@Component({
    watch:{
        toggleAll:{
            handler(){
                this.onToggleAll();
            },
            deep:false
        }
    }
})
export default class RoleMenuPage extends Vue {

    adminPanelService = new AdminPanelService();
    roles:Role[] = [];
    

    //dataTable
    headers = RoleMenuPage.createHeader();
    roleMenuList:V_RoleMenu[] = [];
    pages = Vuetility.DataTable.defaultPages(); //Vuetility.// [5,10,25,50,100,250];
    searchText = null;
    toggleAll = false;
    onToggleAll(){
        if (this.roleMenuList){
            this.roleMenuList.forEach(i =>{
                i.HasAccess = this.toggleAll;
            });
        }
    }
    //

    created(){
        this.dataBind();
    }

    private dataBind() {
        this.adminPanelService.getRolesNoAdmin().then(data => {
            this.roles = data;
        });
    } 

    selectedRole: Role = null;
    onRoleChanged(r: Role) {
        this.selectedRole = null;
        if (r && r.RoleId && r.RoleId > 0) {
            this.selectedRole = r;
            this.adminPanelService.getRoleMenuList(this.selectedRole.RoleId).then(data => {
                this.roleMenuList = data;
            });
        }
    }


    onSave() {
        if (this.selectedRole && this.roleMenuList && this.roleMenuList.length > 0) {
            this.adminPanelService.saveRoleMenu(this.selectedRole.RoleId, this.roleMenuList).then(data => {
                Toolbox.showSaveMsg(data);
            });
        }
        else
            Toolbox.showWarning("Pleased select a Role");
    }


    private static createHeader():DataTableHeader[]{
      return [
          { value: "ParentName", text: "Parent Name", align:"left"},
          { value: "Name", text: "Name" },
          { value: "Route", text: "Route" },
          { value: "OrderNum", text: "OrderNum"}
        ];
  }

}
</script>