import React, { useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    I18nManager,
    AsyncStorage,
    Platform,
    ActivityIndicator
} from "react-native";
import { Container } from 'native-base'
import Swiper from 'react-native-swiper';
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import {useSelector, useDispatch} from 'react-redux';
import {getIntro} from '../actions';
import COLORS from "../consts/colors";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const isIOS = Platform.OS === 'ios';

function Intro({navigation}) {

    const lang = useSelector(state => state.lang.lang);
    const intro = useSelector(state => state.intro.intro)
    const loader = useSelector(state => state.intro.loader)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getIntro(lang))
    }, [loader]);

    function renderLoader(){
        if (loader === false){
            return(
                <View style={[styles.loading, styles.flexCenter, {height:'100%'}]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }

    function navigateToLogin(){
        AsyncStorage.setItem('intro', 'true');
        navigation.push('login');
    }


    return (
        <Container>
            {renderLoader()}
            {/*<Content>*/}
                <Swiper dotStyle={[styles.doteStyle]}
                        activeDotStyle={[styles.activeDot]}
                        key={intro.length}
                        containerStyle={{}} showsButtons={true}
                        buttonWrapperStyle={{top:height-95, height:50 , paddingRight:50 }}
                        prevButton={<View/>}
                        style={{ flexDirection: isIOS && I18nManager.isRTL  ? 'row' : 'row-reverse' }}
                        nextButton={<Text style={[styles.textBold ,{color:'#fff'}]}>{ i18n.t('next') }</Text>}
                        autoplay={false} loop={false}>

                    {
                        intro.map((intr, i) => {
                            return(
                                <View style={{}} key={'_' + i}>
                                    <Image source={{uri:intr.image}} style={[styles.swiperImg]} resizeMode={'cover'} />
                                    <View style={[styles.swiperOverlay]}/>
                                    <View style={[styles.swiperborder]}/>
                                    <View style={[styles.directionColumnCenter , styles.heightFull , styles.Width_60 , styles.flexCenter
                                        , { zIndex:1, position:"absolute"}]}>
                                        <Image source={{uri:intr.icon}} style={[styles.icoImage , styles.marginBottom_15]} resizeMode={'contain'} />
                                        <Text style={[styles.textBold , styles.text_White , styles.textSize_18, styles.textCenter , styles.marginBottom_10 ]}>{ intr.title }</Text>
                                        <Text style={[styles.textRegular , styles.text_White , styles.textSize_14, styles.textCenter ]}>{ intr.desc }</Text>
                                        {
                                            (I18nManager.isRTL ? i+1 : i+3) === intro.length ?
                                                <TouchableOpacity onPress={navigateToLogin} style={[styles.blueBtn]}>
                                                    <Text style={[styles.textRegular , styles.text_White , styles.textSize_16]}>{ i18n.t('startNow') }</Text>
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity onPress={navigateToLogin} style={[{position:'absolute' , bottom:60 , left:-20} , styles.paddingHorizontal_25]}>
                                                    <Text style={[styles.textBold ,{color:'#fff'}]}>{ i18n.t('skip') }</Text>
                                                </TouchableOpacity>
                                        }

                                    </View>
                                </View>
                            )
                        })
                    }

                </Swiper>
            {/*</Content>*/}
        </Container>
    );
}

export default Intro;


