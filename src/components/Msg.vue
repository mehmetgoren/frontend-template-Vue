<template>
  <v-snackbar v-id="model"
      :timeout="4000"
      :bottom="true"
      :right="true"
      :multi-line="true"
      :vertical="true"
      v-model="model.show"
      :color="values.color"
  >
  <v-icon>{{values.icon}}</v-icon>
  {{ model.text }}
  </v-snackbar>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Msg extends Vue{
    @Prop() model:MsgProps;

    get values(){
        if (this.model&&this.model.type){
            switch(this.model.type){
                case MsgType.error:
                    return  Msg.Error;
                case MsgType.success:
                    return  Msg.Success;
                case MsgType.warning:
                    return  Msg.Warning;
            }
        }

        return Msg.Info;
    }

    private static Info = {icon:"info", color:"cyan"};
    private static Error = {icon:"error", color:"red"};
    private static Success = {icon:"check_box", color:"teal"};
    private static Warning = {icon:"warning", color:"orange"};
}

export interface MsgProps{
    show?:boolean;
    text?:string;
    type?:string;
}
export enum MsgType{
    info = "info",
    error = "error",
    success = "success",
    warning = "warning"
}
</script>