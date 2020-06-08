import axios from "axios";
import CONST from "../consts";


export const getBookingDetails = (lang , booking_id ,token) => {
    return (dispatch) => {
        axios({
            url         : CONST.url + 'booking_details',
            method      : 'POST',
            data        : {lang , booking_id},
            headers     : {Authorization: token}
        }).then(response => {
            dispatch({type: 'getBookingDetails', payload: response.data});
        });
    }
};
