import axios from "axios";
import CONST from "../consts";


export const getFavourite = (lang ,token) => {
    return (dispatch) => {
        axios({
            url         : CONST.url + 'fav_list',
            method      : 'POST',
            data        : {lang},
            headers     : {Authorization: token}
        }).then(response => {
            dispatch({type: 'getFavourite', payload: response.data});
        });
    }
};
