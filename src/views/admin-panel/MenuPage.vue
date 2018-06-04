<template>

<v-container fluid grid-list-md >
    <Caption text="Application Menu Tree" />
    <v-card>
        <v-card-title>
          <v-btn color="primary" @click="selected={}"><v-icon left>add</v-icon> Add New Item</v-btn>
          <v-spacer></v-spacer>
          <v-text-field  v-model="searchText"  append-icon="search"  label="Search" single-line hide-details ></v-text-field>
        </v-card-title>
    
        <v-card-text>
          <v-data-table :headers="headers" :items="menus" :rows-per-page-items="pages" :search="searchText" >
          <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{props.item.ParentName}}</td>
              <td class="text-xs-left">{{props.item.Name}}</td>
              <td class="text-xs-left">{{props.item.Route}}</td>
              <td class="text-xs-left">{{props.item.OrderNum}}</td>
              <td class="text-xs-left">{{props.item.Visible}}</td>
              <td class="text-xs-left">{{props.item.Icon}}</td>
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
        <DialogToolbar title="Edit Menu" @onClose="selected=null" />
        <v-card-text>
            <v-form ref="form" lazy-validation @keyup.native.enter="onSave" >
              <v-container fluid >

                <v-layout row> 
                  <v-select  :items="menuSelectItems" v-model="selected.ParentId" placeholder="Parent" max-height="auto"  />
                </v-layout>

                <v-layout row> 
                  <v-text-field :rules="rules.Name" label="Name" v-model="selected.Name" />
                </v-layout>
                
                <v-layout row> 
                  <v-text-field :rules="rules.Route" label="Route" v-model="selected.Route" />
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-text-field type="number" :rules="rules.OrderNum" v-model="selected.OrderNum" label="Order" />
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs2>
                    <label>Visible</label>
                  </v-flex>
                  <v-flex xs10>
                    <v-checkbox :rules="rules.Visible" v-model="selected.Visible"/> 
                  </v-flex>          
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-text-field :rules="rules.Icon" v-model="selected.Icon" label="Icon" />
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
import { V_Menu } from "@/models/entities";
import { SelectItem } from "@/models/custom.models"
import { AdminPanelService } from "@/services/admin-panel.service";
import { Toolbox } from "@/utils/toolbox";
import { Types } from "@/store/metadata";
import { createValidationRules, ValidationRules } from "@/utils/validation/createValidationRules";
import { List } from "@/utils/linq";
import { DataTableHeader } from "@/utils/vuetility";

@Component
export default class MenuPage extends Vue {

  pages = [10,25,50];
  headers=MenuPage.createHeader();
  menus:V_Menu[] = [];
  menuSelectItems:SelectItem[] = [];
  adminService = new AdminPanelService();
  selected:V_Menu=null;

  //search
  searchText = null; 
  //

  //validation
  rules:ValidationRules = null;
  //

  created(){
      this.rules = createValidationRules(Types.Menu, ["ParentId", "Name", "Route", "OrderNum", "Visible", "Icon"]);

      this.dataBind();
  }

  private dataBind(){
        this.adminService.getMenus().then(data => {
        this.menus = data;
        let list = List.create(data);
          this.menuSelectItems = Toolbox.toSelectItemList(list.where(p => p.ParentId == null).orderBy(p => p.OrderNum).toArray(), "MenuId","Name", {value:null, text:"None"});
      });
  }

  onSave(){
    if (!this.selected.Icon) {
       this.selected.Icon = this.selected.ParentId ? "fiber_manual_record" : "apps";
    }

    if (Toolbox.isFormValid(this.$refs.form)) {
        this.adminService.saveMenu(this.selected).then(data => {
          this.dataBind();
          Toolbox.showSaveMsg(data);
        });
    }
  }

  async onDelete(menu:V_Menu){
    Toolbox.showDeleteMsg(await this.adminService.deleteMenu(menu.MenuId));
    this.dataBind();
  }
  onEdit(menu:V_Menu){
    this.selected = Object.assign({}, menu);
  }

  onReset(e){
    (<any>this.$refs.form).reset();
  }

  private static createHeader():DataTableHeader[]{
      return [
          { value: "ParentName", text: "Parent"},
          { value: "Name", text: "Name"},
          { value: "Route", text: "Login Count"},
          { value: "OrderNum", text: "Order"},
          { value: "Visible", text: "Visible"},
          { value: "Icon", text: "Icon"},
        ];
  }

}
</script>