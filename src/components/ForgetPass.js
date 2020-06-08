import React, { useState , useEffect } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground, KeyboardAvoidingView, I18nManager} from "react-native";
import {Container, Content, Form, Input, Item, Label } from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import { useDispatch, useSelector } from 'react-redux'
import {checkPhone} from "../actions";

function ForgetPass({navigation}) {

	const lang = useSelector(state => state.lang.lang);
	const dispatch = useDispatch();

    const [phone, setPhone] = useState('');
    const [phoneStatus, setPhoneStatus] = useState(0);

    function activeInput(type) {
        if (type === 'phone' || phone !== '') setPhoneStatus(1);
    }

    function unActiveInput(type) {
        if (type === 'phone' && phone === '') setPhoneStatus(0);
    }

    function onForgetPassword() {
		dispatch(checkPhone(phone, lang, navigation));
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

                            <Text style={[styles.textBold , styles.text_black , styles.textSize_18 , styles.marginBottom_5, styles.alignStart]}>{ i18n.t('PassReco') }</Text>
                            {/*<Text style={[styles.textRegular , styles.text_gray , styles.textSize_13]}>{ i18n.t('loginText') }</Text>*/}
                        </View>

                        <KeyboardAvoidingView behavior={'padding'} style={[styles.keyboardAvoid]}>
                            <Form style={[styles.Width_100 , styles.flexCenter, styles.marginVertical_10, styles.Width_90]}>
                                <View style={[styles.position_R, styles.height_70, styles.flexCenter, styles.marginBottom_5 ]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, { right: 5 }]}>
                                        <Label style={[styles.label, styles.textRegular ,{ color:phoneStatus === 1 ?  COLORS.blue :  COLORS.gray}]}>{ i18n.t('phone') }</Label>
                                        <Input style={[styles.input, styles.height_50, (phoneStatus === 1 ? styles.Active : styles.noActive)]}
                                               onChangeText={(phone) => setPhone(phone)}
                                               onBlur={()  => unActiveInput('phone')}
                                               onFocus={() => activeInput('phone')}
                                               keyboardType={'number-pad'}
                                        />
                                    </Item>
                                </View>

                                <TouchableOpacity onPress={() => onForgetPassword()} style={[styles.blueBtn , styles.Width_95]}>
                                    <Text style={[styles.textRegular , styles.text_White , styles.textSize_16]}>{ i18n.t('send') }</Text>
                                </TouchableOpacity>

                            </Form>
                        </KeyboardAvoidingView>
                    </View>
                </Content>
            </ImageBackground>
        </Container>
    );
}

export default ForgetPass;


