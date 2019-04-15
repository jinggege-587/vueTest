import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import user from './modules/user';
import createLogger from 'vuex/dist/logger';

Vue.use(Vuex)

const debug = process.env.NODE_ENV != 'production'
// const debug = false

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    user,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
