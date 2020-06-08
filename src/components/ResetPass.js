import React, { useState , useEffect } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground, KeyboardAvoidingView, I18nManager } from "react-native";
import {Container, Content, Form, Input, Item, Label, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import {useDispatch, useSelector} from "react-redux";
import {resetPassword} from "../actions";

function ResetPass({navigation, route}) {

	const { activeCode, id } = route.params;
	const lang      = useSelector(state => state.lang.lang);
	const dispatch  = useDispatch();

    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [codeStatus, setCodeStatus] = useState(0);
    const [passwordStatus, setPasswordStatus] = useState(0);
    const [confirmPassStatus, setConfirmPassStatus] = useState(0);

    useEffect(() => {
		alert('activation code : ' + activeCode)
    }, [])

    function activeInput(type) {
        if (type === 'code' || code !== '') setCodeStatus(1);
        if (type === 'password' || password !== '') setPasswordStatus(1);
        if (type === 'confirmPass' || confirmPass !== '') setConfirmPassStatus(1);
    }

    function unActiveInput(type) {
        if (type === 'code' && code === '') setCodeStatus(0);
        if (type === 'password' && password === '') setPasswordStatus(0);
        if (type === 'confirmPass' && confirmPass === '') setConfirmPassStatus(0);
    }

    function onChangePassword() {

        if (code == activeCode){
            if (password === confirmPass)
                dispatch(resetPassword(id, password, lang, navigation));
            else
				Toast.show({
					text        	: i18n.t('notmatch'),
					type			: "danger",
					duration    	: 3000,
					textStyle   	: {
						color       	: "white",
						fontFamily  	: 'sukar',
						textAlign   	: 'center'
					}
				});
        } else {
			Toast.show({
				text        	: i18n.t('codeNotMatch'),
				type			: "danger",
				duration    	: 3000,
				textStyle   	: {
					color       	: "white",
					fontFamily  	: 'sukar',
					textAlign   	: 'center'
				}
			});
        }
	}


    return (
        <Container>
            <ImageBackground source={  I18nManager.isRTL ? require('../../assets/images/bg_languge.png') :  require('../../assets/images/bg_inverse.png')} style={[styles.bgFullWidth]}>
                <Content contentContainerStyle={[styles.bgFullWidth , styles.paddingTop_50]}>

                    <View style={[styles.position_R , styles.bgFullWidth, styles.marginVertical_15,
                        styles.marginVertical_25, styles.Width_100, styles.flexCenter]}>

                        <View style={[styles.Width_100 , styles.paddingHorizontal_30 , styles.marginBottom_50]}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.marginBottom_25 , styles.transform , styles.alignStart]}>
                                <Image source={require('../../assets/images/back.png')} style={[styles.smImage]} resizeMode={'contain'} />
                            </TouchableOpacity>

                            <Text style={[styles.textBold , styles.text_black , styles.textSize_18 , styles.marginBottom_5, styles.alignStart]}>{ i18n.t('newpass') }</Text>
                            {/*<Text style={[styles.textRegular , styles.text_gray , styles.textSize_13]}>{ i18n.t('loginText') }</Text>*/}
                        </View>

                        <KeyboardAvoidingView behavior={'padding'} style={[styles.keyboardAvoid]}>
                            <Form style={[styles.Width_100 , styles.flexCenter, styles.marginVertical_10, styles.Width_90]}>
                                <View style={[styles.position_R, styles.height_70, styles.flexCenter, styles.marginBottom_5 ]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, { right: 5 }]}>
                                        <Label style={[styles.label, styles.textRegular ,{ color:codeStatus === 1 ?  COLORS.blue :  COLORS.gray}]}>{ i18n.t('code') }</Label>
                                        <Input style={[styles.input, styles.height_50, (codeStatus === 1 ? styles.Active : styles.noActive)]}
                                               onChangeText={(code) => setCode(code)}
                                               onBlur={() => unActiveInput('code')}
                                               onFocus={() => activeInput('code')}
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


                                <TouchableOpacity onPress={() => onChangePassword()} style={[styles.blueBtn , styles.Width_95]}>
                                    <Text style={[styles.textRegular , styles.text_White , styles.textSize_16]}>{ i18n.t('confirm') }</Text>
                                </TouchableOpacity>

                            </Form>
                        </KeyboardAvoidingView>
                    </View>
                </Content>
            </ImageBackground>
        </Container>
    );
}

export default ResetPass;


