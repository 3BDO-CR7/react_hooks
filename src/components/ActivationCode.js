import React, { useState , useEffect, useRef } from "react";
import {View, Text, Image, TouchableOpacity, ImageBackground, KeyboardAvoidingView, I18nManager } from "react-native";
import {Container, Content, Form, Input, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import { useDispatch, useSelector } from 'react-redux'
import {activeAccount} from "../actions";

function ActivationCode({navigation, route}) {

	const { code, userId } = route.params;
	const lang = useSelector(state => state.lang.lang);
	const dispatch = useDispatch();

    const [num1, setNum1] = useState('');
    const [num2, setNum2] = useState('');
    const [num3, setNum3] = useState('');
    const [num4, setNum4] = useState('');

    const [num1Status, setNum1Status] = useState(0);
    const [num2Status, setNum2Status] = useState(0);
    const [num3Status, setNum3Status] = useState(0);
    const [num4Status, setNum4Status] = useState(0);

	const input1 = useRef(null);
	const input2 = useRef(null);
	const input3 = useRef(null);
	const input4 = useRef(null);

    const [spinner, setSpinner] = useState(false);


    useEffect(() => {
        alert('activation code : ' + code)
    }, []);

    function activeInput(type) {
        if (type === 'num1' || num1 !== '') setNum1Status(1);
        if (type === 'num2' || num2 !== '') setNum2Status(1);
        if (type === 'num3' || num3 !== '') setNum3Status(1);
        if (type === 'num4' || num4 !== '') setNum4Status(1);
    }

    function unActiveInput(type) {
        if (type === 'num1' && num1 === '') setNum1Status(0);
        if (type === 'num2' && num2 === '') setNum2Status(0);
        if (type === 'num3' && num3 === '') setNum3Status(0);
        if (type === 'num4' && num4 === '') setNum4Status(0);
    }

    function setActiveCode(ref, value){
        if (ref === 'input1'){
            setNum1(value);
			value !== '' ? input2.current._root.focus() : false;
        } else if (ref === 'input2'){
			setNum2(value);
			value !== '' ? input3.current._root.focus() : false;
		} else if (ref === 'input3'){
			setNum3(value);
			value !== '' ? input4.current._root.focus() : false;
		} else setNum4(value);
    }

    function onActiveAccount() {
        const activeCode = num1 + num2 + num3 + num4;

        if (activeCode == code) dispatch(activeAccount(userId, lang));
        else {
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

                            <Text style={[styles.textBold , styles.text_black , styles.textSize_18 , styles.marginBottom_5, styles.alignStart]}>{ i18n.t('activationCode') }</Text>
                            {/*<Text style={[styles.textRegular , styles.text_gray , styles.textSize_13]}>{ i18n.t('loginText') }</Text>*/}
                        </View>

                        <KeyboardAvoidingView behavior={'padding'} style={[styles.keyboardAvoid]}>
                            <Form style={[styles.Width_100 , styles.flexCenter, styles.marginVertical_10, styles.Width_90]}>

                                <View style={[styles.directionRowSpace , styles.directionRowReverse , styles.Width_95]}>
                                    <View style={[styles.position_R, styles.height_50, styles.flexCenter, styles.marginBottom_5 ]}>
                                        <Input style={[styles.input , styles.width_50, (num1Status === 1 ? styles.Active : styles.noActive)
                                        , {color: COLORS.black}]}
                                               onChangeText={(num1) => setActiveCode('input1', num1) }
                                               onBlur={() => unActiveInput('num1')}
                                               onFocus={() => activeInput('num1')}
                                               keyboardType={'number-pad'}
											   ref={input1}
                                        />
                                    </View>
                                    <View style={[styles.position_R, styles.height_50, styles.flexCenter, styles.marginBottom_5 ]}>
                                        <Input style={[styles.input , styles.width_50, (num2Status === 1 ? styles.Active : styles.noActive)
                                        , {color: COLORS.black}]}
                                               onChangeText={(num2) => setActiveCode('input2', num2) }
                                               onBlur={() => unActiveInput('num2')}
                                               onFocus={() => activeInput('num2')}
                                               keyboardType={'number-pad'}
                                               ref={input2}
                                        />
                                    </View>
                                    <View style={[styles.position_R, styles.height_50, styles.flexCenter, styles.marginBottom_5 ]}>
                                        <Input style={[styles.input , styles.width_50, (num3Status === 1 ? styles.Active : styles.noActive)
                                        , {color: COLORS.black}]}
                                               onChangeText={(num3) => setActiveCode('input3', num3) }
                                               onBlur={() => unActiveInput('num3')}
                                               onFocus={() => activeInput('num3')}
                                               keyboardType={'number-pad'}
											   ref={input3}
                                        />
                                    </View>
                                    <View style={[styles.position_R, styles.height_50, styles.flexCenter, styles.marginBottom_5 ]}>
                                        <Input style={[styles.input , styles.width_50, (num4Status === 1 ? styles.Active : styles.noActive)
                                        , {color: COLORS.black}]}
                                               onChangeText={(num4) => setActiveCode('input4', num4) }
                                               onBlur={() => unActiveInput('num4')}
                                               onFocus={() => activeInput('num4')}
                                               keyboardType={'number-pad'}
											   ref={input4}
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity onPress={() => onActiveAccount()} style={[styles.blueBtn , styles.Width_95]}>
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

export default ActivationCode;


