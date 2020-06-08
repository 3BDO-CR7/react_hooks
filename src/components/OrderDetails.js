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
import {Card, Container, Content, Form, Icon} from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import  Modal  from "react-native-modal";
import {useDispatch, useSelector} from "react-redux";
import {getBookingDetails, cancelBooking} from "../actions";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function OrderDetails({navigation, route}) {

    const booking_id = route.params.booking_id;
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user.data.token);

    const bookingDetails = useSelector(state => state.bookingDetails.bookingDetails);
    const bookingDetailsLoader = useSelector(state => state.bookingDetails.loader);
    const [showModal, setShowModal] = useState(false);

    const [screenLoader , setScreenLoader ] = useState(true);
    const dispatch = useDispatch();


    function fetchData(){
        setScreenLoader(true)
        dispatch(getBookingDetails(lang ,booking_id , token))
    }

    useEffect(() => {
        fetchData();
        const unsubscribe = navigation.addListener('focus', e => {
            fetchData();
        });

        return unsubscribe;
    }, [navigation , bookingDetailsLoader]);

    useEffect(() => {
        setScreenLoader(false)
    }, [bookingDetails]);

    function renderLoader(){
        if (screenLoader){
            return(
                <View style={[styles.loading, styles.flexCenter, {height:'100%' , backgroundColor:'#fff'}]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }

    function toggleModal () {
        setShowModal(!showModal);
    };

    function cancelOrder () {
        setShowModal(!showModal);
        dispatch(cancelBooking(lang ,booking_id , token , navigation))
    };

    return (
        <Container>
            {renderLoader()}
            {
                bookingDetails ?
                    <ImageBackground source={{uri:bookingDetails.service_image}} style={[styles.bgFullWidth]}>
                        <View style={[styles.bgFullWidth]}>
                            <View style={[styles.swiperOverlay , styles.bgFullWidth , {zIndex:1}]}/>
							<ScrollView style={{ zIndex: 1 }}>
								<View style={[ styles.heightFull, styles.directionColumnSpace, styles.paddingHorizontal_20 , styles.paddingVertical_45 ]}>
									<View style={[styles.Width_100]}>
										<TouchableOpacity onPress={() => navigation.goBack()} style={[styles.marginBottom_25 , styles.transform , styles.alignStart]}>
											<Image source={require('../../assets/images/white_back.png')} style={[styles.smImage]} resizeMode={'contain'} />
										</TouchableOpacity>

										<Text style={[styles.textBold , styles.text_White , styles.textSize_18 , styles.marginBottom_5, styles.alignStart]}>{ i18n.t('orderDetails') }</Text>
									</View>
									<View style={[styles.Width_100, { height: height-150, justifyContent: 'flex-end' }]}>
										<View style={[styles.notiCard , {backgroundColor: "#888ca08c"}]}>
											<TouchableOpacity onPress={() => navigation.push('details', {service_id:bookingDetails.service_id})} style={[styles.cardView , { borderLeftWidth: 0}]}>
												<View style={[styles.cardDate ,styles.paddingHorizontal_15]}>
													<Text style={[styles.textRegular , styles.text_White , styles.textSize_14 , styles.textCenter , styles.marginBottom_5]}>{bookingDetails.date}</Text>
													{/*<Text style={[styles.textRegular , styles.text_White , styles.textSize_14 , styles.textCenter , styles.marginBottom_5]}>2020</Text>*/}
												</View>
												<View style={[styles.paddingHorizontal_15 , styles.directionColumnC , {flex:1} ]}>
													<Text style={[styles.textBold , styles.text_black , styles.textSize_14 , styles.marginBottom_5, styles.alignStart]}>{bookingDetails.service_name}</Text>
													<Text style={[styles.textRegular , styles.text_White , styles.textSize_14 , styles.marginBottom_5, styles.alignStart]}>{bookingDetails.payment_type}</Text>
													<Text style={[styles.textRegular , styles.text_blue , styles.textSize_14  , styles.alignStart]}>{bookingDetails.price}</Text>
												</View>
											</TouchableOpacity>
										</View>

										<View style={[styles.marginTop_15, styles.paddingHorizontal_10 , styles.marginHorizontal_10 ]}>
											<View style={[styles.whiteDot]}/>
											<View style={[styles.whiteDot, {top:10}]}/>
											<View style={[styles.whiteDot, {top:20}]}/>
											<View style={[styles.whiteDot, {top:30}]}/>
											<View style={[styles.whiteDot, {top:40}]}/>
											<Text style={[styles.textRegular , styles.text_White , styles.textSize_14 , styles.marginBottom_5, styles.alignStart]}>{bookingDetails.text_status}</Text>
											<Text style={[styles.textRegular , styles.text_White , styles.textSize_14 , styles.marginBottom_5, styles.alignStart]}>{ i18n.t('providerInfo') }</Text>
										</View>

										<View style={[styles.notiCard , {backgroundColor: "#888ca08c"}]}>
											<View style={[styles.cardView , { borderLeftWidth: 0}]}>
												<View style={[styles.cardDate ,styles.paddingHorizontal_15]}>
													<View  style={[styles.iconImg , {borderRadius:50 , overflow:'hidden', borderColor:COLORS.blue, borderWidth:2}]}>
														<Image source={{uri:bookingDetails.provider_image}} style={[styles.Width_100 , styles.heightFull]} resizeMode={'cover'} />
													</View>
												</View>
												<View style={[styles.paddingHorizontal_15 , styles.directionColumnC , {flex:1} ]}>
													<Text style={[styles.textBold , styles.text_black , styles.textSize_14 , styles.marginBottom_5, styles.alignStart]}>{bookingDetails.provider_name}</Text>
													<Text style={[styles.textRegular , styles.text_White , styles.textSize_14 , styles.marginBottom_5, styles.alignStart]}>{bookingDetails.provider_phone}</Text>
													<Text style={[styles.textRegular , styles.text_White , styles.textSize_14  , styles.alignStart]}>{bookingDetails.provider_email}</Text>
												</View>
											</View>
										</View>

										{
											bookingDetails.status == 0 ?
												<TouchableOpacity onPress={toggleModal} style={[styles.blueBtn , styles.Width_90 , styles.flexCenter]}>
													<Text style={[styles.textRegular , styles.text_White , styles.textSize_16]}>{ i18n.t('cancelOrder') }</Text>
												</TouchableOpacity>
												:
												null
										}


									</View>
									<Modal
										onBackdropPress                 ={toggleModal}
										onBackButtonPress               = {toggleModal}
										isVisible                       = {showModal}
										style                           = {styles.bgModel}
										avoidKeyboard                    = {true}
									>

										<View style={[{borderTopLeftRadius:30,
											borderTopRightRadius:30},styles.bg_White, styles.overHidden, styles.Width_100, styles.paddingVertical_10 , styles.paddingHorizontal_10]}>
											<View style={[styles.overHidden , styles.flexCenter , styles.Width_100]}>

												<View style={[styles.modalBorder]}/>

												<Text style={[styles.textRegular , styles.text_gray , styles.textSize_16
													, styles.textCenter , styles.marginBottom_5]}>{ i18n.t('confirmCancel') }</Text>

												<TouchableOpacity onPress={() => cancelOrder()} style={[styles.blueBtn , styles.Width_80]}>
													<Text style={[styles.textRegular , styles.text_White , styles.textSize_16]}>{ i18n.t('confirm') }</Text>
												</TouchableOpacity>

												<TouchableOpacity onPress={() =>  toggleModal()} style={[styles.grayBtn , styles.Width_80 , styles.marginBottom_35]}>
													<Text style={[styles.textRegular , styles.text_White , styles.textSize_16]}>{ i18n.t('cancel') }</Text>
												</TouchableOpacity>
											</View>
										</View>

									</Modal>
								</View>
                            </ScrollView>
                        </View>
                    </ImageBackground>
                    :
                    null
            }

        </Container>
    );
}

export default OrderDetails;


