import axios from 'axios';
import { AsyncStorage, Platform } from 'react-native';
import { Toast } from 'native-base'
import CONST from '../consts';

export const userLogin = (phone, password, deviceId, lang , navigation) => {
    return (dispatch) => {

        dispatch({type: 'login_user'});

        axios.post(
            CONST.url + 'login',
            {phone, password, lang, device_id: deviceId, type: 'user'})
            .then(
                response => handelLogin(dispatch, response.data , navigation)
            )
            .catch(
                error => console.warn(error.data)
            );
    };
};

export const register = (data, navigation) => {
    return (dispatch) => {
        AsyncStorage.getItem('deviceID').then(device_id => {
            axios({
                url: CONST.url + 'register',
                method: 'POST',
                data: {
                    name			    : data.username,
                    phone			    : data.phone,
                    email			    : data.email,
                    type			    : 'user',
                    password		    : data.password,
                    lang 			    : data.lang,
                    device_id
                }
            }).then(response => {
                dispatch({type: 'register', payload: response.data});
                if (response.data.success){
                    navigation.navigate('activationCode', {
                        code			: response.data.data.code,
                        userId			: response.data.data.user_id,
                    });
                }

                console.log('message', response.data.message);

                Toast.show({
                    text        	: response.data.message,
                    type			: response.data.success ? "success" : "danger",
                    duration    	: 3000,
                    textStyle   	: {
                        color       	: "white",
                        fontFamily  	: 'sukar',
                        textAlign   	: 'center'
                    }
                });

            })
        })

    }
};


export const activeAccount = (userId, lang) => {
	return (dispatch) => {
		axios({
			url: CONST.url + 'active_account',
			method: 'POST',
			data: {
				user_id	: userId,
				lang
			}
		}).then(response => {
			dispatch({type: 'active_account', data: response.data});

			Toast.show({
				text        	: response.data.message,
				type			: response.data.success ? "success" : "danger",
				duration    	: 3000,
				textStyle   	: {
					color       	: "white",
					fontFamily  	: 'sukar',
					textAlign   	: 'center'
				}
			});

		})

	}
};

export const checkPhone = (phone, lang, navigation) => {
	return (dispatch) => {
		axios({
			url: CONST.url + 'check_phone',
			method: 'POST',
			data: { phone, lang }
		}).then(response => {
			if (response.data.success)
				navigation.navigate('resetPass', { activeCode: response.data.data.code, id: response.data.data.id });

			Toast.show({
				text        	: response.data.message,
				type			: response.data.success ? "success" : "danger",
				duration    	: 3000,
				textStyle   	: {
					color       	: "white",
					fontFamily  	: 'sukar',
					textAlign   	: 'center'
				}
			});

		})
	}
};

export const resetPassword = (id, password, lang, navigation) => {
	return (dispatch) => {
		axios({
			url: CONST.url + 'reset_password',
			method: 'POST',
			data: { id, password, lang }
		}).then(response => {
			if (response.data.success)
				navigation.navigate('login');

			Toast.show({
				text        	: response.data.message,
				type			: response.data.success ? "success" : "danger",
				duration    	: 3000,
				textStyle   	: {
					color       	: "white",
					fontFamily  	: 'sukar',
					textAlign   	: 'center'
				}
			});

		})
	}
};


export const tempAuth = () => {
    return (dispatch) => {
        dispatch({type: 'temp_auth'});
    };
};

const handelLogin = (dispatch, data , navigation) => {
    if (!data.success){
        loginFailed(dispatch, data , navigation)
    }else{
        loginSuccess(dispatch, data , navigation)
    }

	Toast.show({
		text        : data.message,
		type        : data.success ? "success" : "danger",
		duration    : 3000,
		textStyle   : {
			color       : "white",
			fontFamily  : 'sukar',
			textAlign   : 'center'
		}
	});
};


const loginSuccess = (dispatch, data , navigation) => {
    AsyncStorage.setItem('token', JSON.stringify(data.data.token))
        .then(() => dispatch({type: 'login_success', data }));
};

const loginFailed = (dispatch, error , navigation) => {
	if(error.data.code) {
		navigation.navigate('activationCode', {
			code			: error.data.code,
			userId			: error.data.user_id,
		});
	}
    dispatch({type: 'login_failed', error});
};
