import React, { useState , useEffect } from "react";
import {View, Text, Image, TouchableOpacity, Slider, Platform} from "react-native";
import {Container, Content,} from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import StarRating from "react-native-star-rating";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import  Modal  from "react-native-modal";
import {useDispatch, useSelector} from "react-redux";
import {geCitiesCapacity} from "../actions";

function Filter({navigation , route}) {

    const lang      = useSelector(state => state.lang.lang);
    const token     = useSelector(state => state.auth.user.data.token);
    const catId     = route.params && route.params.catId ? route.params.catId : null;
    const isOffered = route.params && route.params.isOffered ? route.params.isOffered : false;

    const citiesCapacity = useSelector(state => state.citiesCapacity.citiesCapacity);
    const citiesCapacityLoader = useSelector(state => state.citiesCapacity.loader);

    const [value, setValue] = useState(null);
    const [minValue, setMinValue] = useState(citiesCapacity.max/2);
    const [maxValue, setMaxValue] = useState(citiesCapacity.max/2);

    const [cityName, setCityName] = useState('');
    const [cityID, setCityId]     = useState(null);
    const [city, setCity]         = useState('');
    const [ciID, setCiID]         = useState(null);
    const [showModalCity, setShowModalCity] = useState(false);

    const [capacityName, setCapacityName] = useState('');
    const [capacityID, setCapacityId] = useState(null);
    const [capacity, setCapacity] = useState('');
    const [showModalCapacity, setShowModalCapacity] = useState(false);

    const [isDatePickerVisible, setIsDatePickerVisible ] = useState(false);
    const [date , setDate ] = useState('');
    const [offer, setOffer] = useState(isOffered);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(geCitiesCapacity(lang  , token))
    }, [citiesCapacityLoader]);

    function toggleModalCity () {
        setShowModalCity(!showModalCity);
    }

    function selectCity (name , id) {
        setCityName(name)
        setCityId(id)
    }

    function confirmCity () {
        setShowModalCity(!showModalCity);
        setCity(cityName)
        setCiID(cityID)
    }


    function toggleModalCapacity () {
        setShowModalCapacity(!showModalCapacity);
    }

    function selectCapacity (name , id) {
        setCapacityName(name)
        setCapacityId(id)
    }

    function confirmCapacity () {
        setShowModalCapacity(!showModalCapacity);
        setCapacity(capacityName)
    }
    function change(value){
        setValue(value)
    }

    function changeMaxValue(value){
        setMaxValue(value)
    }

    function changeMinValue(value){
        setMinValue(value)
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

    function onSearch(){
        navigation.push('search' , {rate:value , catId :catId? catId: null , date , city_id:ciID , min_price:minValue , max_price:maxValue , is_offered:offer , capacity})
    }

    console.log('citiesCapacity', citiesCapacity);

    return (
        <Container>
            <Content contentContainerStyle={[styles.bgFullWidth ]}>

                <View style={[styles.position_R , styles.bgFullWidth,
                    styles.marginVertical_25 , styles.marginTop_55, styles.Width_100]}>

                    <View style={[styles.Width_100 , styles.directionRowCenter , styles.paddingHorizontal_30 , styles.marginBottom_25
                    , {borderBottomWidth:1 , borderBottomColor:'#ddd' , paddingBottom:15}]}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={[{position:'absolute' , right:30 , top:0}]}>
                            <Image source={require('../../assets/images/close-icon.png')} style={[styles.smImage]} resizeMode={'contain'} />
                        </TouchableOpacity>
                        <Text style={[styles.textBold , styles.text_blue , styles.textSize_18 ]}>{ i18n.t('filters') }</Text>
                    </View>

                    <View style={[styles.Width_100, styles.paddingHorizontal_25]}>
                        <Text style={[styles.textRegular , styles.text_gray , styles.textSize_16 , styles.marginBottom_5, styles.alignStart]}>{ i18n.t('offers') }</Text>
                        <TouchableOpacity onPress={() => setOffer(!offer)} style={[styles.marginBottom_15]}>
                            <Image source={offer ? require('../../assets/images/offer_color.png') : require('../../assets/images/gray_offers.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                        </TouchableOpacity>
                        <Text style={[styles.textRegular , styles.text_gray , styles.textSize_16 , styles.marginBottom_5, styles.alignStart]}>{ i18n.t('rate') }</Text>
                        <View style={[styles.marginBottom_15]}>
                            <Image source={require('../../assets/images/rating_active.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                        </View>

                        <View style={[styles.Width_100 ,styles.marginBottom_15]}>
                            <View style={[styles.directionRow , {alignSelf:'flex-end'}]}>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    rating={value}
                                    fullStarColor={COLORS.blue}
                                    starSize={14}
                                    starStyle={{marginHorizontal:2}}
                                />
                            </View>
                            <Slider
                                step={1}
                                maximumValue={5}
                                onValueChange={(value) => change(value)}
                                // value={value}
                                thumbTintColor={COLORS.blue}
                                style={[styles.slider , styles.transformReverse , styles.Width_100]}
                                maximumTrackTintColor={COLORS.gray}
                                minimumTrackTintColor={COLORS.blue}
                            />
                        </View>

                        <View style={[styles.Width_100 , styles.directionRowSpace]}>

                            <TouchableOpacity onPress={toggleModalCity} style={[styles.flexCenter]}>
                                <Text style={[styles.textRegular , styles.text_gray , styles.textSize_16]}>{ i18n.t('city') }</Text>
                                <Image source={require('../../assets/images/city_acttive.png')} style={[styles.iconImg , styles.marginVertical_10]} resizeMode={'contain'} />
                                <View style={[styles.marginBottom_15 , styles.paddingHorizontal_10 , styles.paddingVertical_5 , styles.Radius_5 , {backgroundColor:city !== ''?'#EBEDF0':'transparent'}]}>
                                    <Text style={[styles.textRegular , styles.text_gray , styles.textSize_16]}>{city}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={showDatePicker} style={[styles.flexCenter]}>
                                <Text style={[styles.textRegular , styles.text_gray , styles.textSize_16]}>{ i18n.t('date') }</Text>
                                <Image source={require('../../assets/images/calender_active.png')} style={[styles.iconImg , styles.marginVertical_10]} resizeMode={'contain'} />
                                <View style={[styles.marginBottom_15 , styles.paddingHorizontal_10 , styles.paddingVertical_5 , styles.Radius_5 , {backgroundColor:date !== ''?'#EBEDF0':'transparent'}]}>
                                    <Text style={[styles.textRegular , styles.text_gray , styles.textSize_16]}>{date}</Text>
                                </View>
                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleConfirm}
                                    onCancel={hideDatePicker}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={toggleModalCapacity} style={[styles.flexCenter]}>
                                <Text style={[styles.textRegular , styles.text_gray , styles.textSize_16 ]}>{ i18n.t('capacity') }</Text>
                                <Image source={require('../../assets/images/capacity_active.png')} style={[styles.iconImg , styles.marginVertical_10]} resizeMode={'contain'} />
                                <View style={[styles.marginBottom_15 , styles.paddingHorizontal_10 , styles.paddingVertical_5 , styles.Radius_5 , {backgroundColor:capacity !== ''?'#EBEDF0':'transparent'}]}>
                                    <Text style={[styles.textRegular , styles.text_gray , styles.textSize_16]}>{capacity}</Text>
                                </View>
                            </TouchableOpacity>

                        </View>

                        <Text style={[styles.textRegular , styles.text_gray , styles.textSize_16 , styles.marginBottom_5, styles.alignStart]}>{ i18n.t('price') }</Text>
                        <View style={[styles.marginBottom_15]}>
                            <Image source={require('../../assets/images/pricing_active.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                        </View>

                        <View style={[styles.Width_100 ,styles.marginBottom_15 , styles.directionRowCenter]}>
                            <Slider
                                step={citiesCapacity ? citiesCapacity.step : 1 }
                                maximumValue={citiesCapacity ? citiesCapacity.max/2 : 10000}
                                minimumValue={citiesCapacity ? citiesCapacity.min : 100}
                                onValueChange={(minValue) => changeMinValue(minValue)}
                                value={minValue}
                                thumbTintColor={'#E873B1'}
                                style={[styles.slider, Platform.OS != 'ios' ? styles.transformReverse : null  , styles.Width_50 ,{right:-5}]}
                                maximumTrackTintColor={ Platform.OS == 'ios' ? '#f9b7d8' : '#c30068'}
                                minimumTrackTintColor={'#ddd'}
                            />

                            <View style={[styles.bg_pink ,{height:2, backgroundColor: '#f9b7d8' , width:22 , position:"absolute" , zIndex:-1 }]}/>

                            <Slider
								step={citiesCapacity ? citiesCapacity.step : 1 }
								maximumValue={citiesCapacity ? citiesCapacity.max : 10000}
								minimumValue={citiesCapacity ? citiesCapacity.max/2 : 100}
                                onValueChange={(maxValue) => changeMaxValue(maxValue)}
                                value={maxValue}
                                thumbTintColor={'#E873B1'}
                                style={[styles.slider , Platform.OS != 'ios' ? styles.transformReverse : null , styles.Width_50,{right:5}]}
                                maximumTrackTintColor={'#ddd'}
                                minimumTrackTintColor={'#f9b7d8'}
                            />
                        </View>

						<View
							style={[{marginRight: 15}, styles.marginBottom_15, styles.paddingHorizontal_10, styles.paddingVertical_5, styles.Radius_5, {backgroundColor: '#EBEDF0', alignSelf: 'center'}]}>
							<Text
								style={[styles.textRegular, styles.text_gray, styles.textSize_16]}>{ maxValue } : { minValue }</Text>
						</View>

                        <TouchableOpacity onPress={() => onSearch()} style={[styles.blueBtn , styles.Width_100 , styles.marginBottom_15]}>
                            <Text style={[styles.textRegular , styles.text_White , styles.textSize_16]}>{ i18n.t('search') }</Text>
                        </TouchableOpacity>

                    </View>

                    <Modal
                        onBackdropPress                 ={toggleModalCity}
                        onBackButtonPress               = {toggleModalCity}
                        isVisible                       = {showModalCity}
                        style                           = {styles.bgModel}
                        avoidKeyboard                    = {true}
                    >

                        <View style={[{borderTopLeftRadius:30,
                            borderTopRightRadius:30},styles.bg_White, styles.overHidden, styles.Width_100, styles.paddingVertical_10 , styles.paddingHorizontal_10]}>
                            <View style={[styles.overHidden, styles.Width_100 , styles.paddingHorizontal_25]}>

                                <View style={[styles.modalBorder]}/>

                                <Text style={[styles.textRegular , styles.text_gray , styles.textSize_16, { alignSelf: 'flex-start' }]}>{ i18n.t('city') }</Text>
                                <Image source={require('../../assets/images/city_acttive.png')} style={[styles.iconImg , styles.marginVertical_10]} resizeMode={'contain'} />

                                <View style={[styles.rowRight]}>
                                    {
                                        citiesCapacity && citiesCapacity.cities ?
                                            citiesCapacity.cities.map((city, i) => {
                                                    return (
                                                        <TouchableOpacity onPress={() => selectCity(city.name, city.id)}
                                                                          style={[{marginRight: 15}, styles.marginBottom_15, styles.paddingHorizontal_10, styles.paddingVertical_5, styles.Radius_5, {backgroundColor: cityID === city.id ? COLORS.blue : '#EBEDF0'}]}>
                                                            <Text
                                                                style={[styles.textRegular, cityID === city.id ? styles.text_White : styles.text_gray, styles.textSize_16]}>{city.name}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                }
                                            )
                                            : null
                                    }

                                </View>

                                <TouchableOpacity onPress={() => confirmCity()} style={[styles.blueBtn , styles.Width_100 , styles.marginBottom_35]}>
                                    <Text style={[styles.textRegular , styles.text_White , styles.textSize_16]}>{ i18n.t('confirm') }</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </Modal>

                    <Modal
                        onBackdropPress                 ={toggleModalCapacity}
                        onBackButtonPress               = {toggleModalCapacity}
                        isVisible                       = {showModalCapacity}
                        style                           = {styles.bgModel}
                        avoidKeyboard                    = {true}
                    >

                        <View style={[{borderTopLeftRadius:30,
                            borderTopRightRadius:30},styles.bg_White, styles.overHidden, styles.Width_100, styles.paddingVertical_10 , styles.paddingHorizontal_10]}>
                            <View style={[styles.overHidden, styles.Width_100 , styles.paddingHorizontal_25]}>

                                <View style={[styles.modalBorder]}/>

                                <Text style={[styles.textRegular , styles.text_gray , styles.textSize_16, { alignSelf: 'flex-start' }]}>{ i18n.t('capacity') }</Text>
                                <Image source={require('../../assets/images/capacity_active.png')} style={[styles.iconImg , styles.marginVertical_10]} resizeMode={'contain'} />

                                <View style={[styles.rowRight]}>
                                    {
                                        citiesCapacity && citiesCapacity.capacities ?
                                            citiesCapacity.capacities.map((cap, i) => {
                                                    return (
                                                        <TouchableOpacity onPress={() => selectCapacity(cap, cap)}
                                                                          style={[{marginRight: 15}, styles.marginBottom_15, styles.paddingHorizontal_10, styles.paddingVertical_5, styles.Radius_5, {backgroundColor: capacityID === cap ? COLORS.blue : '#EBEDF0'}]}>
                                                            <Text
                                                                style={[styles.textRegular, capacityID === cap ? styles.text_White : styles.text_gray, styles.textSize_16]}>{cap}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                }
                                            )
                                            : null
                                    }

                                </View>

                                <TouchableOpacity onPress={() => confirmCapacity()} style={[styles.blueBtn , styles.Width_100 , styles.marginBottom_35]}>
                                    <Text style={[styles.textRegular , styles.text_White , styles.textSize_16]}>{ i18n.t('confirm') }</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </Modal>
                </View>
            </Content>
        </Container>
    );
}

export default Filter;


