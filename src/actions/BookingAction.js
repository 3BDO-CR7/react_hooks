import axios from "axios";
import CONST from "../consts";
import {Toast} from "native-base";


export const newBooking = (lang , service_id , date , payment_type , token , navigation) => {
    return (dispatch) => {
        axios({
            url         : CONST.url + 'new_booking',
            method      : 'POST',
            headers     : { Authorization: token },
            data        : {lang ,service_id , date , payment_type }
        }).then(response => {
            if (response.data.success) {

                navigation.navigate('home')

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
