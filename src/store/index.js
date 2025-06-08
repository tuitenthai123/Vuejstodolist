import stateConfig from "./state"
import gettersConfig from "./getter"
import mutationsConfig from "./mutations"
import actionsConfig from "./actions"

const storeConfig = {
    state: stateConfig,
    getters:gettersConfig,
    mutations:mutationsConfig,
    actions:actionsConfig,
}

export default storeConfig