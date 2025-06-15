import stateConfig from "./state"
import gettersConfig from "./getter"
import mutationsConfig from "./mutations"
import actionsConfig from "./actions"
import createPersistedState from "vuex-persistedstate";

const storeConfig = {
    state: stateConfig,
    getters:gettersConfig,
    mutations:mutationsConfig,
    actions:actionsConfig,
    plugins: [createPersistedState()],
}

export default storeConfig