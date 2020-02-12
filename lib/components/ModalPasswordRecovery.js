import React from 'react';
import { Text, View, TouchableOpacity, Linking } from 'react-native';
import BaseComponent from '../BaseComponent.js';
import Modal from 'react-native-modal';
import Button from './Button';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Message extends BaseComponent {

    constructor(props){
        super(props);
        this.state = {
            type: props.type,
            onPress:props.onPress,
            visible:props.visible
        };
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            visible: nextProps.visible
        });
    }

    componentDidMount(){
    }

    render(){
        return (
            <View>
                <Modal
                    isVisible={this.state.visible}
                    animationIn={'bounceIn'}
                    animationOut={'bounceOut'}
                    >
                        <View style={{backgroundColor:'#fafafa', borderRadius:10, padding:15, paddingTop:25, alignItems:'center'}}>
                            <View>
                                <Text style={{margin:5, fontSize:21, fontWeight:'bold', textAlign:"center", color:"#000"}}>Error en el registro</Text>
                                <View style={{margin:5}}>
                                    <Text style={{fontSize:18, color:"#000"}}>El email introducido ya esta registrado, para recuperar su contraseña pulse el enlace y accede a babyhelper.info con el</Text>
                                    <Text style={{fontSize:18, fontWeight:'bold', color:"#000"}}>Navegador</Text>
                                </View>
                                <TouchableOpacity style={{margin:20, padding:0, alignItems:'center'}} onPress={()=>this.goPasswordRecovery()}>
                                    <Text style={{width:220, borderBottomWidth:1, borderColor:"#000", fontSize:18, textAlign:"center", color:"#000"}}>Recuperar contraseña</Text>
                                </TouchableOpacity>
                            </View>
                            <Button
                                onPress={()=> this.close()}
                                style={this.theme.styles.global_danger_button}
                            >
                                <Text style={this.theme.styles.global_danger_button_text}>Cerrar</Text>
                            </Button>
                        </View>
                </Modal>
            </View>);
    }

    goPasswordRecovery(){
        Linking.openURL('https://babyhelper.info/password/recovery').catch(err => console.error('An error occurred', err));
    }

    close(){
        this.props.onClose();
    }

}
