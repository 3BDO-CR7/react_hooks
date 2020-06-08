import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, SafeAreaView, FlatList, ScrollView, ActivityIndicator } from "react-native";
import {Container, Item, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import {useDispatch, useSelector} from "react-redux";
import {getFavourite, logout, tempAuth} from "../actions";
import Product from './Product';
import axios from "axios";
import CONST from "../consts";

function Favourite({navigation}) {


    const lang  = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user ? state.auth.user.data.token : null);
    const user  = useSelector(state => state.auth.user ? state.auth.user.data : { avatar: ''});

    const favourite = useSelector(state => state.favourite.favourite);
    const favouriteLoader = useSelector(state => state.favourite.loader);


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
        dispatch(getFavourite(lang, token))
    }

    useEffect(() => {
        fetchData();
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData();
        });

        return unsubscribe;
    }, [navigation , favouriteLoader]);


    function logoutFunc(){
        dispatch(logout(lang , token));
        dispatch(tempAuth(token));
    }

    function renderLoader(){
        if (favouriteLoader === false){
            return(
                <View style={[styles.loading, styles.flexCenter, {height:'100%'}]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }
    function renderNoData() {
        if (favourite && (favourite).length <= 0) {
            return (
                <View style={[styles.directionColumnCenter , styles.Width_100, styles.marginTop_25]}>
                    <Image source={require('../../assets/images/no_data.png')} resizeMode={'contain'}
                           style={{alignSelf: 'center', width: 200, height: 200}}/>
                </View>
            );
        }

        return null
    }

    function Item({ name , image , discount , rate , price , id , isLiked }) {

        return (
            <Product data={{name , image , discount , rate , price , id , isLiked}} isFav={isLiked}
                     onToggleFavorite={() => toggleFavorite(id)}
                     navigation={navigation}/>
        );
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
                            <View>
                                <Image source={require('../../assets/images/menu_like_blue.png')} style={[styles.iconImg]} resizeMode={'contain'} />
                            </View>
                            <TouchableOpacity onPress={() => navigation.push('about')}>
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
                    <View style={[styles.Width_100 , styles.paddingHorizontal_20 , styles.marginTop_25]}>
                        <Text style={[styles.textBold , styles.text_black , styles.textSize_18 , styles.marginBottom_5,styles.alignStart]}>{ i18n.t('favourite')}</Text>
                        <Text style={[styles.textRegular , styles.text_gray , styles.textSize_13 , styles.marginBottom_20,styles.alignStart]}>{ i18n.t('favouriteText')}</Text>
                        {renderNoData()}
                        <SafeAreaView>
                            <FlatList
                                data={favourite}
                                renderItem={({ item , index}) => <Item
                                    name={item.name}
                                    image={item.image}
                                    discount={item.discount}
                                    rate={item.rate}
                                    price={item.price}
                                    id={item.id}
                                    isLiked={item.isLiked}
                                />}
                                keyExtractor={item => item.id}
                                numColumns={2}
                                horizontal={false}
                                columnWrapperStyle={[styles.directionRowCenter]}
                                // extraData={isFav}
                            />
                        </SafeAreaView>

                    </View>

                </View>
            </ScrollView>
        </Container>
    );
}

export default Favourite;
