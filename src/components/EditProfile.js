import React, { useState , useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView,
    ActivityIndicator,
    ScrollView
} from "react-native";
import {Container, Content, Form, Input, Item} from 'native-base'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import {useDispatch, useSelector} from "react-redux";
import {updateProfile} from '../actions';

function EditProfile({navigation}) {

    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user.data.token);
    const user = useSelector(state => state.auth.user.data);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [username, setUsername] = useState(user.name);
    const [phone, setPhone] = useState(user.phone);
    const [email, setEmail] = useState(user.email);
    const [userImage, setUserImage] = useState(null);
    const [base64, setBase64] = useState('');

    const [usernameStatus, setUsernameStatus] = useState(1);
    const [phoneStatus, setPhoneStatus] = useState(1);
    const [emailStatus, setEmailStatus] = useState(1);

    const dispatch = useDispatch();

    useEffect(() => {
        setIsSubmitted(false)
    }, []);

    const askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);

    };

    const _pickImage = async () => {

        askPermissionsAsync();

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64:true
        });

        if (!result.cancelled) {
            setUserImage(result.uri);
            setBase64(result.base64);
        }
    };

    function activeInput(type) {

        if (type === 'username' || username !== '') {
            setUsernameStatus(1)
        }

        if (type === 'phone' || phone !== '') {
            setPhoneStatus(1)
        }

        if (type === 'email' || email !== '') {
            setEmailStatus(1)
        }

    }

    function unActiveInput(type) {

        if (type === 'username' && username === '') {
            setUsernameStatus(0)
        }

        if (type === 'phone' && phone === '') {
            setPhoneStatus(0)
        }

        if (type === 'email' && email === '') {
            setEmailStatus(0)
        }

    }

    function renderEdit(){
        if (username == '' || phone == '' || email == ''){
            return (
                <View style={[styles.blueBtn , styles.Width_95 , {backgroundColor:'#ccc'}]}>
                    <Text style={[styles.textRegular , styles.text_blue , styles.textSize_16]}>{ i18n.t('confirm') }</Text>
                </View>
            );
        }
        if (isSubmitted){
            return(
                <View style={[{ justifyContent: 'center', alignItems: 'center' } , styles.marginTop_25]}>
                    <ActivityIndicator size="large" color={COLORS.blue} style={{ alignSelf: 'center' }} />
                </View>
            )
        }

        return (
            <TouchableOpacity onPress={() => onEdit()} style={[styles.blueBtn , styles.Width_95 , {backgroundColor:'#fff'}]}>
                <Text style={[styles.textRegular , styles.text_blue , styles.textSize_16]}>{ i18n.t('confirm') }</Text>
            </TouchableOpacity>
        );
    }
    function onEdit(){
        setIsSubmitted(true)
        dispatch(updateProfile(lang , username , phone , email , base64 , token , navigation));
    }

    let image = userImage;

    return (
        <Container>
            <ImageBackground source= {image != null?{uri:image} : {uri:user.avatar}} style={[styles.bgFullWidth]}>
                <ScrollView contentContainerStyle={[styles.bgFullWidth]}>
                    <View style={[styles.swiperOverlay , styles.bgFullWidth , {zIndex:-1 , backgroundColor: "rgba(0, 0, 0, 0.5)"}]}/>
                    <View style={[ styles.heightFull   , styles.directionColumnSpace]}>

                        <View style={[styles.Width_100 , styles.paddingHorizontal_25 , styles.marginTop_55]}>
                            <View style={[styles.directionRowSpace , styles.Width_100]}>
                                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.marginBottom_25 , styles.transform]}>
                                    <Image source={require('../../assets/images/white_back.png')} style={[styles.smImage]} resizeMode={'contain'} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={_pickImage} style={[styles.marginBottom_25]}>
                                    <Image source={require('../../assets/images/add.png')} style={[styles.smImage]} resizeMode={'contain'} />
                                </TouchableOpacity>
                            </View>

                            <Text style={[styles.textBold , styles.text_White , styles.textSize_18 , styles.marginBottom_5, styles.alignStart]}>{ i18n.t('editData') }</Text>

                        </View>


                        <View style={[styles.Width_100 , styles.bottomLayCurve]}>

                            <KeyboardAvoidingView behavior={'padding'} style={[styles.keyboardAvoid]}>
                                <Form style={[styles.flexCenter, styles.marginVertical_10, styles.Width_100]}>
                                    <View style={[styles.position_R, styles.height_70, styles.flexCenter, styles.marginBottom_5 ]}>
                                        <Item floatingLabel style={[styles.item, styles.position_R, { right: 5 }]}>
                                            <Input style={[styles.input, styles.height_50 , usernameStatus === 1 ? styles.text_White : styles.text_gray, {borderColor : usernameStatus === 1 ? '#fff' : COLORS.gray}]}
                                                   onChangeText={(username) => setUsername(username)}
                                                   onBlur={() => unActiveInput('username')}
                                                   onFocus={() => activeInput('username')}
                                                   value={username}
                                                   placeholder={ i18n.t('username') }
                                                   placeholderTextColor="#fff"
                                            />
                                        </Item>
                                    </View>

                                    <View style={[styles.position_R, styles.height_70, styles.flexCenter, styles.marginBottom_5 ]}>
                                        <Item floatingLabel style={[styles.item, styles.position_R, { right: 5 }]}>
                                            <Input style={[styles.input, styles.height_50, phoneStatus === 1 ? styles.text_White : styles.text_gray, {borderColor : phoneStatus === 1 ? '#fff' : COLORS.gray}]}
                                                   onChangeText={(phone) => setPhone(phone)}
                                                   onBlur={() => unActiveInput('phone')}
                                                   onFocus={() => activeInput('phone')}
                                                   keyboardType={'number-pad'}
                                                   value={phone}
                                                   placeholder={ i18n.t('phone') }
                                                   placeholderTextColor="#fff"
                                            />
                                        </Item>
                                    </View>

                                    <View style={[styles.position_R, styles.height_70, styles.flexCenter, styles.marginBottom_5 ]}>
                                        <Item floatingLabel style={[styles.item, styles.position_R, { right: 5 }]}>
                                            <Input style={[styles.input, styles.height_50, emailStatus === 1 ? styles.text_White : styles.text_gray, {borderColor : emailStatus === 1 ? '#fff' : COLORS.gray}]}
                                                   onChangeText={(email) => setEmail(email)}
                                                   onBlur={() => unActiveInput('email')}
                                                   onFocus={() => activeInput('email')}
                                                   keyboardType={'email-address'}
                                                   value={email}
                                                   placeholder={ i18n.t('email') }
                                                   placeholderTextColor="#fff"
                                            />
                                        </Item>
                                    </View>

                                    {renderEdit()}



                                </Form>
                            </KeyboardAvoidingView>

                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        </Container>
    );
}

export default EditProfile;


