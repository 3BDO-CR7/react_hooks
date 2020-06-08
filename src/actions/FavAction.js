import axios from "axios";
import CONST from "../consts";
import {Toast} from "native-base";


export const setFavourite = (lang , service_id , token ) => {
    return (dispatch) => {
        axios({
            url         : CONST.url + 'fav',
            method      : 'POST',
            headers     : { Authorization: token },
            data        : {lang ,service_id }
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
