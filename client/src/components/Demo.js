import axios from 'axios';
import {v4} from 'uuid';
const createDemoUser = (didsign)=>{

    const user_information = {
        username: v4(),
        commerce_name: 'demoCommerce',
        password: 'password',
        demoUser: 'demoUser'
    };
    axios.post('/api/commerce/signup', user_information)
    .then(res=>{
        const commerce_id = res.data.commerce_id;
        didsign(commerce_id);
    }).catch(err=>console.log(err));
    


}

export default createDemoUser;