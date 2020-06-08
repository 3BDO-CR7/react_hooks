import axios from "axios";
import CONST from "../consts";
import {Toast} from "native-base";



export const getNotifications = (lang , token) => {
    return (dispatch) => {
        Notifications(lang, token, dispatch)
    }
};



export const deleteNoti = (lang , notification_id , token ) => {
    return (dispatch) => {
        axios({
            url         : CONST.url + 'delete_notification',
            method      : 'POST',
            headers     : { Authorization: token },
            data        : {lang ,notification_id }
        }).then(response => {
            Notifications(lang , token , dispatch);
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


const Notifications = (lang , token , dispatch ) => {
    axios({
        url         : CONST.url + 'notifications',
        method      : 'POST',
        data        : {lang},
        headers     : {Authorization: token}
    }).then(response => {
        dispatch({type: 'getNotifications', payload: response.data});
    });
};
