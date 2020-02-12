import React from 'react';
import { Text, View, TouchableOpacity, Linking } from 'react-native';
import BaseComponent from '../BaseComponent.js';
import Modal from 'react-native-modal';
import Button from './Button';
import Icon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';

export default class ModalNeedRegistered extends BaseComponent {

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
                                <Text style={{margin:5, fontSize:21, fontWeight:'bold', textAlign:"center", color:"#000"}}>Necesitar estar registrad@</Text>
                                <View style={{margin:5}}>
                                    <Text style={{fontSize:18, color:"#000"}}>Para poder compartir las notas de tus bebes con otros usuarios necesitas estar registrad@, por favor ingresa con tu cuenta de Gmail o con tu cuenta de correo.</Text>
                                </View>
                                <TouchableOpacity style={{margin:20, padding:0, alignItems:'center'}} onPress={()=>this.goLogin()}>
                                    <Text style={{width:220, borderBottomWidth:1, borderColor:"#000", fontSize:18, textAlign:"center", color:"#000"}}>Registro / Login</Text>
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

    goLogin(){
        this.props.onClose();
        Actions.login();
    }

    close(){
        this.props.onClose();
    }

}
