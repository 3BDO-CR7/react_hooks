import React, { useState , useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    I18nManager,
    Share,
    ImageBackground,
    ActivityIndicator,
    ScrollView
} from "react-native";
import {Container, Content, Icon, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import StarRating from "react-native-star-rating";
import COLORS from "../consts/colors";
import {useDispatch, useSelector} from "react-redux";
import {getServiceDetails , setRate} from "../actions";
import axios from "axios";
import CONST from "../consts";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function MoreDetails({navigation , route}) {

    const service_id = route.params.service_id;
    const lang = useSelector(state => state.lang.lang);
	const token = useSelector(state => state.auth.user ? state.auth.user.data.token : null);
    const user  = useSelector(state => state.auth.user ? state.auth.user.data :  {name: null});

    const serviceDetails = useSelector(state => state.serviceDetails.serviceDetails);
    const serviceDetailsLoader = useSelector(state => state.serviceDetails.loader);

    const [isFav , setFav ] = useState(serviceDetails.isLiked);
    const [starCount, setStarCount] = useState(serviceDetails.rate);

    const [isDatePickerVisible , setIsDatePickerVisible ] = useState(false);
    const [date , setDate ] = useState('');

    function toggleFavorite (id){
        // dispatch(setFavourite(lang , id , token));
        axios({
            url         : CONST.url + 'fav',
            method      : 'POST',
            headers     : { Authorization: token },
            data        : {lang ,service_id :id }
        }).then(response => {

            setFav(!isFav);

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
    function onStarRatingPress(rating) {
        setStarCount(rating);
        dispatch(setRate(lang , service_id , rating, token))
    }

    const dispatch = useDispatch();

    function fetchData(){
        dispatch(getServiceDetails(lang ,service_id , token));
    }

    useEffect(() => {
        fetchData();
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData();
        });

        return unsubscribe;
    }, [navigation , serviceDetailsLoader, starCount , isFav]);


    function renderLoader(){
        if (serviceDetailsLoader === false){
            return(
                <View style={[styles.loading, styles.flexCenter, {height:'100%'}]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
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
        setDate(formatted_date);
    };

    const onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    'Msara App',
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    function onReservation(service_id, new_price, date) {
        if (date != '')
		    navigation.navigate("reservation" , {service_id, totalPrice: new_price , date})
        else{
			Toast.show({
				text        	: i18n.t('chooseDate'),
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
            {renderLoader()}
            <ImageBackground source={{uri:serviceDetails.images[0]}} style={[styles.bgFullWidth]}>
               <View style={[styles.bgFullWidth]}>
                   <View style={[styles.swiperOverlay , styles.bgFullWidth , {backgroundColor: "rgba(0, 0, 0, 0.8)" , zIndex:1}]}/>
                   <ScrollView style={[{zIndex:1}]}>
                       <View style={[ styles.heightFull , styles.paddingHorizontal_20 , styles.paddingVertical_45 ]}>
                           <View style={[styles.directionRowSpace ,styles.Width_100]}>
                               <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.transform]}>
                                   <Image source={require('../../assets/images/white_back.png')} style={[styles.smImage]} resizeMode={'contain'} />
                               </TouchableOpacity>
                               <View style={[styles.directionRow ]}>
                                   {
                                       user.token?
                                           <TouchableOpacity onPress = {() => toggleFavorite(service_id)} style={[styles.touchFav , styles.flexCenter, {margin:0 , backgroundColor: "#bbb"}]}>
                                               <Icon style={[isFav ? styles.text_red : styles.text_black, styles.textSize_18]} type="AntDesign" name={isFav ? 'heart' : 'hearto'} />
                                           </TouchableOpacity>
                                           : null
                                   }

                                   <TouchableOpacity onPress={showDatePicker} style={[styles.touchFav , styles.flexCenter, {margin:0 , backgroundColor: "#bbb" , marginHorizontal:5}]}>
                                       <Image source={require('../../assets/images/calendar.png')} style={[styles.favImage]} resizeMode={'contain'} />
                                   </TouchableOpacity>
                                   <TouchableOpacity onPress={() => onShare()} style={[styles.touchFav , styles.flexCenter, {margin:0 , backgroundColor: "#bbb"}]}>
                                       <Image source={require('../../assets/images/share.png')} style={[styles.favImage]} resizeMode={'contain'} />
                                   </TouchableOpacity>
                                   <DateTimePickerModal
                                       isVisible={isDatePickerVisible}
                                       mode="date"
                                       onConfirm={handleConfirm}
                                       onCancel={hideDatePicker}
                                       minimumDate={new Date()}
                                   />
                               </View>
                           </View>
                           <View style={[styles.Width_100 , styles.marginTop_35 , {justifyContent:'space-between' , flex:1}]}>
                               <View>
                                   <View style={[styles.directionRowSpace , styles.marginBottom_5]}>
                                       <Text style={[styles.textRegular , styles.text_White , styles.textSize_20 , styles.Width_70]}>
                                           {serviceDetails.title}</Text>
                                       <Text style={[styles.textRegular , styles.text_White , styles.textSize_18 ]}>
                                           {serviceDetails.new_price}</Text>
                                   </View>
                                   <View style={[styles.directionRowSpace , styles.marginBottom_5 ,styles.Width_100 ]}>
                                       <View style={[ styles.directionRow]}>
                                           <StarRating
                                               disabled={false}
                                               maxStars={5}
                                               rating={starCount}
                                               selectedStar={(rating) => onStarRatingPress(rating)}
                                               fullStarColor={COLORS.orange}
                                               starSize={14}
                                               starStyle={{marginHorizontal:2}}
                                           />
                                           <Text style={[styles.textRegular , styles.text_orange , styles.textSize_14 , styles.marginHorizontal_5 ]}>
                                               {serviceDetails.rate}</Text>
                                       </View>
                                       {
                                           serviceDetails.old_price !== serviceDetails.new_price ?
                                               <Text style={[styles.textRegular , styles.text_gray , styles.textSize_16 , styles.linethrough ]}>
                                                   {serviceDetails.old_price}</Text>
                                               :
                                               null
                                       }

                                   </View>


                                   <Text style={[styles.textRegular , styles.text_White , styles.textSize_14 ,
                                       styles.marginVertical_10 , {lineHeight:22,writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'} ]}>
                                       {serviceDetails.desc}
                                   </Text>

                                   <Text style={[styles.textRegular , styles.text_White , styles.textSize_18 , styles.marginTop_15 ,
                                       styles.marginBottom_5 ,styles.alignStart]}>
                                       { i18n.t('space')}</Text>

                                   <Text style={[styles.textRegular , styles.text_gray , styles.textSize_16 , styles.marginBottom_15 , styles.alignStart ]}>
                                       {serviceDetails.capacity? serviceDetails.capacity : 0} { i18n.t('person')}</Text>

                                   <Text style={[styles.textRegular , styles.text_White , styles.textSize_18 ,styles.marginBottom_5  , styles.alignStart ]}>
                                       { i18n.t('socialMedia')}</Text>
                                   <Text style={[styles.textRegular , styles.text_gray , styles.textSize_16 , styles.alignStart ]}>
                                       {serviceDetails.phone}
                                   </Text>
                                   <Text style={[styles.textRegular , styles.text_blue , styles.textSize_16 , styles.alignStart ]}>
                                       {serviceDetails.email}
                                   </Text>
                               </View>
                               <View style={[styles.marginTop_55]}>
                                   <TouchableOpacity onPress={() => navigation.push("hallLocation" , {latitude:serviceDetails.latitude , longitude:serviceDetails.longitude})} style={[styles.flexCenter , styles.directionRow]}>
                                       <Image source={require('../../assets/images/location_hall.png')} style={[styles.favImage, styles.marginHorizontal_10]} resizeMode={'contain'} />
                                       <Text style={[styles.textRegular , styles.text_White , styles.textSize_16]}>
                                           { i18n.t('hallLocation')}
                                       </Text>
                                   </TouchableOpacity>
                                   {
                                       user.token?
                                           <TouchableOpacity onPress={() => onReservation(service_id , serviceDetails.new_price , date)} style={[styles.blueBtn , styles.Width_100]}>
                                               <Text style={[styles.textRegular , styles.text_White , styles.textSize_16]}>{ i18n.t('reservation') }</Text>
                                           </TouchableOpacity>
                                           :
                                           null
                                   }
                               </View>

                           </View>
                       </View>
                   </ScrollView>
               </View>
            </ImageBackground>
        </Container>
    );
}

export default MoreDetails;


