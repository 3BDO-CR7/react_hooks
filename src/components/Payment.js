import React, { useState , useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView, ActivityIndicator
} from "react-native";
import {Container, Content, Form, Input, Item, Label} from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {useDispatch, useSelector} from "react-redux";
import {newBooking} from "../actions";

function Payment({navigation , route}) {

    const service_id = route.params.service_id;
    const totalPrice = route.params.totalPrice;
    const date = route.params.date;

    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user.data.token);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [type, setType] = useState(0);
    const [switchValue, setSwitchValue] = useState(false);

    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [validUntill, setValidUntill] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardNumberStatus, setCardNumberStatus] = useState(0);
    const [cardHolderStatus, setCardHolderStatus] = useState(0);
    const [validUntillStatus, setValidUntillStatus] = useState(0);
    const [cvvStatus, setCvvStatus] = useState(0);

    const [isDatePickerVisible , setIsDatePickerVisible ] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        setIsSubmitted(false)
    }, []);

    function renderConfirm(){
        if (isSubmitted  && date){
            return(
                <View style={[{ justifyContent: 'center', alignItems: 'center' } , styles.marginTop_35]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        return (
            <TouchableOpacity onPress={() => onConfirm()}
                              style={[styles.blueBtn , styles.Width_100 , styles.marginTop_35]}>
                <Text style={[styles.textRegular , styles.text_White , styles.textSize_16]}>{ i18n.t('addCard') }</Text>
            </TouchableOpacity>

        );
    }
    function onConfirm(){
        setIsSubmitted(true);
        dispatch(newBooking(lang , service_id , date , 0 , token , navigation));
    }

    const showDatePicker = () => {
        setIsDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setIsDatePickerVisible(false);
    };

    const handleConfirm = myDate => {
        // console.warn("A date has been picked: ", myDate);
        let formatted_date = myDate.getFullYear() + "-" + ("0"+(myDate.getMonth() + 1)).slice(-2) + "-" + ("0" +myDate.getDate()).slice(-2);
        hideDatePicker();
        setValidUntill(formatted_date);
    };

    function toggleSwitch(value) {
        setSwitchValue(value);
    }

    function activeInput(type) {

        if (type === 'cardNumber' || cardNumber !== '') {
            setCardNumberStatus(1)
        }

        if (type === 'cardHolder' || cardHolder !== '') {
            setCardHolderStatus(1)
        }

        if (type === 'validUntill' || validUntill !== '') {
            setValidUntillStatus(1)
        }

        if (type === 'cvv' || cvv !== '') {
            setCvvStatus(1)
        }

    }

    function unActiveInput(type) {

        if (type === 'cardNumber' && cardNumber === '') {
            setCardNumberStatus(0)
        }

        if (type === 'cardHolder' && cardHolder === '') {
            setCardHolderStatus(0)
        }

        if (type === 'validUntill' && validUntill === '') {
            setValidUntillStatus(0)
        }

        if (type === 'cvv' && cvv === '') {
            setCvvStatus(0)
        }

    }

    function payType(type) {
        setType(type)
    }

    return (
        <Container>
            <Content contentContainerStyle={[styles.bgFullWidth ]}>

                <View style={[styles.position_R , styles.bgFullWidth,
                    styles.marginVertical_25 , styles.marginTop_55, styles.Width_100]}>

                    <View style={[styles.Width_100 , styles.paddingHorizontal_30 , styles.marginBottom_35]}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.marginBottom_25 , styles.transform , styles.alignStart]}>
                            <Image source={require('../../assets/images/back.png')} style={[styles.smImage]} resizeMode={'contain'} />
                        </TouchableOpacity>

                        <Text style={[styles.textBold , styles.text_black , styles.textSize_18 , styles.marginBottom_5, styles.alignStart]}>{ i18n.t('totalPrice') }</Text>
                        <Text style={[styles.textRegular , styles.text_gray , styles.textSize_16 , styles.alignStart]}>{totalPrice}</Text>
                    </View>

                    <View style={[styles.Width_100 , styles.paddingHorizontal_30]}>
                        <Text style={[styles.textBold , styles.text_black , styles.textSize_18 , styles.marginBottom_10, styles.alignStart]}>{ i18n.t('payMethod') }</Text>

                        <View>
                            <ScrollView style={[styles.scrollView ]} horizontal={true} showsHorizontalScrollIndicator={false}>

                                <TouchableOpacity onPress={() => payType(0)}
                                                  style={[styles.payMethod , {marginRight:10, backgroundColor:type === 0 ? COLORS.blue : '#F1F1F1'} ]}>
                                    <Text style={[styles.textRegular , type === 0 ? styles.text_White : styles.text_gray , styles.textSize_16]}>{ i18n.t('payPal') }</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => payType(1)}
                                                  style={[styles.payMethod , {marginRight:10, backgroundColor:type === 1 ? COLORS.blue : '#F1F1F1'} ]}>
                                    <Text style={[styles.textRegular , type === 1 ? styles.text_White : styles.text_gray , styles.textSize_16]}>{ i18n.t('credit') }</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => payType(2)}
                                                  style={[styles.payMethod , {marginRight:10, backgroundColor:type === 2 ? COLORS.blue : '#F1F1F1'} ]}>
                                    <Text style={[styles.textRegular , type === 2 ? styles.text_White : styles.text_gray , styles.textSize_16]}>{ i18n.t('sadad') }</Text>
                                </TouchableOpacity>

                            </ScrollView>
                        </View>

                        <KeyboardAvoidingView behavior={'absolute'}>
                            <Form style={[styles.flexCenter, styles.marginVertical_10, styles.Width_95 ]}>
                                <View style={[styles.position_R, styles.height_70, styles.flexCenter, styles.marginBottom_5 , styles.marginTop_25 ]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R , { right: 7 ,paddingHorizontal:0}]}>
                                        <Label style={[styles.label,{ color:cardNumberStatus === 1 ?  COLORS.blue :  COLORS.gray, left: 75}]}>{ i18n.t('cardNumber') }</Label>
                                        <Input style={[styles.input, styles.height_50, (cardNumberStatus === 1 ? styles.Active : styles.noActive), {paddingLeft:75}]}
                                               onChangeText={(cardNumber) => setCardNumber(cardNumber)}
                                               onBlur={() => unActiveInput('cardNumber')}
                                               onFocus={() => activeInput('cardNumber')}
                                               keyboardType={'number-pad'}
                                        />
                                    </Item>
                                    <Image source={require('../../assets/images/master_card.png')}
                                           style={[{width:50 , height:50 , position:'absolute' , left:25 , top:0}]}
                                           resizeMode={'contain'} />
                                </View>

                                <View style={[styles.directionRowSpace , styles.Width_100]}>
                                    {/*<View style={[styles.position_R,  styles.height_70, styles.flexCenter, styles.marginBottom_5, {flex:2}]}>*/}
                                        {/*<Item floatingLabel style={[styles.item, styles.position_R, { right: 7 ,paddingHorizontal:0}]}>*/}
                                            {/*<Label style={[styles.label ,{ color:validUntillStatus === 1 ?  COLORS.blue :  COLORS.gray }]}>{ i18n.t('validUntill') }</Label>*/}
                                            {/*<Input*/}
                                                {/*style={[styles.input, styles.height_50, (validUntillStatus === 1 ? styles.Active : styles.noActive)]}*/}
                                                {/*onChangeText={(validUntill) => setValidUntill(validUntill)}*/}
                                                {/*onBlur={() => unActiveInput('validUntill')}*/}
                                                {/*onFocus={() => activeInput('validUntill')}*/}
                                                {/*keyboardType={'number-pad'}*/}
                                            {/*/>*/}
                                        {/*</Item>*/}
                                    {/*</View>*/}

                                    <TouchableOpacity onPress={showDatePicker} style={[styles.Width_100,styles.marginBottom_25, {flex:2}]}>
                                        <Text style={[styles.labelText, styles.textRegular
                                            ,{ color:validUntill !== '' ?  COLORS.blue :  COLORS.gray , top : validUntill !== '' ? -10 : 15}]}>{ i18n.t('validUntill') }</Text>
                                        <View style={[styles.directionColumnC,styles.input, styles.height_50, styles.Width_100 , (validUntill !== '' ? styles.Active : styles.noActive)]}>
                                            <Text style={[styles.textRegular , styles.text_black , styles.alignStart]}>
                                                {validUntill}
                                            </Text>
                                        </View>
                                        <DateTimePickerModal
                                        isVisible={isDatePickerVisible}
                                        mode="date"
                                        onConfirm={handleConfirm}
                                        onCancel={hideDatePicker}
                                        />
                                    </TouchableOpacity>


                                    {/*<TouchableOpacity onPress={showDatePicker} style={[styles.flexCenter]}>*/}
                                        {/*<Text style={[styles.textRegular , styles.text_gray , styles.textSize_16]}>{ i18n.t('validUntill') }</Text>*/}
                                        {/*<Image source={require('../../assets/images/calender_active.png')} style={[styles.iconImg , styles.marginVertical_10]} resizeMode={'contain'} />*/}
                                        {/*<View style={[styles.marginBottom_15 , styles.paddingHorizontal_10 , styles.paddingVertical_5 , styles.Radius_5 , {backgroundColor:validUntill !== ''?'#EBEDF0':'transparent'}]}>*/}
                                            {/*<Text style={[styles.textRegular , styles.text_gray , styles.textSize_16]}>{validUntill}</Text>*/}
                                        {/*</View>*/}
                                        {/*<DateTimePickerModal*/}
                                            {/*isVisible={isDatePickerVisible}*/}
                                            {/*mode="date"*/}
                                            {/*onConfirm={handleConfirm}*/}
                                            {/*onCancel={hideDatePicker}*/}
                                        {/*/>*/}
                                    {/*</TouchableOpacity>*/}

                                    <View style={[styles.position_R,  styles.height_70, styles.flexCenter, styles.marginBottom_5, {flex:1 , marginLeft:12}]}>
                                        <Item floatingLabel style={[styles.item, styles.position_R, { right: 7 ,paddingHorizontal:0}]}>
                                            <Label style={[styles.label ,{ color:cvvStatus === 1 ?  COLORS.blue :  COLORS.gray }]}>{ i18n.t('cvv') }</Label>
                                            <Input
                                                style={[styles.input, styles.height_50, (cvvStatus === 1 ? styles.Active : styles.noActive)]}
                                                onChangeText={(cvv) => setCvv(cvv)}
                                                onBlur={() => unActiveInput('cvv')}
                                                onFocus={() => activeInput('cvv')}
                                                keyboardType={'number-pad'}
                                            />
                                        </Item>
                                    </View>
                                </View>

                                <View style={[styles.position_R,  styles.height_70, styles.flexCenter, styles.marginBottom_5]}>
                                    <Item floatingLabel style={[styles.item, styles.position_R, { right: 7 ,paddingHorizontal:0}]}>
                                        <Label style={[styles.label ,{ color:cardHolderStatus === 1 ?  COLORS.blue :  COLORS.gray }]}>{ i18n.t('cardHolder') }</Label>
                                        <Input
                                            style={[styles.input, styles.height_50, (cardHolderStatus === 1 ? styles.Active : styles.noActive)]}
                                            onChangeText={(cardHolder) => setCardHolder(cardHolder)}
                                            onBlur={() => unActiveInput('cardHolder')}
                                            onFocus={() => activeInput('cardHolder')}
                                        />
                                    </Item>
                                </View>

                                {/*<View style={[styles.Width_100 , styles.directionRowSpace]}>*/}
                                    {/*<Text style={[styles.textRegular , styles.text_black , styles.textSize_13]}>*/}
                                        {/*{i18n.t('saveCard')}*/}
                                    {/*</Text>*/}
                                    {/*<Switch*/}
                                        {/*style={{}}*/}
                                        {/*onValueChange={() => toggleSwitch(!switchValue)}*/}
                                        {/*value={switchValue}*/}
                                        {/*trackColor={COLORS.blue}*/}
                                        {/*thumbColor={COLORS.blue}*/}
                                    {/*/>*/}
                                {/*</View>*/}

                                {renderConfirm()}

                            </Form>
                        </KeyboardAvoidingView>
                    </View>


                </View>
            </Content>
        </Container>
    );
}

export default Payment;


