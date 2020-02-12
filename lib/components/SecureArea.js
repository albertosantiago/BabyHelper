import React from 'react';
import { Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modal';

import BaseComponent from '../BaseComponent.js';
import Button from './Button';
import WCPasswordInput from './WCPasswordInput';
import {profileManager} from '../ProfileManager';
import Icon from 'react-native-vector-icons/Ionicons';

export default class SecureArea extends BaseComponent {

    constructor(){
        super();
        this.state = {
            modalVisible: true,
            password: ''
        }
    }

    componentDidMount() {}

    render() {
        return (
            <View>
                <Modal
                    isVisible={this.state.modalVisible}
                    animationIn={'bounceIn'}
                    animationOut={'bounceOut'}
                    >
                    <View style={{backgroundColor:"#fff", borderRadius:10, padding:10, paddingTop:20, width:'100%', alignItems:'center', justifyContent:'center'}}>
                        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                            <Text style={{fontSize:24, fontWeight:"bold", marginBottom:10, textAlign:'center'}}>Zona Segura</Text>
                            <Icon name="md-lock" size={30} style={{marginBottom:10, marginLeft:10}} />
                        </View>
                        <View style={this.theme.styles.form_cell}>
                            <Text style={{fontSize:20, marginBottom:10, textAlign:'center'}}>Introduce tu password</Text>
                            <View style={{flexDirection:'row'}}>
                                <WCPasswordInput
                                    style={this.theme.styles.form_input}
                                    onChangeText={(password) => this.setState({password:password})}
                                    maxLength = {40}
                                    value={this.state.password}
                                />
                            </View>
                        </View>
                        {(this.state.incorrectPassword)&&
                            <View style={this.theme.styles.form_cell}>
                                <Text style={{textAlign:'center', padding:10,fontSize:20, marginBottom:10, color:"#D01919"}}>La contraseña introducida no es correcta</Text>
                            </View>
                        }
                        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                            <Button
                                onPress={()=> this.goHome()}
                                style={this.theme.styles.global_danger_button}
                            >
                                <Text style={this.theme.styles.global_danger_button_text}>Cancelar</Text>
                            </Button>
                            <Button
                                onPress={()=> this.verify()}
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

    async verify(){
        return this.setState({modalVisible:false});
        //QUITAR ESTO!!!!
        let password = await profileManager.get('password');
        if(password===this.state.password){
            this.setState({modalVisible:false});
        }else{
            this.setState({incorrectPassword:true});
        }
    }

}
