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
                commit('SET_USER_ID', response?.data?.id)
                commit('SET_AVATA_DATA', response?.data?.avata)
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

            switch (response.data?.message) {
                case true:
                    return {
                        noti: "Now you can use your account",
                        status: "success"
                    }
                case false:
                    return {
                        noti: "Create failed. Please check your credentials.",
                        status: "error"
                    }
                case "exist":
                    return {
                        noti: "Your email is already exist. Please check again or use another email.",
                        status: "error"
                    }
                default:
                    break;
            }

        } catch (error) {
            return false;
        }
    },

    //load data function
    async _getDatatask({ commit }, infouser) {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.post(
                `${process.env.VUE_APP_SERVER_URL}/api/tasks/load-task`,
                { userid: infouser?.userid },
                config
            );
            const tasksdata = response?.data?.taskdata[0]?.tasks

            tasksdata ? commit('SET_TASKS_DATA', JSON.parse(tasksdata)) : commit('SET_TASKS_DATA', JSON.parse("[]"));

            if (response.data) return response.data;

            return false;
        } catch (error) {
            return false;
        }

    },

    async _addNewtask({ commit }, newtasksdata) {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const stringtask = JSON.stringify(newtasksdata?.tasks)

            const add_status = await axios.post(
                `${process.env.VUE_APP_SERVER_URL}/api/tasks/add-new-tasks`,
                {
                    newtasks: stringtask,
                    user_id: newtasksdata?.userid
                },
                config
            );

            commit('SET_TASKS_DATA', newtasksdata?.tasks);
            if (add_status.data) return add_status.data;

            return false;
        } catch (error) {
            return false;
        }

    },

    async _updateNewtask({ commit }, newtasksupdate) {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const stringtask = JSON.stringify(newtasksupdate?.tasks)

            const add_status = await axios.post(
                `${process.env.VUE_APP_SERVER_URL}/api/tasks/update-new-tasks`,
                {
                    newtasks: stringtask,
                    user_id: newtasksupdate?.userid
                },
                config
            );

            commit('SET_TASKS_DATA', newtasksupdate?.tasks);
            if (add_status.data) return add_status.data;

            return false;
        } catch (error) {
            return false;
        }

    },

    async _deleteNewtask({ commit }, newtasksupdate) {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const stringtask = JSON.stringify(newtasksupdate?.tasks)

            const add_status = await axios.post(
                `${process.env.VUE_APP_SERVER_URL}/api/tasks/delete-new-tasks`,
                {
                    newtasks: stringtask,
                    user_id: newtasksupdate?.userid
                },
                config
            );

            commit('SET_TASKS_DATA', newtasksupdate?.tasks);
            if (add_status.data) return add_status.data;

            return false;
        } catch (error) {
            return false;
        }

    },

    //setting function
    async _uploadAvatar({ commit }, infoavatar) {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const avata = await axios.post(
                `${process.env.VUE_APP_SERVER_URL}/api/setting/update-avata`,
                {
                    infoavata: infoavatar
                },
                config
            );
            commit('SET_AVATA_DATA', avata?.data?.message?.urlavata)
            return false;
        } catch (error) {
            return false;
        }
    },
    async _verifyPassword(context, verifyinfo) {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const verify_status = await axios.post(
                `${process.env.VUE_APP_SERVER_URL}/api/setting/verify-password`,
                {
                    verifyinfo
                },
                config
            );
            return verify_status?.data?.message
        } catch (error) {
            return false;
        }
    },

    async _changePassword(context, changepassinfo) {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const change_status = await axios.post(
                `${process.env.VUE_APP_SERVER_URL}/api/setting/change-password`,
                {
                    changepassinfo
                },
                config
            );
            return change_status?.data?.message
        } catch (error) {
            return false;
        }
    },

    async _deleteAccount({ dispatch }, userid) {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const delete_status = await axios.post(
                `${process.env.VUE_APP_SERVER_URL}/api/setting/delete-account`,
                {
                    userid
                },
                config
            );
            if (delete_status?.data?.message) {
                dispatch('_Clearstate')
                localStorage.clear();
            }
            return delete_status?.data?.message
        } catch (error) {
            return false;
        }
    },

    //orther function
    _Logout({ dispatch }) {
        dispatch('_Clearstate')
        localStorage.clear();
    },

    _setDraw({ commit }) {
        commit('SET_DRAWER_STATUS', true);
    },

    _Clearstate({ commit }) {
        commit('SET_LOGIN_STATUS', false);
        commit('SET_DRAWER_STATUS', false);
        commit('SET_EMAIL', '');
        commit('SET_USER_NAME', '');
        commit('SET_USER_ID', '');
        commit('SET_TASKS_DATA', '');
    },
}

export default actionsConfig