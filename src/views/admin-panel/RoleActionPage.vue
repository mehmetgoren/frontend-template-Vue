<template>

<v-container fluid grid-list-md >
    <Caption text="Web Api Authorization" />

        <v-layout row>
            <v-flex xs2>
                <v-btn  color="primary" @click="onSave" style="width:100%;">
                    <v-icon left>save</v-icon>
                    Save
                </v-btn>
            </v-flex>
            <v-flex xs3>
               <v-btn color="warning" @click="onDeleteUnused">
                    <v-icon left>delete</v-icon>
                    Delete Unreferenced Actions
                </v-btn>
            </v-flex>                   
        </v-layout>

        <v-layout row>
            <v-flex xs2>
                <v-card>
                    <v-card-title >
                        <v-toolbar dark color="primary" height="42">
                            <v-toolbar-title >Roles</v-toolbar-title>
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
                        <v-toolbar dark color="primary" height="42">
                            <v-toolbar-title>Controller / Action List</v-toolbar-title>
                        </v-toolbar>
                    </v-card-title>

                    <v-card-text>
                        <div v-if="roleActionTree">
                            <v-expansion-panel focusable>
                                <v-expansion-panel-content v-for="node in roleActionTree" :key="node.Label">
                                    <div slot="header"> 

                                        <!-- <v-toolbar>
                                            <v-icon>done_all</v-icon>
                                            <v-toolbar-title>{{node.Label}}</v-toolbar-title>
                                            <v-spacer></v-spacer>
                                        </v-toolbar> -->

                                        <!-- <v-layout row>
                                            <v-flex xs4>
                                                {{node.Label}}
                                            </v-flex>
                                            <v-flex xs2>
                                                <v-checkbox label="Select All" />
                                            </v-flex>
                                        </v-layout> -->                           
                                        
                                        {{node.Label}}
                                       
                                    </div>
                                    <v-card>
                                        <v-card-title>
                                            <v-btn color="light-blue" @click="onSelectAll(node)" >{{ (selectAllChecks[node.Label] ? "Unselect All" : "Select All") }}</v-btn>
                                        </v-card-title>
                                        <v-card-text>
                                           
                                            <span v-if="node.Children" v-for="child in node.Children" :key="node.label+child.Label">

                                                <!-- <v-layout row>
                                                <v-flex xs1>
                                                     <input type="checkbox" v-model="child.Checked" />
                                                </v-flex>
                                                <v-flex xs3>
                                                    <label>{{child.Label}}</label>
                                                </v-flex>
                                                </v-layout> -->
                                               
                                                <v-checkbox :label="child.Label" v-model="child.Checked" />
                                            </span>
                                            <v-divider />
                                        </v-card-text>
                                    </v-card>

                                </v-expansion-panel-content>
                            </v-expansion-panel>

                        </div>

                    </v-card-text>
                </v-card>
            </v-flex>


        </v-layout>


</v-container>

</template>


<script lang="ts">

import { Component, Vue } from "vue-property-decorator";
import { AdminPanelService } from "@/services/admin-panel.service";
import { Role, TreeNode, SaveRoleActionsModel } from "@/models/entities";
import { Toolbox } from "@/utils/toolbox";

@Component
export default class RoleActionPage extends Vue {

    adminPanelService = new AdminPanelService();
    roles:Role[] = [];

    created(){
        this.dataBind();
    }

    private dataBind() {
        this.adminPanelService.getRolesNoAdmin().then(data => {
            this.roles = data;
        });
    } 

    selectAllChecks = {};
    roleActionTree: TreeNode[] = null;
    selectedRole: Role = null;
    onRoleChanged(r: Role) {
        this.selectAllChecks = {};
        this.roleActionTree = [];
        this.selectedRole = null;

        if (r && r.RoleId && r.RoleId > 0) {
            this.selectedRole = r;
            this.adminPanelService.getApiActionsHierarchical(r.Name).then(data => {
                this.roleActionTree = data;
                if (data){
                    data.forEach(i => {
                        this.selectAllChecks[i.Label] = false;
                    });
                }
            });
        }
    }

    onSelectAll(node:TreeNode){
        if (node&&node.Children&&node.Children.length){
            this.selectAllChecks[node.Label] = !this.selectAllChecks[node.Label];
            node.Children.forEach(i => i.Checked = this.selectAllChecks[node.Label]);
        }
    }

    onSave(){
        const temp: SaveRoleActionsModel = {};
        temp.Data = this.roleActionTree;// this.postModelRoleActions;
        temp.RoleName = this.selectedRole.Name;
        this.adminPanelService.saveActionRoles(temp).then(data => {
            Toolbox.showSaveMsg(data);
        });
    }

    onDeleteUnused() {
        this.adminPanelService.clearUnusedRoleActions().then(data => {
            Toolbox.showSuccess("Deleted unused record count: " + data);
        });
    }
}
</script>