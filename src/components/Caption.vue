<template>
<h2 class="headline primary--text">
    <div>
        <p v-if="text">{{text.toString()}}</p>
    </div>
</h2>
</template>




<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Caption extends Vue{
    @Prop() text:string;
}
</script>