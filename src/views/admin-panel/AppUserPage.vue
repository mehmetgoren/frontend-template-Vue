<template>
<v-container fluid grid-list-md >
    <Caption text="Application Users" />
    <v-card @keyup.native.enter="onSearch">
        <v-card-text>
          <v-form ref="formSearch" @keyup.native.enter="onSearch" >
              <v-layout row wrap>     
                  <v-flex xs12 sm3>
                      <v-text-field v-model="search.Username" label="User Name" />
                  </v-flex>

                  <v-flex xs12 sm3>
                      <v-select :items="roles" v-model="search.RoleId" placeholder="Select a Role" max-height="auto" />
                  </v-flex>
                  
                  <v-flex xs12 sm3>
                    <v-btn large color="primary" @click="onSearch">
                      <v-icon>search</v-icon>
                    </v-btn>
                    <v-btn large color="primary" @click="onSearchReset">
                      <v-icon>not_interested</v-icon>
                    </v-btn>
                  </v-flex>
              </v-layout>
            </v-form>
        </v-card-text>
    </v-card>

    <v-spacer>
        <v-btn slot="activator" color="primary" dark class="mb-2" @click="selected={}">
          <v-icon left>note_add</v-icon>           
          <label>New Item</label>
        </v-btn>
    </v-spacer>

    <v-card>

      <v-card-text>
        <v-data-table :headers="headers" :items="v_AppUserList" :pagination.sync="pagination" :loading="loading" 
         :total-items="total" :rows-per-page-items="pages">

          <template slot="items" slot-scope="props">
              <td class="text-xs-left">{{props.item.Username}}</td>
              <td class="text-xs-left">{{props.item.RoleName}}</td>
              <td class="text-xs-left">{{props.item.IsAdmin}}</td>
              <td class="text-xs-left">{{props.item.LoginCount}}</td>
              <td class="text-xs-left">
                    <v-btn icon class="mx-0" @click="selected=props.item">
                      <v-icon color="teal">edit</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0" @click="onDelete(props.item)">
                      <v-icon color="pink">delete</v-icon>
                    </v-btn>
              </td>
          </template>
          
        </v-data-table>
      </v-card-text>
    </v-card>

     <v-dialog v-model="selected" v-if="selected" @keydown.esc="selected=null" :persistent="true" max-width="500px" >
      <v-card>
        <DialogToolbar @onClose="selected=null" />
        <v-card-text>
            <v-form ref="form" lazy-validation @keyup.native.enter="onSave" >
              <v-container fluid >

                <v-layout row> 
                  <v-select :rules="rules.RoleId" :items="rolesForm" v-model="selected.RoleId" placeholder="Select a Role" max-height="auto"  />
                </v-layout>

                <v-layout row> 
                  <v-text-field :rules="rules.Title" label="Title" v-model="selected.Title" />
                </v-layout>
                
                <v-layout row> 
                  <v-text-field :rules="rules.Username" label="User Name" v-model="selected.Username" />
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-text-field :rules="rules.Password" v-model="selected.Password" type="password" label="Password" />
                  </v-flex>
                </v-layout>

                <!-- <v-layout row>
                  <v-flex xs2>
                    <label>Is Admin</label>
                  </v-flex>
                  <v-flex xs10>
                    <v-checkbox :rules="rules.IsAdmin" v-model="selected.IsAdmin"/> 
                  </v-flex>          
                </v-layout> -->
                
              </v-container>
            </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="!valid" @click="onSave">
            <v-icon>save</v-icon>
            Save
            </v-btn>
          <v-btn @click="onClear">
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
import { V_AppUser, Role, SearchSortRequest } from "@/models/entities";
import { SelectItem } from "@/models/custom.models"
import { AdminPanelService } from "@/services/admin-panel.service";
import { Toolbox } from "@/utils/toolbox";
import { UtilsService } from "@/services/utils.service";
import { Types } from "@/store/metadata";
import { createValidationRules, ValidationRules } from "@/utils/validation/createValidationRules";
import { Vuetility, DataTableHeader, Pagination } from "@/utils/vuetility";

