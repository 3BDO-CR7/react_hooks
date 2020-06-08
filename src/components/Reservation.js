import React, {useEffect, useState} from "react";
import {View, Text, Image, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator} from "react-native";
import {Container, Content, Form, Input, Item, Label} from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import {newBooking} from "../actions";
import {useDispatch, useSelector} from "react-redux";

function Reservation({navigation , route}) {

    const service_id = route.params.service_id;
    const totalPrice = route.params.totalPrice;
    const date = route.params.date;
    const [type, setType] = useState(0);
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user.data.token);
    const [isSubmitted, setIsSubmitted] = useState(false);


    function payType(type) {
        setType(type)
    }

    const dispatch = useDispatch();

    useEffect(() => {
        setIsSubmitted(false)
    }, []);

    function checkPayment() {
        if (type === 0)
            navigation.push('payment' , {service_id , totalPrice , date})
        else {
            setIsSubmitted(true);
            dispatch(newBooking(lang , service_id , date , 1 , token , navigation));
        }

    }

    return (
        <Container>
            <Content contentContainerStyle={[styles.bgFullWidth ]}>

                <View style={[styles.position_R , styles.bgFullWidth,
                    styles.marginVertical_25 , styles.marginTop_55, styles.Width_100]}>

                    <View style={[styles.Width_100 , styles.paddingHorizontal_30 , styles.marginBottom_35]}>
                       <View style={[styles.directionRowSpace , styles.Width_100]}>
                           <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.marginBottom_25 , styles.transform]}>
                               <Image source={require('../../assets/images/back.png')} style={[styles.smImage]} resizeMode={'contain'} />
                           </TouchableOpacity>
                           <TouchableOpacity onPress={() => navigation.push('payment' , {service_id, totalPrice})} style={[styles.marginBottom_25]}>
                               <Image source={require('../../assets/images/union.png')} style={[styles.smImage]} resizeMode={'contain'} />
                           </TouchableOpacity>
                       </View>

                        <Text style={[styles.textBold , styles.text_black , styles.textSize_18 , styles.marginBottom_5, styles.alignStart]}>{ i18n.t('payment') }</Text>
                        <Text style={[styles.textRegular , styles.text_gray , styles.textSize_13, styles.alignStart]}>{ i18n.t('payFor') }</Text>
                    </View>

                    <View style={[styles.Width_100 , styles.paddingHorizontal_30]}>
                        <Image source={require('../../assets/images/credit.png')} style={[styles.Width_100 , {height:200}]} resizeMode={'contain'} />
                        <Text style={[styles.textBold , styles.text_black , styles.textSize_18 , styles.marginBottom_5 , styles.marginTop_15, styles.alignStart]}>{ i18n.t('totalPrice') }</Text>
                        <Text style={[styles.textRegular , styles.text_gray , styles.textSize_16 , styles.alignStart]}>{totalPrice}</Text>

                        <KeyboardAvoidingView behavior={'absolute'}>
                            <Form style={[styles.flexCenter, styles.marginVertical_10, styles.Width_95 ]}>
                                <Text style={[styles.textBold , styles.text_black , styles.textSize_16 ,
                                    styles.marginBottom_20 , styles.alignStart , styles.marginTop_15]}>{ i18n.t('payInfo') }</Text>

                                <TouchableOpacity onPress={() => payType(0)} style={[styles.Width_100 , styles.directionRow , styles.input , styles.height_50, styles.marginBottom_25 , {borderColor:type === 0 ? COLORS.blue : COLORS.gray}]}>
                                    <Image source={require('../../assets/images/master_card.png')}
                                           style={[{width:50 , height:50 , marginRight:15}]}
                                           resizeMode={'contain'} />
                                    <Text style={[styles.textRegular ,{ color: type === 0 ?  COLORS.blue :  COLORS.gray }]}>{ i18n.t('onlinePay') }</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => payType(1)} style={[styles.Width_100 , styles.directionRow , styles.input , styles.height_50, styles.marginBottom_5 , {borderColor:type === 1 ? COLORS.blue : COLORS.gray}]}>
                                    <Image source={require('../../assets/images/cash.png')}
                                           style={[{width:50 , height:50 , marginRight:15}]}
                                           resizeMode={'contain'} />
                                    <Text style={[styles.textRegular ,{ color:type === 1 ?  COLORS.blue :  COLORS.gray }]}>{ i18n.t('cash') }</Text>
                                </TouchableOpacity>

                                {
                                    isSubmitted && date?
                                        <View style={[{ justifyContent: 'center', alignItems: 'center' ,marginTop:20 } , styles.marginBottom_25]}>
                                            <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                                        </View>
                                        :
                                        <TouchableOpacity onPress={() => checkPayment()}
                                                          style={[styles.blueBtn , styles.Width_100 , styles.marginBottom_25]}>
                                            <Text style={[styles.textRegular , styles.text_White , styles.textSize_16]}>{ i18n.t('payNow') }</Text>
                                        </TouchableOpacity>
                                }


                                <TouchableOpacity onPress={() =>
                                    navigation.navigate('home', {
                                        screen: 'home',
                                    })
                                }>
                                    <Text style={[styles.textRegular , styles.text_black , styles.textDecoration , styles.textSize_16]}>{ i18n.t('goToHome') }</Text>
                                </TouchableOpacity>
                            </Form>
                        </KeyboardAvoidingView>
                    </View>


                </View>
            </Content>
        </Container>
    );
}

export default Reservation;


