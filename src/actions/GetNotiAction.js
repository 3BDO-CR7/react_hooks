import axios from "axios";
import CONST from "../consts";
import {Toast} from "native-base";


export const getNoti = (lang , status , token ) => {
    return (dispatch) => {
        axios({
            url         : CONST.url + 'get_notification',
            method      : 'POST',
            headers     : { Authorization: token },
            data        : {lang ,status }
        }).then(response => {
            dispatch({type: 'isNotify'});
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
