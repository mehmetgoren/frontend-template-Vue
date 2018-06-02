import Vue from 'vue';
import Vuex from 'vuex';

import metadata from './metadata';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    metadata
  }
});

export default store;