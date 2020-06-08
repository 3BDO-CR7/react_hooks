import React, { useState , useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Linking, ActivityIndicator
} from "react-native";
import {Container, Content, Card, Textarea, Label} from 'native-base'
import styles from '../../assets/styles'
import i18n from "../../locale/i18n";
import COLORS from "../consts/colors";
import Communications from 'react-native-communications';
import  Modal  from "react-native-modal";
import {useSelector, useDispatch} from 'react-redux';
import {getContactUs, sendComplaint} from '../actions';

function ContactUs({navigation}) {

    const [showModal, setShowModal] = useState(false);
    const [complaint, setComplaint] = useState('');
    const token = useSelector(state => state.auth.user.data.token);
    const dispatch = useDispatch()
    function toggleModal () {
        setShowModal(!showModal);
    };

    function sendComp () {
        setShowModal(!showModal);
        dispatch(sendComplaint(lang , complaint , token))
        setComplaint('')
    };

    const lang = useSelector(state => state.lang.lang);
    const contactUs = useSelector(state => state.contactUs.contactUs)
    const loader = useSelector(state => state.contactUs.loader)


    function fetchData(){
        dispatch(getContactUs(lang))
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

    return (
        <Container>
            {renderLoader()}
            <Content contentContainerStyle={[styles.bgFullWidth]}>
                {
                    contactUs?
                        <View style={[styles.position_R , styles.bgFullWidth, styles.Width_100]}>
                            <View style={[styles.Width_100 , styles.paddingHorizontal_20 , styles.marginTop_55]}>
                                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.marginBottom_25, styles.transform , styles.alignStart]}>
                                    <Image source={require('../../assets/images/back.png')} style={[styles.smImage]} resizeMode={'contain'} />
                                </TouchableOpacity>

                                <Text style={[styles.textBold , styles.text_black , styles.textSize_18 , styles.marginBottom_15, styles.alignStart]}>{ i18n.t('contactUs')}</Text>

                                <Text style={[styles.textBold , styles.text_black , styles.textSize_15 , styles.marginBottom_10, styles.alignStart]}>{ i18n.t('communications')}</Text>

                                {
                                    contactUs.contacts?
                                        <Card style={[{padding:15} , styles.Radius_10 , styles.marginBottom_15]}>
                                            <TouchableOpacity onPress={() => Communications.phonecall(contactUs.contacts.phone, true)} style={[styles.Width_100 , styles.directionRow]}>
                                                <Image source={require('../../assets/images/phone_call.png')} style={[styles.footerIcon , {marginRight:15}]} resizeMode={'contain'} />
                                                <Text style={[styles.textRegular , styles.text_gray , styles.textSize_15 ]}>{contactUs.contacts.phone}</Text>
                                            </TouchableOpacity>
                                            <View style={[styles.Width_90 , styles.flexCenter , styles.marginVertical_15 , {borderWidth:.5 , borderColor:'#ddd'}]}/>
                                            <TouchableOpacity onPress={() => Communications.email([contactUs.contacts.email],null,null,'My Subject','My body text')} style={[styles.Width_100 , styles.directionRow]}>
                                                <Image source={require('../../assets/images/email_contact.png')} style={[styles.footerIcon , {marginRight:15}]} resizeMode={'contain'} />
                                                <Text style={[styles.textRegular , styles.text_gray , styles.textSize_15 ]}>{contactUs.contacts.email}</Text>
                                            </TouchableOpacity>
                                            <View style={[styles.Width_90 , styles.flexCenter , styles.marginVertical_15 , {borderWidth:.5 , borderColor:'#ddd'}]}/>
                                            <TouchableOpacity onPress={() => Linking.openURL('https://api.whatsapp.com/send?phone='+contactUs.contacts.wahtsapp)} style={[styles.Width_100 , styles.directionRow]}>
                                                <Image source={require('../../assets/images/whatsapp_contact.png')} style={[styles.footerIcon , {marginRight:15}]} resizeMode={'contain'} />
                                                <Text style={[styles.textRegular , styles.text_gray , styles.textSize_15 ]}>{contactUs.contacts.wahtsapp}</Text>
                                            </TouchableOpacity>
                                        </Card>
                                        :
                                        null
                                }



                                <Text style={[styles.textBold , styles.text_black , styles.textSize_15 , styles.marginBottom_10, styles.alignStart]}>{ i18n.t('socialMedia2')}</Text>
                                <Card style={[{padding:15} , styles.Radius_10 , styles.marginBottom_15]}>

                                    {
                                        contactUs.socials ?
                                            contactUs.socials.map((soc, i) => {
                                                    console.log(i , contactUs.socials.length)
                                                    return (
                                                        <View key={i}>
                                                            <TouchableOpacity onPress={() => Linking.openURL(soc.url)}
                                                                              style={[styles.Width_100, styles.directionRow]}>
                                                                <Image source={{uri:soc.icon}}
                                                                       style={[styles.footerIcon, {marginRight: 15}]}
                                                                       resizeMode={'contain'}/>
                                                                <Text
                                                                    style={[styles.textRegular, styles.text_gray, styles.textSize_15]}>{soc.name}</Text>
                                                            </TouchableOpacity>
                                                            {
                                                                i === contactUs.socials.length - 1 ?
                                                                    null :
                                                                    <View
                                                                        style={[styles.Width_90, styles.flexCenter, styles.marginVertical_15, {
                                                                            borderWidth: .5,
                                                                            borderColor: '#ddd'
                                                                        }]}/>
                                                            }

                                                        </View>
                                                    )
                                                }
                                            )
                                            :
                                            null
                                    }
                                </Card>

                                <TouchableOpacity  onPress={toggleModal}>
                                    <Text style={[styles.textBold , styles.text_black, styles.textDecoration , styles.textSize_16 , styles.marginTop_55 , {alignSelf:'center'} ]}>{ i18n.t('complaint')}</Text>
                                </TouchableOpacity>

                            </View>
                            <Modal
                                onBackdropPress                 ={toggleModal}
                                onBackButtonPress               = {toggleModal}
                                isVisible                       = {showModal}
                                style                           = {styles.bgModel}
                                avoidKeyboard                    = {true}
                            >

                                <View style={[{borderTopLeftRadius:30,
                                    borderTopRightRadius:30},styles.bg_White, styles.overHidden, styles.Width_100, styles.paddingVertical_10 , styles.paddingHorizontal_10]}>
                                    <View style={[styles.overHidden , styles.flexCenter , styles.Width_100]}>

                                        <View style={[styles.modalBorder]}/>

                                        <Label style={[styles.label ,{ color:COLORS.blue ,top:8}]}>{ i18n.t('complaint') }</Label>
                                        <Textarea
                                            style={[styles.input, styles.height_120,styles.Active , styles.Width_95 , styles.paddingVertical_20, styles.text_black]}
                                            onChangeText={(complaint) => setComplaint(complaint)}
                                            value={complaint}
                                        />

                                        <TouchableOpacity onPress={() => sendComp()} style={[styles.blueBtn , styles.Width_95, styles.marginBottom_35]}>
                                            <Text style={[styles.textRegular , styles.text_White , styles.textSize_16]}>{ i18n.t('send') }</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </Modal>
                        </View>
                        :
                        null
                }

            </Content>
        </Container>
    );
}

export default ContactUs;
