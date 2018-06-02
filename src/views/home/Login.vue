<template>

  <v-app id="inspire">

    <v-content class="login-body">
      <v-container fluid fill-height>
        <v-layout align-center justify-center style="margin-right: -10%;">
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12" style="width:60%;">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login</v-toolbar-title>
              </v-toolbar>
              <v-form ref="form" lazy-validation @keyup.native.enter="onLogin">

                <v-card-text>       
                    <v-text-field ref="txtUsername" v-model="model.userName" :rules="rules" required prepend-icon="person" label="Login" type="text" />
                    <v-text-field v-model="model.password" :rules="rules" required prepend-icon="lock" label="Password" type="password" />
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="onLogin" color="primary" >Login</v-btn>
                </v-card-actions>

              </v-form>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

  </v-app>



</template>




<script lang="ts">
import { Component, Vue, Emit  } from "vue-property-decorator";

import { UnauthorizedService } from "@/services/unauthorized.service";
import { Toolbox } from "@/utils/toolbox";
import { AppStorage } from "@/utils/app-storage";
import { ValidationRule } from "@/utils/validation/createValidationRules";

@Component({
  // watch:{
  //   metadata:(val) => {
  //     console.log(JSON.stringify(val));
  //   }
  // }
})
export default class Login extends Vue {

  model;
  rules:ValidationRule[];
  unauthorizedService: UnauthorizedService;

  constructor() {
    super();
  }

  @Emit() 
  onSuccessfulLogin(userLocal){
    this.$emit("onSuccessfulLogin", userLocal);
  }

  created() {
    this.model = {};
    this.rules = [
        v => !!v || 'Required.',
      ]

    this.unauthorizedService = new UnauthorizedService();
  }

  mounted(){
    // setTimeout(() => {
         const txtUsername:any = this.$refs.txtUsername;
         txtUsername.focus();
    // }, 200);
  }

  onLogin() {
    const form: any = this.$refs.form;
    if (form.validate()) {
      const { userName, password } = this.model;
      this.unauthorizedService
        .login({ Username: userName, Password: password })
        .then(userLocal => {
          if (userLocal && userLocal.Token) {
            AppStorage.setUser(userLocal);
            this.onSuccessfulLogin(userLocal);
            Toolbox.showSuccess("Login successful");
          } else {
            Toolbox.showError("Unsuccessful login attempt");
          }
        });
      // const userLocal = await this.unauthorizedService.login({ Username: userName, Password: password });
      // alert(JSON.stringify(userLocal));
    }
  }
}
</script>




<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login-body {
  background: url(/img/login/login2x.png) top left no-repeat #f7f7f7;
  background-size: 100% auto;
  height: 100%;
  width: 100%;
  position: fixed;
}
</style>