@Component({
  watch:{
    pagination:{
      handler(){
        this.onPaginationChanged();
      },
      deep:false//To also detect nested value changes inside Objects if it's set to true;
    }
  }
})
export default class AppUserPage extends Vue {

pages = Vuetility.DataTable.defaultPages(); //Vuetility.// [5,10,25,50,100,250];


  search: V_AppUser = {};
  adminService = new AdminPanelService();
  utilsService = new UtilsService();
  roles: SelectItem[] = [];

  //#region   |   DataTable   |
  v_AppUserList:V_AppUser[] = [];
  total = 0;
  loading = true;
  readonly pagination:Pagination = {};
  headers:DataTableHeader[] = AppUserPage.createHeader();
  //#endregion


  //dialog
  selected = null;
  valid = true;
  rules:ValidationRules = null;
  rolesForm:SelectItem[]= [];
  onSave(e){
    if (Toolbox.isFormValid(this.$refs.form)){
       this.adminService.saveAppUser(this.selected).then(result => {
         Toolbox.showSaveMsg(result);
         if (result > 0)
            this.selected = null;
       });
    }
  }
  onClear(e){
    (<any>this.$refs.form).reset();
  }
  async onDelete(model:V_AppUser){
    if (await Toolbox.showConfirm("Confirm", "Are you sure to delete this record?")){
       const result: number = await this.adminService.deleteAppUser(model.AppUserId);
       Toolbox.showDeleteMsg(result);
       if (result > 0)
          this.dataBind();
    }
  }
  //

  created() {
    this.rules = createValidationRules(Types.V_AppUser, ['RoleId', 'Username', 'Password']);
    this.adminService.getRoles().then(data => {
      this.roles = Toolbox.toSelectItemList(data, "RoleId", "Name", {value:-1, text:"   "} );
      this.rolesForm = Toolbox.toSelectItemList(data, "RoleId", "Name");
    });

    this.dataBind();
  }

  private dataBind(){
    if (this.search.RoleId < 1)
        this.search.RoleId = undefined;
    this.loading = true;
    let sortField:SearchSortRequest = null;

    const { sortBy, descending, page, rowsPerPage } = this.pagination
    if (sortBy){
      sortField = {};
      sortField.field = sortBy;
      sortField.dir = (descending ? 1 : 0);
    }
    this.utilsService.search(Types.V_AppUser, this.search, rowsPerPage, page, sortField, false).then(data => {
      this.v_AppUserList = data.Data;
      this.total = data.Total;
      this.loading = false;
    });
  }

  onSearch(e){
    this.dataBind();
  }
  onSearchReset(e){
    (<any>this.$refs.formSearch).reset();
  }

  onPaginationChanged(){
    this.dataBind();
  }


  private static createHeader():DataTableHeader[]{
      return [
          { value: "Username", text: "User Name", align: "left"},
          { value: "RoleName", text: "Role Name" },
          { value: "IsAdmin", text: "Is Admin?", sortable: false },
          { value: "LoginCount", text: "Login Count"},
          // { value:"Action", text:"Action",  sortable:false}
        ];
  }
}
</script>








    <!-- <v-container fluid >Bu Şablondan Yürü.
      <Caption text="Application Users" />
    <v-layout row>
      <v-flex xs4>
        <v-subheader>Normal with hint text/label</v-subheader>
      </v-flex>
      <v-flex xs8>
        <v-text-field
          id="testing"
          name="input-1"
          label="Label Text"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs4>
        <v-subheader>Focus</v-subheader>
      </v-flex>
      <v-flex xs8>
        <v-text-field
          name="input-2"
          label="Label Text"
          value="Input text"
          class="input-group--focused"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs4>
        <v-subheader>Normal with input text + label</v-subheader>
      </v-flex>
      <v-flex xs8>
        <v-text-field
          name="input-3"
          label="Label Text"
          value="Input text"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs4>
        <v-subheader>Disabled</v-subheader>
      </v-flex>
      <v-flex xs8>
        <v-text-field
          name="input-3"
          label="Label Text"
          value="Input text"
          disabled
        ></v-text-field>
      </v-flex>
    </v-layout>
  </v-container> -->

