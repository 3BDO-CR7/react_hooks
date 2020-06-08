import axios from "axios";
import CONST from "../consts";


export const getTopRate = (lang , is_top ,token) => {
    return (dispatch) => {
        axios({
            url         : CONST.url + 'top_rate',
            method      : 'POST',
            data        : {lang , is_top},
            headers     : {Authorization: token}
        }).then(response => {
            dispatch({type: 'getTopRate', payload: response.data});
        });
    }
};
