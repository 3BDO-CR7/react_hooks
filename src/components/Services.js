import React, { useState , useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList, ActivityIndicator
} from "react-native";
import {Container, Content, Input, Item,} from 'native-base'
import {useSelector, useDispatch} from 'react-redux';
import {getCategories} from '../actions';
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";

function Services({navigation}) {


    const [search, setSearch] = useState('');
    const lang = useSelector(state => state.lang.lang);
    const services = useSelector(state => state.categories.categories)
    const loader = useSelector(state => state.categories.loader)

    const dispatch = useDispatch();

    function fetchData(){
        dispatch(getCategories(lang , true))
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

    function Item({ name , image , id }) {

        return (
            <TouchableOpacity onPress={() => navigation.push('category', {category_id:id , cat_name:name})} style={[styles.directionColumnCenter
                , styles.marginBottom_20 , styles.marginHorizontal_5]}>
                <Image source={{uri:image}} style={[styles.flatImg]} resizeMode={'cover'} />
                <Text style={[styles.textRegular , styles.text_black, styles.textSize_16 , styles.marginHorizontal_5 ]}>{name}</Text>
            </TouchableOpacity>
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

                        <Text style={[styles.textBold , styles.text_black , styles.textSize_18 , styles.marginBottom_5 , styles.alignStart]}>{ i18n.t('categories') }</Text>
                        <Text style={[styles.textRegular , styles.text_gray , styles.textSize_13 , styles.alignStart]}>{ i18n.t('chooseService') }</Text>

                        <View style={[styles.position_R, styles.height_90, styles.flexCenter, styles.marginBottom_5 , styles.Width_100]}>
                            <TouchableOpacity onPress={() => navigation.push('search' , {keyword:search})} style={[styles.searchIcon , styles.directionRow]}>
                                <Image source={require('../../assets/images/ico.png')} style={[styles.smImage]} resizeMode={'contain'} />
                                <Text style={[styles.textBold , styles.text_gray , styles.textSize_18 , styles.marginHorizontal_5 ]}>|</Text>
                            </TouchableOpacity>
                            <Input style={[styles.searchInput , styles.bg_light_gray , styles.marginVertical_20]}
                                   placeholder={i18n.translate('search')}
                                   placeholderTextColor={COLORS.gray}
                                   onChangeText={(search) => setSearch(search)}
                                   value={search}
                            />
                        </View>
                        {renderNoData()}
                        <FlatList
                            data={services}
                            renderItem={({ item , index}) => <Item
                                name={item.name}
                                image={item.image}
                                id={item.id}
                            />}
                            keyExtractor={item => item.id}
                            numColumns={3}
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

export default Services;


