import axios from "axios";
import CONST from "../consts";


export const getServices = (lang , category_id ,token) => {
    return (dispatch) => {
        axios({
            url         : CONST.url + 'services',
            method      : 'POST',
            data        : {lang , category_id},
            headers     : {Authorization: token}
        }).then(response => {
            dispatch({type: 'getServices', payload: response.data});
        });
    }
};
