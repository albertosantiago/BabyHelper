import React from 'react';
import {Text, View, ScrollView, TouchableOpacity, Image} from 'react-native';
import { Actions } from 'react-native-router-flux';
import LoginScreen from '../lib/components/LoginScreen';
import BaseComponent from '../lib/BaseComponent.js';


export default class LoginForm extends BaseComponent{

    constructor(props) {
        super(props);
        this.state = {};
        this.goHome = this.goHome.bind(this);
    }

    render() {
        return (
            <View style={{backgroundColor:"#fff", flex:1, justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <LoginScreen onLogin={this.goHome} onRegister={this.goHome} />
            </View>
        );
    }

    goHome(){
        Actions.reset('home');
    }

}
