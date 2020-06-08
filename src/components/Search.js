import React, { useState , useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList, ScrollView, ActivityIndicator
} from "react-native";
import {Container, Content, Input, Item, Icon, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import StarRating from "react-native-star-rating";
import {useDispatch, useSelector} from "react-redux";
import {getSearch} from "../actions";
import Product from './Product';
import axios from "axios";
import CONST from "../consts";

function Search({navigation , route}) {

    const keyword    = route.params.keyword;
    const catId      = route.params.catId;
    const rate       = route.params.rate;
    const date       = route.params.date;
    const city_id    = route.params.city_id;
    const min_price  = route.params.min_price;
    const max_price  = route.params.max_price;
    const is_offered = route.params.is_offered;
    const capacity   = route.params.capacity;

    const [isHide, setIsHide] = useState(true);
    const [search, setSearch] = useState(keyword);
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user.data.token);

    const searchResult = useSelector(state => state.search.search);
    const searchLoader = useSelector(state => state.search.loader);

    const [screenLoader , setScreenLoader ] = useState(true);

    const [isFav , setFav ] = useState(false);

    function resetSearch (){
        setSearch('')
    }
    function hideSuggetions (){
        setIsHide(true)
    }
    const dispatch = useDispatch();

    function toggleFavorite (id){
        // dispatch(setFavourite(lang , id , token));
        axios({
            url         : CONST.url + 'fav',
            method      : 'POST',
            headers     : { Authorization: token },
            data        : {lang ,service_id :id }
        }).then(response => {

            fetchData()

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
        dispatch(getSearch(lang ,
            keyword? keyword : null ,
            rate ? rate :null ,
            catId? catId: null ,
            date ? date : null ,
            city_id ? city_id :null ,
            min_price ? min_price :null,
            max_price ? max_price :null ,
            is_offered ? is_offered :null ,
            capacity ? capacity :null ,
            token))
    }

    useEffect(() => {
        fetchData();
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData();
        });

        return unsubscribe;
    }, [navigation]);


    function onSearch() {
        dispatch(getSearch(lang , search , null , null ,null , null , null
            ,null , null , null , token))
    }

    useEffect(() => {
        setScreenLoader(false)
    }, [searchResult]);

    function renderLoader(){
        if (screenLoader){
            return(
                <View style={[styles.loading, styles.flexCenter, {height:'100%' , backgroundColor:'#fff'}]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }

    function Item({ name , image , discount , rate , price , id , isLiked }) {

        return (
            <Product data={{name , image , discount , rate , price , id , isLiked}} isFav={isLiked}
                     onToggleFavorite={() => toggleFavorite(id)}
                     navigation={navigation}/>
        );
    }

    function renderNoData() {
        if (searchResult && (searchResult).length <= 0) {
            return (
                <View style={[styles.directionColumnCenter , styles.Width_100, styles.marginTop_25]}>
                    <Image source={require('../../assets/images/no_data.png')} resizeMode={'contain'}
                           style={{alignSelf: 'center', width: 200, height: 200}}/>
                </View>
            );
        }

        return null
    }

    return (
        <Container>
            {renderLoader()}
            <Content contentContainerStyle={[styles.bgFullWidth , styles.paddingTop_50]}>

                <View style={[styles.position_R , styles.bgFullWidth,
                    styles.marginVertical_25, styles.Width_100]}>

                    <View style={[styles.Width_100 , styles.paddingHorizontal_20]}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.marginBottom_25, styles.transform , styles.alignStart]}>
                            <Image source={require('../../assets/images/back.png')} style={[styles.smImage]} resizeMode={'contain'} />
                        </TouchableOpacity>


                        <View style={[styles.position_R, styles.height_90, styles.flexCenter , styles.directionRowSpace, styles.marginBottom_5 , styles.Width_100]}>
                            <TouchableOpacity onPress={() => resetSearch()} style={[styles.closeIcon]}>
                                <Image source={require('../../assets/images/cancel_black.png')} style={[styles.smImage]} resizeMode={'contain'} />
                            </TouchableOpacity>
                            <Input style={[styles.searchInput , styles.alignStart , styles.bg_light_gray , styles.marginVertical_20 , {paddingLeft:20}]}
                                   placeholder={i18n.translate('search')}
                                   placeholderTextColor={COLORS.gray}
                                   onChangeText={(search) => setSearch(search)}
                                   onSubmitEditing = {() => onSearch()}
                                   value={search}
                            />
                        </View>

                        {
                            !isHide ?
                                <View style={[styles.marginBottom_50 , styles.Width_100]}>
                                    <View style={[styles.directionRowSpace , styles.Width_100 , styles.marginBottom_10]}>
                                        <Text style={[styles.textRegular , styles.text_gray,  styles.textSize_14]}>{ i18n.t('suggestions')}</Text>
                                        <TouchableOpacity onPress={() => hideSuggetions()} style={{}}>
                                            <Image source={require('../../assets/images/cancle_gray.png')} style={[styles.smImage]} resizeMode={'contain'} />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView style={[styles.scrollView ]} horizontal={true} showsHorizontalScrollIndicator={false}>

                                        <View style={[styles.directionColumnCenter , styles.marginHorizontal_10]}>
                                            <Image source={require('../../assets/images/pic_hall.png')} style={[styles.scrollRatedImg]} resizeMode={'cover'} />
                                            <View style={[ styles.Width_100,styles.scrollContent]}>
                                                <TouchableOpacity onPress = {() => toggleFavorite(1)} style={[styles.touchFav , styles.directionRowCenter]}>
                                                    <Icon style={[isFav ? styles.text_red : styles.text_gray, styles.textSize_18]} type="AntDesign" name={ 'heart' } />
                                                </TouchableOpacity>
                                                <View style={[styles.overlay_white , styles.carousalRatedText]}>
                                                    <View style={[styles.directionRowSpace , styles.marginBottom_5]}>
                                                        <Text style={[styles.textRegular , styles.text_black , styles.textSize_14 , styles.marginHorizontal_5 ]}>
                                                            قاعه القصر</Text>
                                                        <Text style={[styles.textRegular , styles.text_black , styles.textSize_14 , styles.marginHorizontal_5 ]}>
                                                            500 { i18n.t('RS')}</Text>
                                                    </View>
                                                    <View style={[styles.width_80 , styles.paddingHorizontal_5]}>
                                                        <StarRating
                                                            disabled={true}
                                                            maxStars={5}
                                                            rating={3}
                                                            fullStarColor={COLORS.blue}
                                                            starSize={14}
                                                            starStyle={styles.starStyle}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={[styles.directionColumnCenter , styles.marginHorizontal_10]}>
                                            <Image source={require('../../assets/images/women_pic.png')} style={[styles.scrollRatedImg]} resizeMode={'cover'} />
                                            <View style={[ styles.Width_100,styles.scrollContent]}>
                                                <TouchableOpacity onPress = {() => toggleFavorite(2)} style={[styles.touchFav , styles.directionRowCenter]}>
                                                    <Icon style={[isFav ? styles.text_red : styles.text_gray, styles.textSize_18]} type="AntDesign" name={ 'heart' } />
                                                </TouchableOpacity>
                                                <View style={[styles.overlay_white , styles.carousalRatedText]}>
                                                    <View style={[styles.directionRowSpace , styles.marginBottom_5]}>
                                                        <Text style={[styles.textRegular , styles.text_black , styles.textSize_14 , styles.marginHorizontal_5 ]}>
                                                            قاعه القصر</Text>
                                                        <Text style={[styles.textRegular , styles.text_black , styles.textSize_14 , styles.marginHorizontal_5 ]}>
                                                            500 { i18n.t('RS')}</Text>
                                                    </View>
                                                    <View style={[styles.width_80]}>
                                                        <StarRating
                                                            disabled={true}
                                                            maxStars={5}
                                                            rating={3}
                                                            fullStarColor={COLORS.blue}
                                                            starSize={14}
                                                            starStyle={styles.starStyle}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={[styles.directionColumnCenter , styles.marginHorizontal_10]}>
                                            <Image source={require('../../assets/images/pic_hall.png')} style={[styles.scrollRatedImg]} resizeMode={'cover'} />
                                            <View style={[ styles.Width_100,styles.scrollContent]}>
                                                <TouchableOpacity onPress = {() => toggleFavorite(3)} style={[styles.touchFav , styles.directionRowCenter]}>
                                                    <Icon style={[isFav ? styles.text_red : styles.text_gray, styles.textSize_18]} type="AntDesign" name={ 'heart' } />
                                                </TouchableOpacity>
                                                <View style={[styles.overlay_white , styles.carousalRatedText]}>
                                                    <View style={[styles.directionRowSpace , styles.marginBottom_5]}>
                                                        <Text style={[styles.textRegular , styles.text_black , styles.textSize_14 , styles.marginHorizontal_5 ]}>
                                                            قاعه القصر</Text>
                                                        <Text style={[styles.textRegular , styles.text_black , styles.textSize_14 , styles.marginHorizontal_5 ]}>
                                                            500 { i18n.t('RS')}</Text>
                                                    </View>
                                                    <View style={[styles.width_80]}>
                                                        <StarRating
                                                            disabled={true}
                                                            maxStars={5}
                                                            rating={3}
                                                            fullStarColor={COLORS.blue}
                                                            starSize={14}
                                                            starStyle={styles.starStyle}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                    </ScrollView>
                                </View>:
                                null
                        }
                        {renderNoData()}
                        <FlatList
                            data={searchResult}
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

export default Search;


