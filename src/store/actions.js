import * as types from './mutation-types'

export const loginSuccess = ({
    commit
}, data) => {
    return commit(types.LOGIN_SUCCESS, data)
}

export const userId = ({
    commit
}, data) => {
    return commit(types.USER_ID, data)
}

export const loginFailure = ({
    commit
}) => {
    return commit(types.LOGIN_FAILURE)
}
