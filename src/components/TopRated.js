import React, { useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList, ActivityIndicator
} from "react-native";
import {Container, Content, Item, Toast} from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import {useDispatch, useSelector} from "react-redux";
import {getTopRate} from "../actions";
import Product from './Product';
import axios from "axios";
import CONST from "../consts";

function TopRated({navigation}) {

    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user.data.token);

    const topRate = useSelector(state => state.topRate.topRate);
    const topRateLoader = useSelector(state => state.topRate.loader);

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
        dispatch(getTopRate(lang , false , token))
    }

    useEffect(() => {
        fetchData();
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData();
        });

        return unsubscribe;
    }, [navigation , topRateLoader]);

    function renderLoader(){
        if (topRateLoader === false){
            return(
                <View style={[styles.loading, styles.flexCenter, {height:'100%'}]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            );
        }
    }
    function renderNoData() {
        if (topRate && (topRate).length <= 0) {
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
                     navigation={navigation} />
        );
    }
    return (
        <Container>
            {renderLoader()}
            <Content contentContainerStyle={[styles.bgFullWidth , styles.paddingTop_50]}>

                <View style={[styles.position_R , styles.bgFullWidth,
                    styles.marginVertical_25, styles.Width_100]}>

                    <View style={[styles.Width_100 , styles.paddingHorizontal_20]}>
                        <TouchableOpacity onPress={() => navigation.navigate('home')} style={[styles.marginBottom_25, styles.transform , styles.alignStart]}>
                            <Image source={require('../../assets/images/back.png')} style={[styles.smImage]} resizeMode={'contain'} />
                        </TouchableOpacity>

                        <Text style={[styles.textBold , styles.text_black , styles.textSize_18 , styles.marginBottom_20, styles.alignStart]}>{ i18n.t('topRated')}</Text>
                        {/*<Text style={[styles.textRegular , styles.text_gray , styles.textSize_13]}>{ i18n.t('offersText')}</Text>*/}

                        {renderNoData()}
                        <FlatList
                            data={topRate}
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

export default TopRated;


