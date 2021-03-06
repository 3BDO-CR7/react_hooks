import React, { useState , useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList, ActivityIndicator
} from "react-native";
import {Container, Content,Input, Item, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import {useDispatch, useSelector} from "react-redux";
import {getServices} from "../actions";
import Product from './Product';
import axios from "axios";
import CONST from "../consts";

function Category({navigation , route}) {


    const catId = route.params.category_id;
    const catName = route.params.cat_name;
    const [search, setSearch] = useState('');
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user ? state.auth.user.data.token : null);

    const services = useSelector(state => state.services.services);
    const servicesLoader = useSelector(state => state.services.loader);

    const [screenLoader , setScreenLoader ] = useState(true);

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
        setScreenLoader(true)
        dispatch(getServices(lang , catId , token))
    }

    useEffect(() => {
        fetchData();
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData();
        });

        return unsubscribe;
    }, [navigation]);


    useEffect(() => {
        setScreenLoader(false)
    }, [services]);


    function renderLoader(){
        if (screenLoader){
            return(
                <View style={[styles.loading, styles.flexCenter, {height:'100%' , backgroundColor:'#fff'}]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }
    function renderNoData() {
        if (services && (services).length <= 0) {
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
            <Content contentContainerStyle={[styles.bgFullWidth ]}>

                <View style={[styles.position_R , styles.bgFullWidth,
                    styles.marginVertical_25 , styles.marginTop_55, styles.Width_100]}>

                    <View style={[styles.Width_100 , styles.paddingHorizontal_20]}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.marginBottom_25, styles.transform , styles.alignStart]}>
                            <Image source={require('../../assets/images/back.png')} style={[styles.smImage]} resizeMode={'contain'} />
                        </TouchableOpacity>

                        <Text style={[styles.textBold , styles.text_black , styles.textSize_18 , styles.marginBottom_5, styles.alignStart]}>{catName}</Text>
                        {/*<Text style={[styles.textRegular , styles.text_gray , styles.textSize_13, styles.alignStart]}>اختر قاعتك المفضلة</Text>*/}

                        <View style={[styles.position_R, styles.height_90, styles.flexCenter , styles.directionRowSpace, styles.marginBottom_5 , styles.Width_100]}>
                            <TouchableOpacity onPress={() => navigation.push('search' , {keyword:search , catId})} style={[styles.searchIcon , styles.directionRow]}>
                                <Image source={require('../../assets/images/ico.png')} style={[styles.smImage]} resizeMode={'contain'} />
                                <Text style={[styles.textBold , styles.text_gray , styles.textSize_18 , styles.marginHorizontal_5 ]}>|</Text>
                            </TouchableOpacity>
                            <Input style={[styles.searchInput , styles.alignStart , styles.Width_80 , styles.bg_light_gray , styles.marginVertical_20]}
                                   placeholder={i18n.translate('search')}
                                   placeholderTextColor={COLORS.gray}
                                   onChangeText={(search) => setSearch(search)}
                                   value={search}
                            />
                            <TouchableOpacity onPress={() => navigation.push('filter', {catId})} style={[styles.filter]}>
                                <Image source={require('../../assets/images/controls.png')} style={[styles.smImage]} resizeMode={'contain'} />
                            </TouchableOpacity>
                        </View>
                        {renderNoData()}
                        <FlatList
                            data={services}
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

                    </View>

                </View>
            </Content>
        </Container>
    );
}

export default Category;


