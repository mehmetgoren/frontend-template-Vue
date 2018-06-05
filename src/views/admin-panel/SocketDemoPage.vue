<template>
<img v-if="image" :src="image" width="300" height="300">
</template>


<script lang="ts">

import { Component, Vue } from "vue-property-decorator";
import  { HubConnection, HubConnectionBuilder }  from '@aspnet/signalr';
import { AppStorage } from "@/utils/app-storage";

@Component
export default class SocketDemoPage extends Vue {

    image = null;

     conn: HubConnection;
     created(){
         this.conn = new HubConnectionBuilder()
            .withUrl(AppStorage.host + "/hubs/images?token=" + AppStorage.getUserIfNotAuthenticatedThenLogOut().Token)
            .build();
        

        this.conn.on("notify", (data) => {
            this.image = 'data:image/png;base64,' + data;
        });

        this.conn.start().then(() => {
            this.conn.invoke("FloodImages");
        }).catch(err => {
            alert(JSON.stringify(err));
        });
    }

    async destroyed(){
        if (this.conn)
            await this.conn.stop();
     }

}
</script>