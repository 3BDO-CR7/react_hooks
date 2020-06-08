import React, { useState , useEffect } from "react";
import {View, Text, Image, TouchableOpacity, FlatList, I18nManager, ScrollView, ActivityIndicator} from "react-native";
import {Container, Content,Item, Card } from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import {useDispatch, useSelector} from "react-redux";
import {getBookings} from "../actions";

function Orders({navigation}) {

    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user ? state.auth.user.data.token : null);

    const bookings = useSelector(state => state.bookings.bookings);
    const bookingsLoader = useSelector(state => state.bookings.loader);

    const [orderType, setOrderType] = useState('0');
    const [ordText, setOrdText] = useState(i18n.t('newOrders'));
    const dispatch = useDispatch();

    function fetchData(){
        dispatch(getBookings(lang,orderType,token))
    }

    useEffect(() => {
        fetchData();
        const unsubscribe = navigation.addListener('focus', e => {
            setOrderType('0')
            setOrdText(i18n.t('newOrders'))
            fetchData();
        });

        return unsubscribe;
    }, [navigation , bookingsLoader]);

    function renderLoader(){
        if (bookingsLoader === false){
            return(
                <View style={[styles.loading, styles.flexCenter, {height:'100%'}]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }
    function renderNoData() {
        if (bookings && (bookings).length <= 0) {
            return (
                <View style={[styles.directionColumnCenter , styles.Width_100, styles.marginTop_25]}>
                    <Image source={require('../../assets/images/no_data.png')} resizeMode={'contain'}
                           style={{alignSelf: 'center', width: 200, height: 200}}/>
                </View>
            );
        }

        return null
    }
    function changeOrder(type){
        if(type === '0')
            setOrdText(i18n.t('newOrders'))
        else if(type === '1')
            setOrdText(i18n.t('reservedOrders'))
        else if(type === '2')
            setOrdText(i18n.t('finishedOrders'))
        setOrderType(type);
        dispatch(getBookings(lang,type,token))
    }

    function Item({ service_name , date , payment_type , price  , id }) {

        return (
            <Card style={[styles.notiCard]} >
                <TouchableOpacity onPress={() => navigation.push('orderDetails' , {booking_id:id})} style={[styles.cardView , { borderLeftColor: COLORS.blue,}]}>
                    <View style={[styles.cardDate ,styles.paddingHorizontal_15]}>
                        <Text style={[styles.textRegular , styles.text_gray , styles.textSize_14 , styles.textCenter , styles.marginBottom_5]}>{ date }</Text>
                        {/*<Text style={[styles.textRegular , styles.text_gray , styles.textSize_14 , styles.textCenter , styles.marginBottom_5]}>{ year }</Text>*/}
                    </View>
                    <View style={[styles.paddingHorizontal_15 , styles.directionColumnC , {flex:1} ]}>
                        <Text style={[styles.textBold , styles.text_black , styles.textSize_14 , styles.marginBottom_5 , styles.alignStart,{writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>{service_name}</Text>
                        <Text style={[styles.textRegular , styles.text_gray , styles.textSize_14 , styles.marginBottom_5 , styles.alignStart,{writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>{payment_type}</Text>
                        <Text style={[styles.textRegular , styles.text_blue , styles.textSize_14  , styles.alignStart]}>{price}</Text>
                    </View>
                </TouchableOpacity>
            </Card>
        );
    }


    return (
        <Container>
            {renderLoader()}
            <Content contentContainerStyle={[styles.bgFullWidth]}>
                <View style={[styles.position_R , styles.bgFullWidth, styles.Width_100]}>
                    <View style={[styles.Width_100 , styles.topNav , {borderBottomWidth:2 , borderLeftWidth:2 , borderColor:'#f0f0f0'}]}>
                        <ScrollView style={{}} contentContainerStyle={[styles.directionRowSpace , styles.Width_100 , styles.paddingHorizontal_15
                            , {paddingTop:15 ,justifyContent:'space-around'}]} horizontal={true} showsHorizontalScrollIndicator={false}>

                            <TouchableOpacity onPress={() => changeOrder('0')}>
                                <Image source={orderType === '0'? require('../../assets/images/order_procc_blue.png') : require('../../assets/images/order_procc_gray.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => changeOrder('1')} style={[styles.transformReverse]}>
                                <Image source={orderType === '1'? require('../../assets/images/blue_current_order.png'): require('../../assets/images/gray_current_order.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => changeOrder('2')} style={[styles.transformReverse]}>
                                <Image source={orderType === '2'? require('../../assets/images/order_blue_end.png'): require('../../assets/images/order_gray_end.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </ScrollView>
                    </View>

                    <View style={[styles.Width_100 , styles.paddingHorizontal_20 , styles.marginTop_25, styles.marginBottom_80]}>
                        <Text style={[styles.textBold , styles.text_black , styles.textSize_18 , styles.marginBottom_5, styles.alignStart]}>{ordText}</Text>
                        {renderNoData()}
                        <FlatList
                            data={bookings}
                            renderItem={({ item , index}) => <Item
                                service_name={item.service_name}
                                date={item.date}
                                // year={item.year}
                                payment_type={item.payment_type}
                                price={item.price}
                                id={item.id}
                                // extraData={showModal}
                            />}
                            keyExtractor={item => item.id}
                        />

                    </View>



                </View>
            </Content>
        </Container>
    );
}
export default Orders;


