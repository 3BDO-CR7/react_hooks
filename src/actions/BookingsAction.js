import axios from "axios";
import CONST from "../consts";


export const getBookings = (lang , status ,token) => {
    return (dispatch) => {
        axios({
            url         : CONST.url + 'bookings',
            method      : 'POST',
            data        : {lang, status},
            headers     : {Authorization: token}
        }).then(response => {
            dispatch({type: 'getBookings', payload: response.data});
        });
    }
};
