<template>
  <v-app id="inspire" white>

    <v-navigation-drawer :clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer" fixed app>
      <v-list dense >
        
        <template v-for="parent in menus">
                
          <!-- Parent Menu -->
          <!-- <v-list-group v-if="parent.Childs" v-model="parent.model" :key="parent.Name" :prepend-icon="parent.Icon" no-action  > -->
          <v-list-group v-if="parent.Childs" v-model="parent.model" :key="parent.Name" :prepend-icon="parent.Icon" value="false" ref="gb" >

            <v-list-tile slot="activator" value="false" >

              <v-list-tile-content>
                <v-list-tile-title>         
                  {{ parent.Name }}
                </v-list-tile-title>
              </v-list-tile-content>

            </v-list-tile>
 
          <!-- Child Menu -->
              <v-list-tile v-for="(child, i) in parent.Childs" :key="i" @click="onChildClick($event, child.Route)" >
                <v-list-tile-action v-if="child.Icon">
                  <v-icon>{{ child.Icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ child.Name }}
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
          <!-- Child Menu -->

          </v-list-group>
        <!-- Parent Menu -->

        </template>

      </v-list>
    </v-navigation-drawer>


<!-- Top Menu -->
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="blue darken-3" dark app fixed >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">Google Contacts</span>
      </v-toolbar-title>
      <v-text-field flat solo-inverted prepend-icon="search" label="Search" class="hidden-sm-and-down"></v-text-field>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>apps</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>notifications</v-icon>
      </v-btn>
      <v-btn icon large @click="onLogout">
        <v-avatar size="32px" tile>
          <img src="https://vuetifyjs.com/static/doc-images/logo.svg" alt="Vuetify" >
        </v-avatar>
      </v-btn>
    </v-toolbar>

  <!-- Top Menu -->

  <!-- Content -->
    <v-content>
            <router-view></router-view>
    </v-content>

  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { AppStorage } from "@/utils/app-storage";
import { Toolbox } from "@/utils/toolbox";
import { AdminPanelService } from "@/services/admin-panel.service";
import { V_Menu } from "@/models/entities";
import { UnauthorizedService } from "@/services/unauthorized.service";

@Component
export default class Home extends Vue {
      drawer = null;
      menus:V_Menu[] = [];

      private adminPanelService = new AdminPanelService();

      created(){
        const user = AppStorage.getUserIfNotAuthenticatedThenLogOut();

        this.adminPanelService.createMenu(user.Token).then(data => {
          if (data&&data.length){
            for(let j = 0; j < data.length; ++j){
              const menu:any = data[j];
              menu.model = data[j].Childs.length > 0;//bu modal' menü büyüdüğü için tutuyorum.
            }
          }
          this.menus = data;
        });

      }

      mounted(){//menu expand için eklendi.
        setTimeout(() => {
          const listGroups: any =  this.$refs.gb;
          if (listGroups&&listGroups.length){
              let j = -1;
              listGroups.forEach(btn => {
                if (++j)
                  btn.click();
              });
          }
        }, 200);
      }

      unauthorizedService = new UnauthorizedService();
      onLogout(e){ 
        const user = AppStorage.getUser();
        if (user){
            this.unauthorizedService.logOut(user.Token).then(result => {
              AppStorage.logout();
            });
        }else
          AppStorage.logout();
      }

      onChildClick(e, route:string){
        this.$router.push("/" + route);
      }

      onParentClick(e){
        Toolbox.showError("onParentClick");
      }
}
</script>


