import React, { Component } from "react";
import { AsyncStorage } from 'react-native';
import {connect} from "react-redux";
import {chooseLang , logout, tempAuth} from "../actions";

class InitScreen extends Component {
    constructor(props) {
        super(props);
    }

    async componentWillMount() {
        console.log('auth..', this.props.auth , 'user profile ..', this.props.user);

        AsyncStorage.getItem('intro').then(intro => {
            if (this.props.lang == null){
                // alert(this.props.lang)
                this.props.navigation.navigate('language')
            }
            else if (intro == null){
                // alert(this.props.lang)
                this.props.navigation.navigate('intro')
            }
            else if (this.props.user == null || this.props.auth == null)
                this.props.navigation.navigate('login');
            // else
            //     this.props.navigation.navigate('home')

            this.logout()
        })
    }

    logout(){
        this.props.logout(this.props.user.token);
        this.props.tempAuth();
    }

    render() {
        return false;
    }
}

const mapStateToProps = ({ auth, profile, lang }) => {
    return {
        auth: auth.user,
        user: profile.user,
        lang: lang.lang
    };
};

export default connect(mapStateToProps, {chooseLang, logout, tempAuth})(InitScreen);
