import axios from "axios";
import CONST from "../consts";


export const getAbout = lang => {
    return (dispatch) => {
        axios({
            url         : CONST.url + 'about_app',
            method      : 'POST',
            data        : { lang }
        }).then(response => {
            dispatch({type: 'getAbout', payload: response.data});
        });
    }
};
