import React, { useState , useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ImageBackground, KeyboardAvoidingView, I18nManager, AsyncStorage, ActivityIndicator } from "react-native";
import {Container, Content, Form, Input, Item, Label, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import {useSelector, useDispatch} from 'react-redux';
import {userLogin} from '../actions';
import * as Permissions from 'expo-permissions';
import {Notifications} from 'expo'

function Login({navigation}) {

    const lang = useSelector(state => state.lang.lang);
    const auth = useSelector(state => state.auth);

    const dispatch = useDispatch()

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [userId, setUserId] = useState(null);
    const [phoneStatus, setPhoneStatus] = useState(0);
    const [passwordStatus, setPasswordStatus] = useState(0);
    const [spinner, setSpinner] = useState(false);

    const getDeviceId = async () => {
        const {status: existingStatus} = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );

        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return;
        }

        const deviceId = await Notifications.getExpoPushTokenAsync();

        setDeviceId(deviceId);
        setUserId(null);

        AsyncStorage.setItem('deviceID', deviceId);
    };

    useEffect(() => {
        getDeviceId()
    }, []);

    useEffect(() => {
		setTimeout(() => setSpinner(false), 500);
    }, [auth]);


    function activeInput(type) {
        if (type === 'phone' || phone !== '') setPhoneStatus(1);
        if (type === 'password' || password !== '') setPasswordStatus(1);
    }

    function unActiveInput(type) {
        if (type === 'phone' && phone === '') setPhoneStatus(0);
        if (type === 'password' && password === '') setPasswordStatus(0);
    }

    function validate() {
        let isError = false;
        let msg = '';

        if (phone.length <= 0) {
            isError = true;
            msg = i18n.t('namereq');
        } else if (password.length < 6) {
            isError = true;
            msg = i18n.t('passreq');
        }
        if (msg !== '') {
            Toast.show({
                text: msg,
                type: "danger",
                duration: 3000,
                textStyle: {
                    color: "white",
                    fontFamily: 'sukar',
                    textAlign: 'center',
                }
            });
        }
        return isError;
    };

    function renderSubmit() {
        if (password == '' || phone == '') {
            return (
                <View
                    style={[styles.blueBtn , styles.Width_95 , {
                        backgroundColor:'#ccc'
                    }]}
                >
                    <Text style={[styles.textRegular , styles.text_White , styles.textSize_16]}>{ i18n.t('login') }</Text>
                </View>
            );
        }

        return (
            <TouchableOpacity
                onPress={() => onLoginPressed()} style={[styles.blueBtn , styles.Width_95]}>
                <Text style={[styles.textRegular , styles.text_White , styles.textSize_16]}>{ i18n.t('login') }</Text>
            </TouchableOpacity>
        );
    }

    function onLoginPressed() {
        const err = validate();

        if (!err){
            setSpinner(true);
            dispatch(userLogin(phone, password, deviceId , lang , navigation));
        }
    }

    function renderLoader(){
        if (spinner){
            return(
                <View style={[styles.loading, styles.flexCenter, {height:'100%'}]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }

    return (
        <Container>
            {renderLoader()}
            <ImageBackground source={  I18nManager.isRTL ? require('../../assets/images/bg_languge.png') :  require('../../assets/images/bg_inverse.png')} style={[styles.bgFullWidth]}>
                <Content contentContainerStyle={[styles.bgFullWidth , styles.paddingTop_50]}>

                    <View style={[styles.position_R , styles.bgFullWidth, styles.marginVertical_15,
                        styles.marginVertical_25, styles.Width_100, styles.flexCenter]}>

                       <View style={[styles.Width_100 , styles.paddingHorizontal_30 , styles.marginBottom_50]}>
                           <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.marginBottom_25 , styles.transform , styles.alignStart]}>
                               <Image source={require('../../assets/images/back.png')} style={[styles.smImage]} resizeMode={'contain'} />
                           </TouchableOpacity>

                           <Text style={[styles.textBold , styles.text_black , styles.textSize_18 , styles.marginBottom_5 , styles.alignStart]}>{ i18n.t('login') }</Text>
                           <Text style={[styles.textRegular , styles.text_gray , styles.textSize_13 , styles.alignStart]}>{ i18n.t('loginText') }</Text>
                       </View>

                        <KeyboardAvoidingView behavior={'padding'} style={[styles.keyboardAvoid]}>
                            <Form style={[styles.Width_100 , styles.flexCenter, styles.marginVertical_10, styles.Width_90]}>
                                <View style={[styles.position_R, styles.height_70, styles.flexCenter, styles.marginBottom_5 ]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, { right: 5 }]}>
                                        <Label style={[styles.label, styles.textRegular ,{ color:phoneStatus === 1 ?  COLORS.blue :  COLORS.gray}]}>{ i18n.t('phone') }</Label>
                                        <Input style={[styles.input, styles.height_50, (phoneStatus === 1 ? styles.Active : styles.noActive)]}
                                               onChangeText={(phone) => setPhone(phone)}
                                               onBlur={() => unActiveInput('phone')}
                                               onFocus={() => activeInput('phone')}
                                               keyboardType={'number-pad'}
                                        />
                                    </Item>
                                </View>

                                <View style={[styles.position_R,  styles.height_70, styles.flexCenter, styles.marginBottom_5]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, { right: 5 }]}>
                                        <Label style={[styles.label ,{ color:passwordStatus === 1 ?  COLORS.blue :  COLORS.gray}]}>{ i18n.t('password') }</Label>
                                        <Input
                                            style={[styles.input, styles.height_50, (passwordStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(password) => setPassword(password)}
                                            onBlur={() => unActiveInput('password')}
                                            onFocus={() => activeInput('password')}
                                            secureTextEntry
                                        />
                                    </Item>
                                </View>

                                <View style={[styles.directionRowSpace , styles.Width_95 ]}>
                                    <TouchableOpacity onPress={() => navigation.push('forgetPass')}>
                                        <Text style={[styles.textRegular , styles.text_gray , styles.textSize_13]}>{ i18n.t('forgetPassword') }</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate('MainStack')}>
                                        <Text style={[styles.textRegular , styles.text_gray , styles.textSize_13]}>{ i18n.t('loginVisitor') }</Text>
                                    </TouchableOpacity>
                                </View>

                                {renderSubmit()}

                                <TouchableOpacity onPress={() => navigation.push('register')} style={[styles.rowCenter , styles.marginVertical_25]}>
                                    <Text style={[styles.textRegular , styles.text_gray , styles.textSize_13]}>{ i18n.t('haveNoAcc') } </Text>
                                    <Text style={[styles.textRegular , styles.text_blue , styles.textSize_13]}>{ i18n.t('registerNow') }</Text>
                                </TouchableOpacity>

                            </Form>
                        </KeyboardAvoidingView>
                    </View>
                </Content>
            </ImageBackground>
        </Container>
    );
}

export default Login;


