import React from 'react';
import { Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modal';

import BaseComponent from '../BaseComponent.js';
import Button from './Button';
import {profileManager} from '../ProfileManager';

export default class RegisteredArea extends BaseComponent {

    constructor(){
        super();
        this.state = {
            modalVisible: false,
            password: ''
        }
    }

    async componentDidMount(){
        let confirmed = await profileManager.get('confirmed');
        if(!confirmed){
            this.setState({
                modalVisible: true
            });
        }
    }

    render() {
        return (
            <View>
                <Modal
                    isVisible={this.state.modalVisible}
                    animationIn={'bounceIn'}
                    animationOut={'bounceOut'}
                    >
                    <View style={{backgroundColor:"#fff", borderRadius:10, padding:10, paddingTop:20, width:'100%', alignItems:'center', justifyContent:'center'}}>
                        <View style={{flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
                            <Text style={{fontSize:24, fontWeight:"bold", marginBottom:10, textAlign:'center'}}>Lo sentimos</Text>
                            <Text style={{fontSize:20, marginBottom:10, textAlign:'center'}}>Necesitas estar registrado para poder usar esta funcionalidad</Text>
                        </View>
                        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                            <Button
                                onPress={()=> this.goHome()}
                                style={this.theme.styles.global_danger_button}
                            >
                                <Text style={this.theme.styles.global_danger_button_text}>Volver</Text>
                            </Button>
                            <Button
                                onPress={()=> this.goLogin()}
                                style={this.theme.styles.global_primary_button}
                            >
                                <Text style={this.theme.styles.global_primary_button_text}>Acceder</Text>
                            </Button>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    goHome(){
        this.setState({modalVisible:false});
        Actions.home()
    }

    goLogin(){
        this.setState({modalVisible:false});
        Actions.loginForm()
    }
}
