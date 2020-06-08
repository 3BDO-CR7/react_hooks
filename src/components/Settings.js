import React, { useState , useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity, ScrollView, Switch, Share
} from "react-native";
import {Container, Content, Card} from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import {useDispatch, useSelector} from "react-redux";
import {getNoti, logout, tempAuth} from "../actions";

function Settings({navigation}) {

    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user ? state.auth.user.data.token : null);
    const user = useSelector(state => state.auth.user ? state.auth.user.data : { avatar: '' });
    let isNotify = useSelector(state => state.auth.isNotify);

    const [switchValue, setSwitchValue] = useState(isNotify);

    const dispatch = useDispatch();

    useEffect(() => {
        setSwitchValue(isNotify);
    }, [isNotify]);

    function logoutFunc(){
        dispatch(logout(lang , token));
        dispatch(tempAuth(token));
    }

    function toggleSwitch(value) {
        setSwitchValue(value);
        dispatch(getNoti(lang , value , token))
    }

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
                            <TouchableOpacity onPress={() => navigation.push('about')}>
                                <Image source={require('../../assets/images/menu_about.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                            </TouchableOpacity>
                            <View>
                                <Image source={require('../../assets/images/setting_color.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                            </View>
                            <TouchableOpacity onPress={() => logoutFunc()} style={[styles.transformReverse]}>
                                <Image source={require('../../assets/images/menu_logout.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    <View style={[styles.Width_100 , styles.paddingHorizontal_20 , styles.marginTop_25]}>
                        <Text style={[styles.textBold , styles.text_black , styles.textSize_18 , styles.marginBottom_15, styles.alignStart]}>{ i18n.t('settings')}</Text>

                        <Text style={[styles.textBold , styles.text_black , styles.textSize_15 , styles.marginBottom_10, styles.alignStart]}>{ i18n.t('account')}</Text>
                        <Card style={[{padding:15} , styles.Radius_10 , styles.marginBottom_15]}>
                            <TouchableOpacity onPress={() => navigation.push('editProfile')} style={[styles.Width_100 , styles.directionRowSpace]}>
                                <Text style={[styles.textRegular , styles.text_gray , styles.textSize_15 ]}>{ i18n.t('editData')}</Text>
                                <Image source={require('../../assets/images/left_arrow.png')} style={[styles.footerIcon, styles.transform]} resizeMode={'contain'} />
                            </TouchableOpacity>
                            <View style={[styles.Width_90 , styles.flexCenter , styles.marginVertical_15 , {borderWidth:.5 , borderColor:'#ddd'}]}/>
                            <TouchableOpacity onPress={() => navigation.push('changePass')} style={[styles.Width_100 , styles.directionRowSpace]}>
                                <Text style={[styles.textRegular , styles.text_gray , styles.textSize_15 ]}>{ i18n.t('changePass')}</Text>
                                <Image source={require('../../assets/images/left_arrow.png')} style={[styles.footerIcon, styles.transform]} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </Card>

                        <Text style={[styles.textBold , styles.text_black , styles.textSize_15 , styles.marginBottom_10 , styles.marginTop_5, styles.alignStart]}>{ i18n.t('notifications')}</Text>
                        <Card style={[{padding:15} , styles.Radius_10, styles.marginBottom_15]}>
                            <View style={[styles.Width_100 , styles.directionRowSpace]}>
                                <Text style={[styles.textRegular , styles.text_gray , styles.textSize_15 ]}>{ i18n.t('appNoti')}</Text>
                                <Switch
                                    style={{}}
                                    onValueChange={() => toggleSwitch(!switchValue)}
                                    value={switchValue}
                                    trackColor={COLORS.blue}
                                    thumbColor={'#F1F1F1'}
                                />
                            </View>
                        </Card>

                        <Text style={[styles.textBold , styles.text_black , styles.textSize_15 , styles.marginBottom_10 , styles.marginTop_5, styles.alignStart]}>{ i18n.t('more')}</Text>
                        <Card style={[{padding:15} , styles.Radius_10 , styles.marginBottom_15]}>
                            <TouchableOpacity onPress={() => navigation.push('changeLang')} style={[styles.Width_100 , styles.directionRowSpace]}>
                                <Text style={[styles.textRegular , styles.text_gray , styles.textSize_15 ]}>{ i18n.t('language')}</Text>
                                <Image source={require('../../assets/images/left_arrow.png')} style={[styles.footerIcon, styles.transform]} resizeMode={'contain'} />
                            </TouchableOpacity>
                            <View style={[styles.Width_90 , styles.flexCenter , styles.marginVertical_15 , {borderWidth:.5 , borderColor:'#ddd'}]}/>
                            <TouchableOpacity onPress={() => navigation.push('contactUs')} style={[styles.Width_100 , styles.directionRowSpace]}>
                                <Text style={[styles.textRegular , styles.text_gray , styles.textSize_15 ]}>{ i18n.t('contactUs')}</Text>
                                <Image source={require('../../assets/images/left_arrow.png')} style={[styles.footerIcon, styles.transform]} resizeMode={'contain'} />
                            </TouchableOpacity>
                            <View style={[styles.Width_90 , styles.flexCenter , styles.marginVertical_15 , {borderWidth:.5 , borderColor:'#ddd'}]}/>
                            <TouchableOpacity onPress={() => onShare()} style={[styles.Width_100 , styles.directionRowSpace]}>
                                <Text style={[styles.textRegular , styles.text_gray , styles.textSize_15 ]}>{ i18n.t('share')}</Text>
                                <Image source={require('../../assets/images/left_arrow.png')} style={[styles.footerIcon, styles.transform]} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </Card>

                    </View>

                </View>
            </ScrollView>
        </Container>
    );
}

export default Settings;
