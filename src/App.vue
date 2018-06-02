<template>
<div id="app">
    <!-- <Home v-if="visible"  /> -->
    <!-- <Login @onSuccessfulLogin="onSuccessfulLogin" v-else /> -->
    <Login v-if="!authenticated&&!metadata" @onSuccessfulLogin="onSuccessfulLogin"  />
    <Loading v-if="authenticated&&!metadata" />
    <Home v-if="authenticated&&metadata" /> 
</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Getter, Action, Mutation, namespace } from "vuex-class";
import { UtilsService } from "@/services/utils.service";
import Home from "@/views/home/Home.vue";
import Login from "@/views/home/Login.vue";
import { UserLocal } from "@/models/entities";
import { AppStorage } from "@/utils/app-storage";

@Component({
  components: { Home, Login }
})
export default class App extends Vue {
  @Action("pullMetadata") readonly pullMetadata;
  @Getter("metadata") readonly metadata;

  utilsService: UtilsService;
  authenticated;

  created() {
    this.utilsService = new UtilsService();
    this.authenticated = false;

    const user = AppStorage.getUser();
    if (user){
      this.authenticated = true;
      this.pullMetadata(this.utilsService).then(data => {});
    }
  }

  onSuccessfulLogin(utilsServiceLocal: UserLocal) {
    this.authenticated = true;
    this.pullMetadata(this.utilsService).then(data => {});
  }
}
</script>
