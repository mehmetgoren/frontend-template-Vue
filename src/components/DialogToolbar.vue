<template>
<v-toolbar dark color="primary">
    <v-icon>{{icon}}</v-icon>
    <v-toolbar-title>{{title}}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
       <v-btn @click="onClose" flat><v-icon>close</v-icon></v-btn>
    </v-toolbar-items>
</v-toolbar>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";

// @Component({
//     props:{
//         icon: {default:"edit", type:String }, 
//         title:String
//     }
// })
@Component
export default class DialogToolbar extends Vue {

    // private _icon;
    // @Prop() get icon() { return this._icon ? this._icon : "edit" };

    // private _title;
    // @Prop() get title() { return this._title ? this._title : "Edit User" };

    @Prop({default:"edit"}) icon:string;

    @Prop({default:"Edit User"}) title:string;

    
    @Emit() 
    onClose(){
        this.$emit("onClose");
    }
}
</script>