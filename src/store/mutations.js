const mutationsConfig = {
    SET_LOGIN_STATUS(state, status) {
        state.islogin = status
    },
    SET_DRAWER_STATUS(state, status) {
        state.drawer = status
    }
}

export default mutationsConfig