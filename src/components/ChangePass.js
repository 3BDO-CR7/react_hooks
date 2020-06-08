import React, { useState , useEffect } from "react";
import {View, Text, Image, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView} from "react-native";
import {Container, Content, Form, Input, Item, Label, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import {useDispatch, useSelector} from "react-redux";
import {changePass} from '../actions';

function ChangePass({navigation}) {

    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user.data.token);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [repeatPass, setRepeatPass] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [repeatPassStatus, setRepeatPassStatus] = useState(0);
    const [passwordStatus, setPasswordStatus] = useState(0);
    const [confirmPassStatus, setConfirmPassStatus] = useState(0);

    const dispatch = useDispatch();

    useEffect(() => {
        setIsSubmitted(false)
    }, [isSubmitted]);


    function renderConfirm(){
        if (password == '' || repeatPass == '' || confirmPass == ''){
            return (
                <View style={[styles.blueBtn , styles.Width_95 , {backgroundColor:'#ccc'}]}>
                    <Text style={[styles.textRegular , styles.text_White , styles.textSize_16]}>{ i18n.t('confirm') }</Text>
                </View>
            );
        }
        if (isSubmitted){
            return(
                <View style={[{ justifyContent: 'center', alignItems: 'center' } , styles.marginTop_25]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        return (
            <TouchableOpacity onPress={() => onConfirm()} style={[styles.blueBtn , styles.Width_95]}>
                <Text style={[styles.textRegular , styles.text_White , styles.textSize_16]}>{ i18n.t('confirm') }</Text>
            </TouchableOpacity>

        );
    }
    function onConfirm(){

        if (confirmPass.length < 6){
            Toast.show({
                text        : i18n.t('passreq'),
                type        : "danger",
                duration    : 3000,
                textStyle   : {
                    color       : "white",
                    fontFamily  : 'sukar',
                    textAlign   : 'center'
                }
            });
            return false
        }else if(repeatPass !== confirmPass){
            Toast.show({
                text        : i18n.t('passError'),
                type        : "danger",
                duration    : 3000,
                textStyle   : {
                    color       : "white",
                    fontFamily  : 'sukar',
                    textAlign   : 'center'
                }
            });
            return false
        } else {
            setIsSubmitted(true)
            dispatch(changePass(lang , password , confirmPass , token , navigation));
        }
    }

    function activeInput(type) {

        if (type === 'repeatPass' || repeatPass !== '') {
            setRepeatPassStatus(1)
        }

        if (type === 'password' || password !== '') {
            setPasswordStatus(1)
        }

        if (type === 'confirmPass' || confirmPass !== '') {
            setConfirmPassStatus(1)
        }

    }

    function unActiveInput(type) {

        if (type === 'repeatPass' && repeatPass === '') {
            setRepeatPassStatus(0)
        }

        if (type === 'password' && password === '') {
            setPasswordStatus(0)
        }

        if (type === 'confirmPass' && confirmPass === '') {
            setConfirmPassStatus(0)
        }

    }


    return (
        <Container>
            <Content contentContainerStyle={[styles.bgFullWidth ]}>

                <View style={[styles.position_R , styles.bgFullWidth, styles.marginTop_55, styles.Width_100]}>

                        <View style={[styles.Width_100 , styles.paddingHorizontal_20 , styles.marginBottom_35]}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.marginBottom_25, styles.transform , styles.alignStart]}>
                                <Image source={require('../../assets/images/back.png')} style={[styles.smImage]} resizeMode={'contain'} />
                            </TouchableOpacity>

                            <Text style={[styles.textBold , styles.text_black , styles.textSize_18 , styles.marginBottom_5, styles.alignStart]}>{ i18n.t('changePass') }</Text>
                        </View>

                        <KeyboardAvoidingView behavior={'padding'} style={[styles.keyboardAvoid]}>
                            <Form style={[styles.Width_90 , styles.flexCenter]}>

                                <View style={[styles.position_R,  styles.height_70, styles.flexCenter, styles.marginBottom_5]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, { right: 5 }]}>
                                        <Label style={[styles.label ,{ color:passwordStatus === 1 ?  COLORS.blue :  COLORS.gray}]}>{ i18n.t('oldPassword') }</Label>
                                        <Input
                                            style={[styles.input, styles.height_50, (passwordStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(password) => setPassword(password)}
                                            onBlur={() => unActiveInput('password')}
                                            onFocus={() => activeInput('password')}
                                            secureTextEntry
                                        />
                                    </Item>
                                </View>

                                <View style={[styles.position_R, styles.height_70, styles.flexCenter, styles.marginBottom_5 ]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, { right: 5 }]}>
                                        <Label style={[styles.label, styles.textRegular ,{ color:repeatPassStatus === 1 ?  COLORS.blue :  COLORS.gray}]}>{ i18n.t('password') }</Label>
                                        <Input style={[styles.input, styles.height_50, (repeatPassStatus === 1 ? styles.Active : styles.noActive)]}
                                               onChangeText={(repeatPass) => setRepeatPass(repeatPass)}
                                               onBlur={() => unActiveInput('repeatPass')}
                                               onFocus={() => activeInput('repeatPass')}
                                               secureTextEntry
                                        />
                                    </Item>
                                </View>

                                <View style={[styles.position_R,  styles.height_70, styles.flexCenter, styles.marginBottom_5]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, { right: 5 }]}>
                                        <Label style={[styles.label ,{ color:confirmPassStatus === 1 ?  COLORS.blue :  COLORS.gray}]}>{ i18n.t('confirmPass') }</Label>
                                        <Input
                                            style={[styles.input, styles.height_50, (confirmPassStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(confirmPass) => setConfirmPass(confirmPass)}
                                            onBlur={() => unActiveInput('confirmPass')}
                                            onFocus={() => activeInput('confirmPass')}
                                            secureTextEntry
                                        />
                                    </Item>
                                </View>

                                {renderConfirm()}

                            </Form>
                        </KeyboardAvoidingView>
                    </View>
                </Content>
        </Container>
    );
}

export default ChangePass;


