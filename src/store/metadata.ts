
import Vuex, {Commit, Getter} from 'vuex'
import { Field } from '@/models/entities';
import { UtilsService } from '@/services/utils.service';
import { AppStorage } from '@/utils/app-storage';
  

//state
const state : IMetadataState = {
    metadata: null,
    failedReason: null
};
//

//getters
const getters = {
    metadata: (state: IMetadataState) => state.metadata,
    failedReason : (state:IMetadataState) => state.failedReason
};
//

//actions
const actions = {
    pullMetadata(context, utilsService: UtilsService){
        const typefullNameList: string[] = [];
        for (let item in Types) {
            typefullNameList.push(Types[item]);
        }

        return new Promise((resolve, reject) => {
            utilsService.getMetaData(typefullNameList).then(metadata => {
                context.commit("setMetadata", metadata);
                resolve(metadata);
            }).catch(reason => {
                context.commit("setMetadataFailed", reason)
                reject(reason);
                AppStorage.logout();
            });
        });
    }
};
//


// mutations
const mutations = {
    setMetadata(state, metadata) {
        state.metadata = metadata;
    },

    setMetadataFailed(state, reason) {
        state.failedReason = reason;
    }
};
//


export const Types = {
    Role: "Server.Models.Role",
    Menu: "Server.Models.Menu",
    AppUser: "Server.Models.AppUser",
    V_AppUser: "Server.Models.V_AppUser",
    AppSetting:"Server.Models.AppSetting"
}

export default {
    state,
    getters,
    actions,
    mutations
}


export type Metadata = { [name: string]: Field[] };

export interface IMetadataState{
    metadata?:Metadata;
    failedReason?; 
}

