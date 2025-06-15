import axios from "axios"

const actionsConfig = {

    //auth action
    async login({ commit }, credentials) {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.post(
                `${process.env.VUE_APP_SERVER_URL}/api/auth/login`,
                credentials,
                config
            );

            const rawUsername = response?.data?.username || '';
            const lowerUsername = typeof rawUsername === 'string'
                ? rawUsername.toLowerCase()
                : rawUsername;

            const datauser = {
                id: response?.data?.id,
                username: lowerUsername,
                email: response?.data?.email
            };

            if (response.data?.token) {
                commit('SET_LOGIN_STATUS', true);
                commit('SET_EMAIL', response?.data?.email);
                commit('SET_USER_NAME', lowerUsername);
                commit('SET_USER_ID',response?.data?.id)
                localStorage.setItem("token", response?.data?.token);
                localStorage.setItem('user_info', JSON.stringify(datauser));
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    },


    async _Signup(context, infouser) {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.post(
                `${process.env.VUE_APP_SERVER_URL}/api/auth/register`,
                infouser,
                config
            );

            if (response.data) return true;

            return false;
        } catch (error) {
            return false;
        }
    },

    //load data function

    async _getDatatask(context, infouser) {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.post(
                `${process.env.VUE_APP_SERVER_URL}/api/tasks/load-task`,
                {userid:infouser?.userid},
                config
            );

            if (response.data) return true;

            return false;
        } catch (error) {
            return false;
        }
        
    },


    //orther function

    _Logout({ commit }) {
        commit('SET_LOGIN_STATUS', false);
        localStorage.clear();
    },

    _setDraw({ commit }) {
        commit('SET_DRAWER_STATUS', true);
    },
}

export default actionsConfig