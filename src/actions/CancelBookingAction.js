import axios from "axios";
import CONST from "../consts";
import {Toast} from "native-base";


export const cancelBooking = (lang , booking_id , token , navigation ) => {
    return (dispatch) => {
        axios({
            url         : CONST.url + 'cancel_booking',
            method      : 'POST',
            headers     : { Authorization: token },
            data        : {lang ,booking_id }
        }).then(response => {
            if (response.data.success) {

                navigation.navigate('confirmCancellation')

            }
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
