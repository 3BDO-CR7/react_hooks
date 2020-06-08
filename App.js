import React from 'react';
import { Text , I18nManager , AsyncStorage, Platform } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AppNavigator from './src/routes';
import { Root } from "native-base";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistedStore } from './src/store';
import './ReactotronConfig';
import { Notifications } from 'expo'

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isReady: false,
		};
	}

	componentWillMount() {
		// I18nManager.forceRTL(true);
		// AsyncStorage.clear()
	}

	async componentDidMount() {
		if (Platform.OS === 'android') {
			Notifications.createChannelAndroidAsync('notify', {
				name: 'Chat messages',
				sound: true,
			});
		}

		await Font.loadAsync({
			sukar             : require('./assets/fonts/Sukar-Regular.ttf'),
			sukarBold         : require('./assets/fonts/Sukar-Bold.ttf'),
			Roboto: require('native-base/Fonts/Roboto.ttf'),
			Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
			...Ionicons.font,
		});

		this.setState({ isReady: true });
	}

	render() {
		if (!this.state.isReady) {
			return <AppLoading />;
		}

		return (
			<Provider store={store}>
				<PersistGate persistor={persistedStore}>
					<Root>
						<AppNavigator />
					</Root>
				</PersistGate>
			</Provider>
		);
	}
}



//
// Keystore password: b413cd718282497bb5129c07196a15cc
// Key alias:         QG1fc2hhbXMvbXNhcmE=
// Key password:      72cf6e28fe8a43d69d74b3b6d7382614
