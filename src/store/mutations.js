const mutationsConfig = {
    SET_LOGIN_STATUS(state, status) {
        state.islogin = status
    },
    SET_DRAWER_STATUS(state, status) {
        state.drawer = status
    },
    SET_EMAIL(state, status) {
        state.email = status
    },
    SET_USER_NAME(state, status) {
        state.username = status
    }
}

export default mutationsConfig