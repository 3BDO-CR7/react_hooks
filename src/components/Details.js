import React, { useState , useEffect } from "react";
import {View, Text, Image, TouchableOpacity, I18nManager, Share, ActivityIndicator} from "react-native";
import {Container, Icon, Toast} from 'native-base'
import Swiper from 'react-native-swiper';
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import StarRating from "react-native-star-rating";
import COLORS from "../consts/colors";
import {useDispatch, useSelector} from "react-redux";
import {getServiceDetails, setRate} from "../actions";
import axios from "axios";
import CONST from "../consts";

function Details({navigation , route}) {

	const service_id = route.params.service_id;
	const lang = useSelector(state => state.lang.lang);
	const token = useSelector(state => state.auth.user ? state.auth.user.data.token : null);
	const user  = useSelector(state => state.auth.user ? state.auth.user.data :  {name: null});

	const serviceDetails = useSelector(state => state.serviceDetails.serviceDetails);
	const serviceDetailsLoader = useSelector(state => state.serviceDetails.loader);

	const [screenLoader , setScreenLoader ] = useState(true);

	const [isFav , setFav ] = useState(false);
	const [starCount, setStarCount] = useState(0);

	const [isAutoplay , setIsAutoplay ] = useState(false);
	const [isDatePickerVisible , setIsDatePickerVisible ] = useState(false);
	const [date , setDate ] = useState('');

	const dispatch = useDispatch();

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

	function fetchData(){

		axios({
			url         : CONST.url + 'service_details',
			method      : 'POST',
			data        : {lang , service_id},
			headers     : {Authorization: token}
		}).then(response => {
			dispatch({type: 'getServiceDetails', payload: response.data});
			setFav(serviceDetails.isLiked);
			setStarCount(serviceDetails.rate);
			setScreenLoader(false)
		});

	}

	useEffect(() => {
		fetchData();
		const unsubscribe = navigation.addListener('focus', () => {
			fetchData();
		});

		return unsubscribe;
	}, [navigation , serviceDetailsLoader, starCount , isFav]);


	function renderLoader(){
		if (screenLoader){
			return(
				<View style={[styles.loading, styles.flexCenter, {height:'100%' , backgroundColor:'#fff'}]}>
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

	return (
		<Container>
			{renderLoader()}
			{/*<Content style={{height}}>*/}
			{
				serviceDetails ?
					<Swiper dotStyle={[styles.doteStyle2]}
						activeDotStyle={[styles.activeDot2]}
						key={serviceDetails.images.length}
						containerStyle={{}} showsButtons={false}
						style={{ flexDirection: 'row-reverse' }}
						autoplay={isAutoplay} loop={true} >

						{
							serviceDetails.images.map((img, i) => {
								return(
									<View style={[styles.Width_100]} key={'_' + i}>
										<Image source={{uri:img}} style={[styles.swiperImg]} resizeMode={'cover'} />
										<View style={[styles.swiperOverlay]}/>
										<View style={[ styles.heightFull , styles.Width_100 , styles.paddingHorizontal_20 , styles.paddingVertical_45 , { zIndex:1, position:"absolute" , flex:1}]}>

											<View style={[styles.directionRowSpace ,styles.Width_100 ]}>
												<TouchableOpacity onPress={() => navigation.goBack()} style={[styles.transform]}>
													<Image source={require('../../assets/images/white_back.png')} style={[styles.smImage]} resizeMode={'contain'} />
												</TouchableOpacity>
												<View style={[styles.directionRow]}>
													{
														user.token?
															<TouchableOpacity onPress = {() => toggleFavorite(service_id)} style={[styles.touchFav , styles.flexCenter, {margin:0 , backgroundColor: "#bbb"}]}>
																<Icon style={[isFav ? styles.text_red : styles.text_black, styles.textSize_18]} type="AntDesign" name={isFav ? 'heart' : 'hearto'} />
															</TouchableOpacity>
															:
															null
													}

													{/*<TouchableOpacity onPress={showDatePicker} style={[styles.touchFav , styles.flexCenter, {margin:0 , backgroundColor: "#bbb" , marginHorizontal:5}]}>*/}
														{/*<Image source={require('../../assets/images/calendar.png')} style={[styles.favImage]} resizeMode={'contain'} />*/}
													{/*</TouchableOpacity>*/}
													<TouchableOpacity onPress={() => onShare()} style={[styles.touchFav , styles.flexCenter, {margin:0 , backgroundColor: "#bbb", marginLeft:5}]}>
														<Image source={require('../../assets/images/share.png')} style={[styles.favImage]} resizeMode={'contain'} />
													</TouchableOpacity>
													<DateTimePickerModal
														isVisible={isDatePickerVisible}
														mode="date"
														onConfirm={handleConfirm}
														onCancel={hideDatePicker}
													/>
												</View>
											</View>
											<View style={[styles.Width_100 , styles.heightFull ,{justifyContent:'space-between'}]}>

												<View style={[{flex:1 , justifyContent:'center'}]}>
													{
														serviceDetails.discount?
															<React.Fragment>
																<Text style={[styles.textRegular , styles.text_White , styles.textSize_32  ,{alignSelf:'flex-start'}]}>
																	{serviceDetails.discount}
																</Text>
																<Text style={[styles.textRegular , styles.text_White ,
																	styles.textSize_32 , {alignSelf:'flex-start'} ]}>
																	{ i18n.t('discount')}
																</Text>
															</React.Fragment>
															:
															null
													}

												</View>

												<View>
													<View style={[styles.directionRowSpace , styles.marginBottom_5]}>
														<Text style={[styles.textRegular , styles.text_White , styles.textSize_20 ]}>
															{serviceDetails.title}</Text>
														<Text style={[styles.textRegular , styles.text_White , styles.textSize_18 ]}>
															{serviceDetails.new_price}</Text>
													</View>
													<View style={[styles.width_80  , styles.directionRow]}>
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

													<Text style={[styles.textRegular , styles.text_White , styles.textSize_14 , styles.alignStart ,
														styles.marginVertical_10 , {height:90 , lineHeight:22 , writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'} ]}>
														{serviceDetails.desc}
													</Text>
													<View style={[styles.directionRowSpace , styles.marginTop_20]}>
														<TouchableOpacity onPress={() => navigation.push('moreDetails' , {service_id:service_id})} style={[styles.directionRow]}>
															<Text style={[styles.textRegular , styles.text_blue , styles.textSize_20]}>
																{ i18n.t('more')}</Text>
															<Image source={require('../../assets/images/tike_not.png')} style={[styles.arrow, styles.marginHorizontal_10 ,styles.transform]} resizeMode={'contain'} />
														</TouchableOpacity>
														{
															serviceDetails.images.length > 1 ?
																<TouchableOpacity onPress={() => setIsAutoplay(!isAutoplay)} style={[styles.transform]}>
																	<Image source={isAutoplay ? require('../../assets/images/pause.png') : require('../../assets/images/play_vedio.png')} style={[styles.iconBank]} resizeMode={'contain'} />
																</TouchableOpacity>
																:
																null
														}
													</View>
												</View>
											</View>

										</View>
									</View>
								)
							})
						}

					</Swiper>
					:
					null
			}

			{/*</Content>*/}
		</Container>
	);
}

export default Details;
