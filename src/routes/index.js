import React from "react";
import { NavigationContainer  } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackNavigator } from './AuthStackNavigator'
import { MainStackNavigator } from './MainStackNavigator'
import {useSelector} from "react-redux";

const RootStack = createStackNavigator();

function renderScreens() {
	const auth = useSelector(state => state.auth);

	if (auth.user !== null && auth.user.success) {
		return (
			<RootStack.Screen name={'MainStack'} component={MainStackNavigator}/>
		)
	}

	return (<RootStack.Screen name={'AuthStack'} component={AuthStackNavigator}/>)
}

function AppNavigator() {

	return (
		<NavigationContainer>
			<RootStack.Navigator screenOptions={{headerShown: false}} >
				{ renderScreens() }
			</RootStack.Navigator>
		</NavigationContainer>
	);
}

export default AppNavigator;
