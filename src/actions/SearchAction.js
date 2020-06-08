import axios from "axios";
import CONST from "../consts";


export const getSearch = (lang , keyword , rate , category_id , date , city_id , min_price , max_price , is_offered , capacity ,token) => {
    return (dispatch) => {
        axios({
            url         : CONST.url + 'search',
            method      : 'POST',
            data        : {lang , keyword , rate , category_id , date , city_id , min_price , max_price , is_offered , capacity},
            headers     : {Authorization: token}
        }).then(response => {
            dispatch({type: 'getSearch', payload: response.data});
        });
    }
};
