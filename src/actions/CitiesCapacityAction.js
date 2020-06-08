import axios from "axios";
import CONST from "../consts";


export const geCitiesCapacity = (lang ,token) => {
    return (dispatch) => {
        axios({
            url         : CONST.url + 'cities_capacity',
            method      : 'POST',
            data        : {lang},
            headers     : {Authorization: token}
        }).then(response => {
            console.log('citiesCapacity___', response.data);
            dispatch({type: 'geCitiesCapacity', payload: response.data});
        });
    }
};
