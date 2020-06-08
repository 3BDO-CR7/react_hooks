import React from "react";
import {View, Text, Image, TouchableOpacity} from "react-native";
import {Icon,} from 'native-base'
import StarRating from "react-native-star-rating";
import styles from '../../assets/styles'
import COLORS from "../consts/colors";
import {useSelector} from "react-redux";

function Product({navigation , data , onToggleFavorite , isFav}) {
    const user = useSelector(state => state.auth.user ? state.auth.user.data :  {name: null});

    return (
        <TouchableOpacity onPress={() => navigation.push('details', {service_id:data.id})} style={[styles.directionColumnCenter , styles.marginHorizontal_10 , styles.marginBottom_20]}>
            <Image source={{uri:data.image}} style={[styles.scrollRatedImg]} resizeMode={'cover'} />
            <View style={[ styles.Width_100,styles.scrollContent]}>

                {
                    data.discount == null ?
                        null :
                        <View style={[styles.discountMark , styles.paddingHorizontal_5 ]}>
                            <Image source={require('../../assets/images/bookmark.png')} style={[styles.mark , {position:'absolute' , top:0 ,right:-1.8}]} resizeMode={'contain'} />
                            <Text style={[styles.textRegular , styles.text_White , styles.textSize_14 , styles.marginTop_5]}>
                                {data.discount}</Text>
                        </View>
                }

                {
                    user.token?
                        <TouchableOpacity onPress = {() => onToggleFavorite()} style={[styles.touchFav , styles.directionRowCenter]}>
                            <Icon style={[isFav ? styles.text_red : styles.text_gray, styles.textSize_18]} type="AntDesign" name={ 'heart' } />
                        </TouchableOpacity>
                        :
                        <View/>
                }

                <View style={[styles.overlay_white , styles.carousalRatedText , {alignSelf:'flex-end'}]}>
                    <View style={[styles.directionRowSpace , styles.marginBottom_5]}>
                        <Text style={[styles.textRegular , styles.text_black , styles.textSize_14 , styles.marginHorizontal_5 ]}>
                            {data.name.substr(0,8)}</Text>
                        <Text style={[styles.textRegular , styles.text_black , styles.textSize_14 , styles.marginHorizontal_5 ]}>
                            {data.price}</Text>
                    </View>
                    <View style={[styles.width_80 , styles.paddingHorizontal_5]}>
                        <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={data.rate}
                            fullStarColor={COLORS.blue}
                            starSize={14}
                            starStyle={styles.starStyle}
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default Product;


