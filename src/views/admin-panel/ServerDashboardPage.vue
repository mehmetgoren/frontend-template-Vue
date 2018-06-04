<template>
<v-container fluid grid-list-md >
    <Caption text="Server Infos (Powered by Asp.Net Core SignalR)" />

        <v-card>
           <v-card-title>
                <v-toolbar dark color="primary" height="42">
                    <v-toolbar-title>Server</v-toolbar-title>
                </v-toolbar>     
            </v-card-title>

            <v-card-text>
                <v-progress-linear v-if="showProgress" :indeterminate="true"></v-progress-linear>   
                <v-container fluid >
                    <v-layout row> 

                        <v-flex xs6>
                            <v-layout row> 
                                <v-text-field label="Thread Count" v-model="info.ProcessorCount" readonly />
                            </v-layout>
                            
                            <v-layout row> 
                                <v-text-field label="Cpu %" v-model="info.CpuUsage" readonly/>
                            </v-layout>

                            <v-layout row>
                                <v-text-field label="Memory %" v-model="info.MemoryUsage" readonly/>
                            </v-layout>

                            <v-layout row>
                                <v-text-field label="HDD %" v-model="info.DiskUsage" readonly/>
                            </v-layout>

                            <v-layout row>
                                <v-flex xs6>
                                    <v-text-field label="Connected User Number" v-model="info.ActiveUserCount" readonly/>
                                </v-flex>
                                <v-flex xs6>
                                    <v-btn @click="showActiveUser"><v-icon left>face</v-icon>Show</v-btn>
                                </v-flex>
                            </v-layout>

                            <v-layout row>  
                                <v-text-field label="OS Version" v-model="info.OsVersion" readonly/>
                            </v-layout>
                        </v-flex>

                        <v-flex xs6>
                            <v-layout row> 
                                <vue-chart v-if="cmRam" type="doughnut" :data="cmRam"></vue-chart>
                            </v-layout>
                            <v-layout row> 
                                <vue-chart v-if="cmHdd" type="doughnut" :data="cmHdd"></vue-chart>
                            </v-layout> 
                        </v-flex>
                    </v-layout> 

                </v-container>

            </v-card-text>

      </v-card>

    <v-dialog v-model="showUsers"  @keydown.esc="showUsers=false" max-width="600">
      <v-card>

        <v-card-title>
            <v-toolbar dark color="primary" height="42">
                <v-toolbar-title>Connected User List</v-toolbar-title>
            </v-toolbar>     
        </v-card-title>

        <v-card-text>
            <v-data-table :headers="headers" :items="connectedUserList"  :rows-per-page-items="pages">

                <template slot="items" slot-scope="props">
                    <td class="text-xs-left">{{props.item.Username}}</td>
                    <td class="text-xs-left">{{props.item.RoleName}}</td>
                    <td class="text-xs-left">{{props.item.IsAdmin}}</td>
                    <td class="text-xs-left">{{props.item.LoginCount}}</td>
                </template>
            
            </v-data-table>
        </v-card-text>

      </v-card>

     </v-dialog>

</v-container>
</template>

<script lang="ts">

import { Component, Vue } from "vue-property-decorator";
import  { HubConnection, HubConnectionBuilder }  from '@aspnet/signalr';
import { AppStorage } from "@/utils/app-storage";
import { UtilsService } from "@/services/utils.service";
import { DataTableHeader, Vuetility } from "@/utils/vuetility";
import { ChartModel } from "@/models/entities";

@Component
export default class ServerDashBoardPage extends Vue {

    info = {};
    conn: HubConnection;
    created(){
        this.showProgress = true;
        this.conn = new HubConnectionBuilder()
            .withUrl(AppStorage.host + "/servermonitoring")
            .build();
        
        this.conn.on("notify", (data) => {
            this.info = data.info;

            console.log(JSON.stringify(data.info));

            if (!this.cmCpu) this.cmCpu = data.cmCpu;
            if (!this.cmRam) this.cmRam = data.cmRam;
            if (!this.cmHdd) this.cmHdd = data.cmHdd;

            this.showProgress = false;
        });

        this.conn.start().then(() => {
            this.conn.invoke("Start");
        }).catch(err => {
            alert(JSON.stringify(err));
        });
    }

    async destroyed(){
        if (this.conn)
            await this.conn.stop();
    }

    showProgress = false;


    //connected users
    pages = Vuetility.DataTable.defaultPages();
    headers = ServerDashBoardPage.createHeader();
    showUsers = false;
    utilsService = new UtilsService();
    connectedUserList = [];
    showActiveUser() {
        this.utilsService.getConnectedUsers()
            .then(data => {
                this.showUsers = true;
                this.connectedUserList = data;
            });
    }
    onConnectedWindowClosed() {
        this.connectedUserList = null;
    }
    private static createHeader():DataTableHeader[]{
      return [
          { value: "Username", text: "User Name" },
          { value: "RoleName", text: "RoleName" },
          { value: "IsAdmin", text: "Is Admin" },
          { value: "LoginCount", text: "Login Count"},
        ];
    }
    //

    //chart
    cmCpu: ChartModel = null;
    cmRam: ChartModel = null;
    cmHdd: ChartModel = null;
    //
}
</script>