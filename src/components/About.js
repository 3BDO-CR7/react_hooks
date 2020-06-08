import React, { useEffect } from "react";
import {
    View,
    Text,
    Image,ActivityIndicator,
    TouchableOpacity,ScrollView, I18nManager
} from "react-native";
import {Container, Content} from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import {useSelector, useDispatch} from 'react-redux';
import {getAbout, logout, tempAuth} from '../actions';

function About({navigation}) {

    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user ? state.auth.user.data.token : null);

    const about = useSelector(state => state.about.about)
    const loader = useSelector(state => state.about.loader)

    const user  = useSelector(state => state.auth.user ? state.auth.user.data : { avatar: ''});

    const dispatch = useDispatch()

    function fetchData(){
        dispatch(getAbout(lang))
    }

    useEffect(() => {
        fetchData();
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData();
        });

        return unsubscribe;
    }, [navigation , loader]);

    function renderLoader(){
        if (loader === false){
            return(
                <View style={[styles.loading, styles.flexCenter, {height:'100%'}]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }

    function logoutFunc(){
        dispatch(logout(lang , token));
        dispatch(tempAuth(token));
    }

    return (
        <Container>
            {renderLoader()}
            <ScrollView contentContainerStyle={[styles.bgFullWidth]}>
                <View style={[styles.position_R , styles.bgFullWidth, styles.Width_100]}>
                    <View style={[styles.Width_100 , styles.topNav , {borderBottomWidth:2 , borderLeftWidth:2 , borderColor:'#f0f0f0'}]}>
                        <ScrollView style={{}} contentContainerStyle={[styles.directionRowSpace , styles.Width_100 , styles.paddingHorizontal_15 , {
                            paddingTop:15
                        }]} horizontal={true} showsHorizontalScrollIndicator={false}>
                            <TouchableOpacity onPress={() =>
                                navigation.navigate('home', {
                                    screen: 'home',
                                    // params: { user: 'jane' },
                                })
                            }>
                                <Image source={require('../../assets/images/menu_home.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('profile')} style={[styles.iconImg , {borderRadius:50 , overflow:'hidden', borderColor:COLORS.gray, borderWidth:2}]}>
                                <Image source={{uri:user.avatar}} style={[styles.Width_100 , styles.heightFull]} resizeMode={'cover'} />
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={() => navigation.push('favourite')}>
                                <Image source={require('../../assets/images/menu_like.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                            </TouchableOpacity>
                            <View>
                                <Image source={require('../../assets/images/about_color.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                            </View>
                            <TouchableOpacity onPress={() => navigation.push('settings')}>
                                <Image source={require('../../assets/images/setting.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => logoutFunc()} style={[styles.transformReverse]}>
                                <Image source={require('../../assets/images/menu_logout.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    <View style={[styles.Width_100 , styles.paddingHorizontal_20 , styles.marginTop_25]}>
                        <Text style={[styles.textBold , styles.text_black , styles.textSize_18 , styles.marginBottom_15, styles.alignStart]}>{ i18n.t('aboutApp')}</Text>

                        <Text style={[styles.textBold , styles.text_black , styles.textSize_14 , styles.marginBottom_10, styles.alignStart]}>{ i18n.t('about')}</Text>
                        {
                            about?
                                <Text style={[styles.textRegular , styles.text_gray , styles.textSize_13 ,{lineHeight:24 , writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'} ]}>
                                    {about.about_app}
                                </Text>
                                :
                                null
                        }


                    </View>

                </View>
            </ScrollView>
        </Container>
    );
}

export default About;
