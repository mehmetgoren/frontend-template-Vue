<template>
<v-layout row justify-center>
    <v-dialog v-model="show" persistent :max-width="maxWidth" @keydown.esc="show=false">
      <v-card>
        <!-- <v-card-title class="headline">{{title}}</v-card-title> -->
        <v-card-text><label>{{text}}</label></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" flat @click.native="onChoice(true)">Cancel</v-btn>
          <v-btn color="green darken-1" flat @click.native="onChoice(false)">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>


<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";

@Component({
  watch: {
    show: {
      handler(){
        this.onShowChanged();
      },
      deep:false//To also detect nested value changes inside Objects if it's set to true;
    }
  }
})
export default class Confirm extends Vue{
    @Prop() show = false;
    //@Prop() title:"";
    @Prop() text = "";
    @Prop() maxWidth = 250;

    @Emit() 
    onChoice(result:boolean){
        this.show = false;
        this.$emit("onChoice", result);
    }
    onShowChanged(){
      if (!this.show){
         this.$emit("onChoice", false);
      }
    }
}
export interface ConfirmProps{
    show?:boolean;
    title?:string;
    text?:string;
}
</script>