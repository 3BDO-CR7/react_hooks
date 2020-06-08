import React, { useState , useEffect } from "react";
import {View, Text, Image, TouchableOpacity, FlatList, I18nManager, ActivityIndicator} from "react-native";
import {Container, Content,Item, Card, Icon, } from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import  Modal  from "react-native-modal";
import {useDispatch, useSelector} from "react-redux";
import {getNotifications, deleteNoti} from "../actions";

function NotificationsItems({navigation}) {

    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user.data.token);

    const notifications = useSelector(state => state.notifications.notifications);
    const notificationsLoader = useSelector(state => state.notifications.loader);

    const [showModal, setShowModal] = useState(false);
    const [notiId, setNotiId] = useState(null);

    const dispatch = useDispatch();


    function fetchData(){
        dispatch(getNotifications(lang, token))
    }

    useEffect(() => {
        fetchData();
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData();
        });

        return unsubscribe;
    }, [navigation , notificationsLoader]);


    function renderLoader(){
        if (notificationsLoader === false){
            return(
                <View style={[styles.loading, styles.flexCenter , {height:'100%'}]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }

    function renderNoData() {
        if (notifications && (notifications).length <= 0) {
            return (
                <View style={[styles.directionColumnCenter , styles.Width_100, styles.marginTop_25]}>
                    <Image source={require('../../assets/images/no_data.png')} resizeMode={'contain'}
                           style={{alignSelf: 'center', width: 200, height: 200}}/>
                </View>
            );
        }

        return null
    }

    function toggleModal (id) {
        setShowModal(!showModal);
        setNotiId(id)
    };

    function deleteNotif () {
        setShowModal(!showModal);
        dispatch(deleteNoti(lang , notiId , token))
    };


    function Item({ title , date , body , year , type , id , service_id , booking_id }) {
        let color = '';
        let route = 'orderDetails';
        let icon = require('../../assets/images/rating_active.png')

        if(type === '0'){
            color = COLORS.blue;
            route = 'rate';
            icon = require('../../assets/images/rating_active.png')
        } else if(type === '1'){
            color = COLORS.orange;
            route = 'orderDetails';
            icon = require('../../assets/images/offer_color.png')
        } else if(type === '3'){
            color = '#FF5757';
            icon = require('../../assets/images/cancel_not.png')
        } else if(type === '2'){
            color = '#44B28D';
            icon = require('../../assets/images/tick_not.png')
        }

        return (
            <Card style={[styles.notiCard]} >
                <TouchableOpacity
                    onPress={() => toggleModal(id)}
                    style           = {[{width:20 , height:20 ,
                        position:'absolute' , right:10 , top:10 , zIndex:1,backgroundColor:color}
                        , styles.flexCenter, styles.Radius_10]}
                >
                    <Icon style     = {[styles.text_White, styles.textSize_12]} type="AntDesign" name='close' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.push(route , {booking_id})} style={[styles.cardView , { borderLeftColor: color,}]}>
                    <View style={[styles.cardDate ,styles.paddingHorizontal_15]}>
                        <Text style={[styles.textRegular , styles.text_gray , styles.textSize_14 , styles.textCenter , styles.marginBottom_5]}>{ date }</Text>
                        <Text style={[styles.textRegular , styles.text_gray , styles.textSize_14 , styles.textCenter , styles.marginBottom_5]}>{ year }</Text>
                    </View>
                    <View style={[styles.paddingHorizontal_15 , styles.directionColumnC, {flex:1}]}>
                        <View style={[styles.directionRow , styles.marginBottom_10]}>
                            <Image source={icon} style={[styles.iconBank , {marginRight:5}]} resizeMode={'contain'} />
                            <Text style={[styles.textBold , styles.text_black , styles.textSize_14]}>{ title }</Text>
                        </View>
                        <Text style={[styles.textRegular , styles.text_gray , styles.textSize_14, styles.alignStart ,
                            {flexWrap:'wrap', writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'}]}>{body}</Text>
                    </View>
                </TouchableOpacity>
            </Card>
        );
    }


    return (
        <Container>
            {renderLoader()}
            <Content contentContainerStyle={[styles.bgFullWidth ]}>

                <View style={[styles.position_R , styles.bgFullWidth,
                    styles.marginVertical_25 , styles.marginTop_55, styles.Width_100]}>

                    <View style={[styles.Width_100 , styles.paddingHorizontal_30 , styles.marginBottom_50]}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.marginBottom_25, styles.transform , styles.alignStart]}>
                            <Image source={require('../../assets/images/back.png')} style={[styles.smImage]} resizeMode={'contain'} />
                        </TouchableOpacity>

                        <Text style={[styles.textBold , styles.text_black , styles.textSize_18 , styles.marginBottom_5, styles.alignStart]}>{ i18n.t('notifications') }</Text>
                        {renderNoData()}
                        <FlatList
                            data={notifications}
                            renderItem={({ item , index}) => <Item
                                title={item.title}
                                date={item.date}
                                year={item.year}
                                body={item.body}
                                type={item.type}
                                id={item.id}
                                service_id={item.service_id}
                                booking_id={item.booking_id}
                                // extraData={showModal}
                            />}
                            keyExtractor={item => item.id}
                        />

                    </View>

                    <Modal
                        onBackdropPress                 ={() =>  toggleModal(null)}
                        onBackButtonPress               = {() =>  toggleModal(null)}
                        isVisible                       = {showModal}
                        style                           = {styles.bgModel}
                        avoidKeyboard                    = {true}
                    >

                        <View style={[{borderTopLeftRadius:30,
                            borderTopRightRadius:30},styles.bg_White, styles.overHidden, styles.Width_100, styles.paddingVertical_10 , styles.paddingHorizontal_10]}>
                            <View style={[styles.overHidden , styles.flexCenter , styles.Width_100]}>

                                <View style={[styles.modalBorder]}/>

                                <Text style={[styles.textRegular , styles.text_gray , styles.textSize_16
                                    , styles.textCenter , styles.marginBottom_5]}>{ i18n.t('deleteNoti') }</Text>

                                <TouchableOpacity onPress={() => deleteNotif()} style={[styles.blueBtn , styles.Width_80]}>
                                    <Text style={[styles.textRegular , styles.text_White , styles.textSize_16]}>{ i18n.t('confirm') }</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() =>  toggleModal(null)} style={[styles.grayBtn , styles.Width_80 , styles.marginBottom_35]}>
                                    <Text style={[styles.textRegular , styles.text_White , styles.textSize_16]}>{ i18n.t('cancel') }</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </Modal>


                </View>
            </Content>
        </Container>
    );
}
export default NotificationsItems;


