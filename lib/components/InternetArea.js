import React from 'react';
import { Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modal';

import BaseComponent from '../BaseComponent.js';
import Button from './Button';
import WCPasswordInput from './WCPasswordInput';
import {profileManager} from '../ProfileManager';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NetInfo} from 'react-native';

export default class InternetArea extends BaseComponent {

    constructor(){
        super();
        this.state = {
            visible: false
        };
        this.checkConnection = this.checkConnection.bind(this)
    }

    componentDidMount(){
        NetInfo.addEventListener(
            'connectionChange',
            this.checkConnection
        );
        this.checkConnection();
    }

    componentWillUnmount(){
        NetInfo.removeEventListener(
            'connectionChange',
            this.checkConnection
        );
    }



    checkConnection(){
        NetInfo.isConnected.fetch().then((isConnected) => {
            if(this.state.visible===isConnected){
                this.setState({
                    visible:!isConnected
                });
            }
        });
    }

    render() {
        if(!this.state.visible){
            return <View></View>
        }
        return (
            <View>
                <Modal
                    isVisible={true}
                    animationIn={'bounceIn'}
                    animationOut={'bounceOut'}
                    >
                    <View style={{backgroundColor:"#fff", borderRadius:10, padding:10, paddingTop:20, width:'100%', alignItems:'center', justifyContent:'center'}}>
                        <View>
                            <Text style={{fontWeight:'bold',fontSize:28, textAlign:'center'}}>Sin conexión a internet</Text>
                            <View style={{alignItems:'center', justifyContent:"center"}}>
                                <Icon name="portable-wifi-off" size={120} />
                            </View>
                            <Text>Es necesario tener conexión a internet para usar esta funcionalidad.</Text>
                        </View>
                        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                            <Button
                                onPress={()=> this.goBack()}
                                style={this.theme.styles.global_primary_button}
                            >
                                <Text style={this.theme.styles.global_primary_button_text}>Volver</Text>
                            </Button>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    goBack(){
        Actions.reset('home');
    }

}
