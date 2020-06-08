import React, { useState , useEffect , useRef } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, I18nManager, Platform, ActivityIndicator, Vibration } from "react-native";
import {Container, Content,Input, Toast} from 'native-base'
import Carousel , { Pagination , getInputRangeFromIndexes  } from 'react-native-snap-carousel';
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import {useSelector, useDispatch} from 'react-redux';
import {getCategories, getOffers, getTopRate, logout, profile, tempAuth} from '../actions';
import Product from "./Product";
import axios from "axios";
import CONST from "../consts";
import { Notifications } from 'expo'

const isIOS  = Platform.OS === 'ios';
const height = Dimensions.get('window').height;
const width  = Dimensions.get('window').width;

function Home({navigation}) {

    const carouselRef   = useRef(null);
    const lang          = useSelector(state => state.lang.lang);
    const token         = useSelector(state => state.auth.user ? state.auth.user.data.token : null);
    const user          = useSelector(state => state.auth.user ? state.auth.user.data :  {name: null});
    const isBaned       = useSelector(state => state.auth.user ? state.auth.user.data.ban : null);
    const categories    = useSelector(state => state.categories.categories);
    const catLoader     = useSelector(state => state.categories.loader);

    const offers        = useSelector(state => state.offers.offers);
    const offersLoader  = useSelector(state => state.offers.loader);

    const topRate       = useSelector(state => state.topRate.topRate);
    const topRateLoader = useSelector(state => state.topRate.loader);

    const [search, setSearch] = useState('');
    const [activeSlide , setActiveSlide ] = useState(0);
    const dispatch = useDispatch();

    function toggleFavorite (id){
        // dispatch(setFavourite(lang , id , token));
        axios({
            url         : CONST.url + 'fav',
            method      : 'POST',
            headers     : { Authorization: token },
            data        : {lang ,service_id :id }
        }).then(response => {

            fetchData();

            Toast.show({
                text        : response.data.message,
                type        : response.data.success ? "success" : "danger",
                duration    : 3000,
                textStyle   : {
                    color       : "white",
                    fontFamily  : 'sukar',
                    textAlign   : 'center'
                }
            });
        });

    }

    function fetchData(){
        // if (token)
        //     dispatch(profile(token));

        dispatch(getCategories(lang , false));
        dispatch(getOffers(lang , false , token));
        dispatch(getTopRate(lang , true , token));
        setSearch('')
    }

    useEffect(() => {
        fetchData();
        const unsubscribe = navigation.addListener('focus', e => {
            fetchData();
        });

        return unsubscribe;
    }, [navigation , catLoader , offersLoader , topRateLoader ]);


    useEffect(() => {
        if(isBaned === 1) {
            dispatch(logout(lang , token));
            dispatch(tempAuth(token));
        }
    },[isBaned]);

    function renderLoader(){
        if (catLoader === false || offersLoader === false || topRateLoader === false){
            return(
                <View style={[styles.loading, styles.flexCenter, {height:'100%'}]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }

    useEffect(() => {
		Notifications.addListener(handleNotification);
    }, []);

    function handleNotification(notification) {
		if (notification && notification.origin !== 'received') {
			this.props.navigation.navigate('Notification');
		}

		if (notification.remote) {
			Vibration.vibrate();
			const notificationId = Notifications.presentLocalNotificationAsync({
				title: notification.data.title  ? notification.data.title : i18n.t('newNotification'),
				body: notification.data.body ? notification.data.body : i18n.t('_newNotification'),
				ios: { _displayInForeground: true }
			});
		}
	}

    function scrollInterpolator (index, carouselProps) {
        const range = [3, 2, 1, 0, -1]; // <- Remember that this has to be declared in a reverse order
        const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
        const outputRange = range;

        return { inputRange, outputRange };
    }

    function _animatedStyles (index, animatedValue, carouselProps) {
        const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth;
        const translateProp = carouselProps.vertical ? 'translateY' : 'translateX';
        return {
            zIndex: carouselProps.data.length - index,
            opacity: animatedValue.interpolate({
                inputRange: [0, 1 , 2],
                outputRange:  I18nManager.isRTL ? [1, 0.7 , 0.6] : [0.6, 0.7 , 1],
            }),
            transform: [{
                // rotate: animatedValue.interpolate({
                //     inputRange: [-1, 0, 1, 2, 3],
                //     outputRange: ['0deg', '0deg', '-1deg', '-1.1deg', '0deg'],
                //     extrapolate: 'clamp'
                // }) ,
                translateY: animatedValue.interpolate({
                    inputRange: [-1, 0, 1, 2, 3],
                    outputRange: I18nManager.isRTL ? ['0deg', '-800deg', '700deg', '2200deg', '0deg']:['0deg', '2200deg', '700deg', '-800deg', '0deg'],
                    extrapolate: 'clamp'
                }) ,
                scale :
                    animatedValue.interpolate({
                        inputRange: [-1, 0, 1, 2, 3],
                        outputRange: I18nManager.isRTL ? [0 , 1 , 0.9, 0.8,0] : [0 , 0.8 , 0.9, 1,0],
                        extrapolate: 'clamp'
                    }) ,
            }, {
                [translateProp]: animatedValue.interpolate({
                    inputRange: [-1, 0, 1, 2, 3],
                    outputRange: I18nManager.isRTL ? [
                        -sizeRef,
                        0,
                        -sizeRef *1.11, // centered
                        -sizeRef * 2.5, // centered
                        -sizeRef * 3 // centered
                    ]:[
                        -sizeRef,
                        0,
                        -sizeRef *1.11, // centered
                        -sizeRef * 2, // centered
                        -sizeRef * 3 // centered
                    ],
                    extrapolate: 'clamp'
                })
            }],
        };
    }

    function _renderItem ({item, index}) {
        return (
            <TouchableOpacity onPress={() => navigation.push('details' , {service_id:item.id})} style={[styles.Width_100]}>
                <View style={[styles.overlay_white , styles.carousalText]}>
                    <Text style={[styles.textRegular , styles.text_black , styles.textSize_14 , styles.marginHorizontal_5 ]}>
                        {item.name}</Text>
                    <Text style={[styles.textRegular , styles.text_black , styles.textSize_14 , styles.marginHorizontal_5 , {writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'} ]}>
                        { i18n.t('discountUp')} {item.discount}</Text>
                    <Text style={[styles.textRegular , styles.textDecoration , styles.text_black , styles.textSize_14 , styles.marginHorizontal_5 , styles.alignStart , {writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'} ]}>
                        { i18n.t('viewOffer')}</Text>
                </View>
                <Image source={{uri:item.image}} style={[{width:'100%' , height:200 , borderRadius:10}]} resizeMode={'cover'} />
            </TouchableOpacity>
        );
    }

    function pagination () {
        return (
            <Pagination
                dotsLength={offers.length}
                activeDotIndex={activeSlide}
                containerStyle={{ backgroundColor: 'transparent' , bottom:-40 , position:"absolute" , flex:1 , width:'100%' ,
                    left:15}}
                dotContainerStyle={{ backgroundColor: '#0f0' , height:0  }}
                dotStyle={{
                    borderRadius: 5,
                    marginHorizontal: -7,
                    backgroundColor: COLORS.blue,
                    width: 20,
                    height: 4,
                }}
                inactiveDotStyle={{
                    width: 15,
                    height: 7,
                    backgroundColor: COLORS.black,
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        );
    }


    return (
        <Container>
            {renderLoader()}
            <Content contentContainerStyle={[styles.bgFullWidth , styles.paddingTop_50]}>

                <View style={[styles.position_R , styles.Width_100 , styles.paddingHorizontal_15 ]}>
                    <View style={[styles.directionRow]}>
                        <Image source={require('../../assets/images/d_Logo.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                        <Text style={[styles.textBold , styles.text_black , styles.textSize_18 , styles.marginHorizontal_5 ]}>{ i18n.t('welcome') } , {user && user.name ? user.name: i18n.t('visitor')}</Text>
                    </View>

                    <View style={[styles.position_R, styles.height_90, styles.flexCenter, styles.marginBottom_5 , styles.Width_100]}>
                        <TouchableOpacity onPress={() => navigation.push('search' , {keyword:search})} style={[styles.searchIcon , styles.directionRow]}>
                            <Image source={require('../../assets/images/ico.png')} style={[styles.smImage]} resizeMode={'contain'} />
                            <Text style={[styles.textBold , styles.text_gray , styles.textSize_18 , styles.marginHorizontal_5 ]}>|</Text>
                        </TouchableOpacity>
                        <Input style={[styles.searchInput , styles.bg_light_gray , styles.marginVertical_20]}
                               placeholder={i18n.translate('search')}
                               placeholderTextColor={COLORS.gray}
                               onChangeText={(search) => setSearch(search)}
                               value={search}
                        />
                    </View>
                    <View style={[styles.directionRowSpace]}>
                        <Text style={[styles.textBold , styles.text_black , styles.textSize_16 , styles.marginHorizontal_5 ]}>{ i18n.t('categories')}</Text>
                        <TouchableOpacity onPress={() => navigation.push('services')}>
                            <Text style={[styles.textBold , styles.text_gray, styles.textDecoration , styles.textSize_12 , styles.marginHorizontal_5 ]}>{ i18n.t('viewAll')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.marginVertical_20]}>
                    <ScrollView style={[styles.scrollView ]} horizontal={true} showsHorizontalScrollIndicator={false}>

                        {
                            categories.map((cat, i) => {
                                    return (
                                        <TouchableOpacity key={i} onPress={() => navigation.push('category' , {category_id:cat.id , cat_name:cat.name})}
                                                          style={[styles.directionColumnCenter, styles.marginHorizontal_10]}>
                                            <Image source={{uri:cat.image}}
                                                   style={[styles.scrollImg]} resizeMode={'cover'}/>
                                            <Text
                                                style={[styles.textRegular, styles.text_black, styles.textSize_12, styles.marginHorizontal_5]}>{cat.name}</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            )
                        }

                    </ScrollView>
                </View>

                {
                    offers.length !== 0 ?
                        <View style={[styles.position_R , styles.Width_100 , styles.paddingHorizontal_15 , styles.marginBottom_25 ]}>
                            <View style={[styles.directionRowSpace]}>
                                <Text style={[styles.textBold , styles.text_black , styles.textSize_16 , styles.marginHorizontal_5 ]}>{ i18n.t('offers')}</Text>
                                <TouchableOpacity onPress={() => navigation.push('offers')}>
                                    <Text style={[styles.textBold , styles.text_gray, styles.textDecoration , styles.textSize_12 , styles.marginHorizontal_5 ]}>{ i18n.t('viewAll')}</Text>
                                </TouchableOpacity>
                            </View>
                            <Carousel
                                ref={carouselRef}
                                layout={'tinder'}
                                layoutCardOffset={isIOS ? `9` : null}
                                data={offers}
                                renderItem={_renderItem}
                                sliderWidth={width-30}
                                itemWidth={width-30}
                                loop={true}
                                autoplay={true}
                                slideStyle={[styles.marginVertical_25 , styles.flexCenter , {left:0} ]}
                                scrollInterpolator={isIOS ? null : scrollInterpolator}
                                slideInterpolatedStyle={isIOS ? null : _animatedStyles}
                                useScrollView={true}
                                onSnapToItem={(index) => setActiveSlide(index) }
                            />
                            { pagination() }
                        </View>
                        :
                        null
                }

                {
                    topRate.length !== 0 ?
                        <React.Fragment>
                            <View style={[styles.position_R , styles.Width_100 , styles.paddingHorizontal_15 ]}>
                                <View style={[styles.directionRowSpace]}>
                                    <Text style={[styles.textBold , styles.text_black , styles.textSize_16 , styles.marginHorizontal_5 ]}>{ i18n.t('topRated')}</Text>
                                    <TouchableOpacity onPress={() => navigation.push('topRated')}>
                                        <Text style={[styles.textBold , styles.text_gray, styles.textDecoration , styles.textSize_12 , styles.marginHorizontal_5 ]}>{ i18n.t('viewAll')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[styles.marginVertical_20 , styles.marginBottom_80]}>
                                <ScrollView style={[styles.scrollView ]} horizontal={true} showsHorizontalScrollIndicator={false}>

                                    {
                                        topRate.map((top, i) => {
                                                return (
                                                    <Product onToggleFavorite={() => toggleFavorite(top.id)}  isFav={top.isLiked} key={top.id} data={top} navigation={navigation}/>
                                                )
                                            }
                                        )
                                    }

                                </ScrollView>
                            </View>
                        </React.Fragment>
                        :
                        null
                }



            </Content>

        </Container>
    );
}

export default Home;
