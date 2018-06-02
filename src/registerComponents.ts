
import Vue from 'vue'
import Loading from "@/components/Loading.vue";
import Caption from "@/components/Caption.vue";
import Msg from "@/components/Msg.vue";
import Confirm from "@/components/Confirm.vue";
import DialogToolbar from "@/components/DialogToolbar.vue";

const registerComponents = () => {
    Vue.component("Loading",Loading);  
    Vue.component("Caption",Caption);
    Vue.component("Confirm",Confirm);
    Vue.component("DialogToolbar",DialogToolbar);
};

export default registerComponents;