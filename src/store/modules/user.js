import * as types from '../mutation-types';

const state = {
    user: {},
}

// mutations
const mutations = {
    [types.LOGIN_SUCCESS](state, data) {
        state.user = Object.assign({}, state.user, data)
    },
    [types.LOGIN_FAILURE](state) {
        state.user = {}
    },
    [types.USER_ID](state,data){
        state.user = Object.assign({}, state.user, data)
    }
}

export default {
  state,
  mutations
}
