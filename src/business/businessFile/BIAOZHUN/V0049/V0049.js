import storage from '../../../../tools/storage.js'
import definecfg from '../../../../config/defineConfig.js'
import V0049_CUST from './V0049_CUST.js';
import V0049_ORG from './V0049_ORG.js';
import V0049_PRO from './V0049_PRO.js';
const V0049 = () => {
    let customerInfo = storage.$storage.getJsonSession(definecfg.$definecfg.CUSTOMER_INFO);
    let userType = customerInfo.USER_TYPE || "";
    let fn = {};
    if(userType == "0") {
        fn = _.cloneDeep(V0049_CUST);
    }
    if(userType == "1") {
        fn = _.cloneDeep(V0049_ORG);
    }
    if(userType == "2") {
        fn = _.cloneDeep(V0049_PRO);
    }
    return fn;
} 
export default V0049();