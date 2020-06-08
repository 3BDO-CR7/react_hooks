import axios from "axios";
import CONST from "../consts";


export const getServiceDetails = (lang , service_id ,token) => {
    return (dispatch) => {
        axios({
            url         : CONST.url + 'service_details',
            method      : 'POST',
            data        : {lang , service_id},
            headers     : {Authorization: token}
        }).then(response => {
            dispatch({type: 'getServiceDetails', payload: response.data});
        });
    }
};
