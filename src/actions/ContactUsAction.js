import axios from "axios";
import CONST from "../consts";
import {Toast} from "native-base";


export const getContactUs = lang => {
    return (dispatch) => {
        axios({
            url         : CONST.url + 'contact_us',
            method      : 'POST',
            data        : { lang }
        }).then(response => {
            dispatch({type: 'getContactUs', payload: response.data});
        });
    }
};

export const sendComplaint = (lang , complaint , token ) => {
    return (dispatch) => {
        axios({
            url         : CONST.url + 'send_complaint',
            method      : 'POST',
            headers     : { Authorization: token },
            data        : {lang ,complaint }
        }).then(response => {
            Toast.show({
                text        : response.data.message,
                type        : response.data.success ? "success" : "danger",
                duration    : 3000,
                textStyle   : {
                    color       : "white",
                    fontFamily  : 'sukar',
                    textAlign   : 'center'
                }
            });
        });

    }
};