import React, { useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ImageBackground,
    ScrollView
} from "react-native";
import {Container, Content } from 'native-base'
import styles from '../../assets/styles'
import COLORS from "../consts/colors";
import {useDispatch, useSelector} from "react-redux";
import {logout, tempAuth, profile} from '../actions';

function Profile({navigation}) {

    const lang  = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user ? state.auth.user.data.token : null);

    const user      = useSelector(state => state.auth.user ? state.auth.user.data : { avatar: '', name: null, email: null, phone: null });
    const dispatch  = useDispatch();

    function logoutFunc(){
        dispatch(logout(lang , token));
        dispatch(tempAuth(token));
    }

    function fetchData(){
        // if (token)
        //     dispatch(profile(token));
    }

    useEffect(() => {
        fetchData();
        const unsubscribe = navigation.addListener('focus', e => {
            fetchData();
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <Container>
            <ImageBackground source={{uri:user.avatar}} style={[styles.bgFullWidth]}>
                <View contentContainerStyle={[styles.bgFullWidth]}>
                    <View style={[styles.swiperOverlay , styles.bgFullWidth , {zIndex:-1}]}/>
                    <View style={[ styles.heightFull , styles.directionColumnSpace]}>
                        <View style={[styles.Width_100 , styles.topNav]}>
                            <ScrollView style={{}} contentContainerStyle={[styles.directionRowSpace , styles.Width_100 , styles.paddingHorizontal_15 , {
                                paddingTop:15
                            }]} horizontal={true} showsHorizontalScrollIndicator={false}>
                                <TouchableOpacity onPress={() =>
                                    navigation.navigate('home', { screen: 'home',
                                        // params: { user: 'jane' },
                                    })
                                }>
                                    <Image source={require('../../assets/images/menu_home.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                                </TouchableOpacity>
                                <View  style={[styles.iconImg , {borderRadius:50 , overflow:'hidden', borderColor:COLORS.blue, borderWidth:2}]}>
                                    <Image source={{uri:user.avatar}} style={[styles.Width_100 , styles.heightFull]} resizeMode={'cover'} />
                                </View>
                                <TouchableOpacity onPress={() => navigation.push('favourite')}>
                                    <Image source={require('../../assets/images/menu_like.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('about')}>
                                    <Image source={require('../../assets/images/menu_about.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.push('settings')}>
                                    <Image source={require('../../assets/images/setting.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => logoutFunc()} style={[styles.transformReverse]}>
                                    <Image source={require('../../assets/images/menu_logout.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                                </TouchableOpacity>
                            </ScrollView>
                        </View>


                        <View style={[styles.Width_100 , styles.bottomLayCurve]}>
                            <View style={[styles.Width_100 , styles.directionRowSpace]}>
                                <Text style={[styles.textRegular , styles.text_White , styles.textSize_18 , styles.marginBottom_5]}>
                                    {user.name}
                                </Text>
                                <TouchableOpacity onPress={() => navigation.push('editProfile')}>
                                    <Image source={require('../../assets/images/edit_profile.png')} style={[styles.footerIconProfile]} resizeMode={'contain'} />
                                </TouchableOpacity>
                            </View>

                            <Text style={[styles.textRegular , styles.text_White , styles.textSize_18 , styles.marginBottom_5, styles.alignStart]}>
                                {user.phone}
                            </Text>

                            <Text style={[styles.textRegular , styles.text_blue , styles.textSize_18 , styles.alignStart ]}>
                                {user.email}
                            </Text>

                        </View>
                    </View>
                </View>
            </ImageBackground>
        </Container>
    );
}

export default Profile;


