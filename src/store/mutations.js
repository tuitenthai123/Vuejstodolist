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
    },
    SET_USER_ID(state, status) {
        state.user_id = status
    },
    SET_TASKS_DATA(state, status) {
        state.tasks = status
    },
    SET_AVATA_DATA(state, status) {
        state.avata = status
    },
}

export default mutationsConfig