import React from 'react';
import {Text, View} from 'react-native';
import { Actions } from 'react-native-router-flux';
import BaseComponent from '../lib/BaseComponent.js';
import ModalMessage from '../lib/components/ModalMessage';
import Button from '../lib/components/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Installer from '../lib/Installer';

export default class Logout extends BaseComponent{

    constructor(props) {
        super(props);
        this.state = {
          modalText: '',
          modalType: 'success',
          modalVisible: false
        };
        this.logout = this.logout.bind(this);
    }

    componentDidMount(){}

    render() {
        return (
            <View style={{flex: 1}}>
                <ModalMessage type="success" onPress={()=> this._hideModal()} message={this.state.modalText} visible={this.state.modalVisible} />
                <View style={this.theme.styles.form_container}>
                  <View style={this.theme.styles.form_cell}>
                        <Text style={{fontWeight:'bold', fontSize:24, textAlign:'center', padding:20, marginBottom:10}}>Confirma que quieres salir de tu cuenta.</Text>
                        <Button
                            style={[this.theme.styles.global_default_button,{backgroundColor:this.theme.colors.primary}]}
                            onPress={()=> this.logout()}
                            >
                            <View style={{flexDirection:"row"}}>
                                <Text style={[this.theme.styles.global_default_button_text,{color:"#fff", marginRight:5}]}>Salir</Text>
                                <Icon name="logout-variant" size={25} color="#fff"/>
                            </View>
                        </Button>
                  </View>
                </View>
            </View>
        );
    }

    async logout(){
        var installer = new Installer();
        installer.reinstallUserFixtures().then(()=>{
            this.setState({
                  modalText: "Saliste de tu cuenta",
                  modalType: "success",
                  modalVisible: true
            });
        });
    }

    _hideModal(){
        this.setState({modalVisible:false});
        Actions.home();
    }
}
