import React , {useState} from "react";import {View, Text, TouchableOpacity, Image} from 'react-native';import COLORS from "../consts/colors";import { MaterialCommunityIcons } from 'react-native-vector-icons';import { createStackNavigator } from '@react-navigation/stack';import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';import styles from '../../assets/styles'import Home                     from "../components/Home";import Profile 					from "../components/Profile";import Notifications 			from "../components/Notifications";import Orders 					from "../components/Orders";import NotificationsItems 		from "../components/NotificationsItems";import Rate 					from "../components/Rate";import ConfirmEvaluation 		from "../components/ConfirmEvaluation";import Details 					from "../components/Details";import MoreDetails 				from "../components/MoreDetails";import HallLocation 			from "../components/HallLocation";import Reservation 				from "../components/Reservation";import Services 				from "../components/Services";import Category 				from "../components/Category";import Payment 					from "../components/Payment";import Offers 					from "../components/Offers";import TopRated 				from "../components/TopRated";import Search 					from "../components/Search";import Favourite 				from "../components/Favourite";import About 					from "../components/About";import Settings 				from "../components/Settings";import ChangePass 				from "../components/ChangePass";import ChangeLang 				from "../components/ChangeLang";import ContactUs 				from "../components/ContactUs";import EditProfile 				from "../components/EditProfile";import OrderDetails 			from "../components/OrderDetails";import ConfirmCancellation 		from "../components/ConfirmCancellation";import Filter 					from "../components/Filter";import { AuthStackNavigator } from './AuthStackNavigator'import {useSelector} from "react-redux";import Login from "../components/Login";const MainStack  = createStackNavigator();const HomeStack  = createStackNavigator();const Tabs   	 = createBottomTabNavigator();const HomeStackScreen = () => (	<HomeStack.Navigator>		<HomeStack.Screen options={{headerShown:false}} name="home" component={Home} />	</HomeStack.Navigator>);function TabsScreen() {	const auth = useSelector(state => state.auth);	let image  = null;	if(auth.user) image = {uri:auth.user ? auth.user.data.avatar : ''};	else  image = require('../../assets/images/user.png');	console.log('auth.user', auth.user);	return (		<Tabs.Navigator			initialRouteName="home"			tabBarOptions={{				activeTintColor: COLORS.blue,				showLabel:false,				style: styles.footerStyle			}}		>			<Tabs.Screen				name="home"				component={HomeStackScreen}				options={{					tabBarLabel: 'Home',					tabBarIcon: ({ color, size }) => (						<Image source={color === COLORS.blue ? require('../../assets/images/home_icon.png') : require('../../assets/images/home_gray-1.png')} style={[styles.footerIcon]} resizeMode={'contain'} />					),				}}			/>			{				auth.user ?					<Tabs.Screen						name="orders"						component={Orders}						options={{							tabBarLabel: 'Orders',							tabBarIcon: ({ color, size }) => (								<Image source={color === COLORS.blue ? require('../../assets/images/calender_blue.png') : require('../../assets/images/calender_gray.png')} style={[styles.footerIcon]} resizeMode={'contain'} />							),						}}					/> : null			}			{				auth.user ?					<Tabs.Screen						name="notifications"						component={Notifications}						options={{							tabBarLabel: 'Notifications',							tabBarVisible: false,							tabBarIcon: ({ color, size }) => (								<Image source={color === COLORS.blue ? require('../../assets/images/bell_blue.png') : require('../../assets/images/bell_icon.png')} style={[styles.footerIcon]} resizeMode={'contain'} />							),						}}					/> : null			}			<Tabs.Screen				name={auth.user ? 'profile' : 'login'}				component={auth.user ? Profile : Login}				options={{					tabBarLabel: 'Profile',					tabBarVisible: false,					tabBarIcon: ({ color, size }) => (						<View  style={[styles.footerIconProfile , {borderRadius:50 , overflow:'hidden', borderColor:COLORS.blue, borderWidth:2}]}>							<Image source={image} style={[styles.Width_100 , styles.heightFull]} resizeMode={'cover'} />						</View>					),				}}			/>		</Tabs.Navigator>	);}export function MainStackNavigator()  {	return(		<MainStack.Navigator mode={'card'} screenOptions={{headerShown: false}}>			<MainStack.Screen name='home' options={{headerShown:false}} component={TabsScreen}/>			<MainStack.Screen name="notificationsItems" component={NotificationsItems} />			<MainStack.Screen name="rate" component={Rate} />			<MainStack.Screen name="confirmEvaluation" component={ConfirmEvaluation} />			<MainStack.Screen name="details" component={Details} />			<MainStack.Screen name="moreDetails" component={MoreDetails} />			<MainStack.Screen name="hallLocation" component={HallLocation} />			<MainStack.Screen name="reservation" component={Reservation} />			<MainStack.Screen name="services" component={Services} />			<MainStack.Screen name="category" component={Category} />			<MainStack.Screen name="payment" component={Payment} />			<MainStack.Screen name="offers" component={Offers} />			<MainStack.Screen name="topRated" component={TopRated} />			<MainStack.Screen name="search" component={Search} />			<MainStack.Screen name="favourite" component={Favourite} />			<MainStack.Screen name="about" component={About} />			<MainStack.Screen name="settings" component={Settings} />			<MainStack.Screen name="changePass" component={ChangePass} />			<MainStack.Screen name="changeLang" component={ChangeLang} />			<MainStack.Screen name="contactUs" component={ContactUs} />			<MainStack.Screen name="editProfile" component={EditProfile} />			<MainStack.Screen name="orderDetails" component={OrderDetails} />			<MainStack.Screen name="confirmCancellation" component={ConfirmCancellation} />			<MainStack.Screen name="filter" component={Filter} />		</MainStack.Navigator>	);}