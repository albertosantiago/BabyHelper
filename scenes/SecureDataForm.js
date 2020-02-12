import React from 'react';
import {
Text, View, TextInput
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modal';
import BaseComponent from '../lib/BaseComponent.js';
import ModalMessage from '../lib/components/ModalMessage';
import Button from '../lib/components/Button';
import SecureArea from '../lib/components/SecureArea';
import WCPasswordInput from '../lib/components/WCPasswordInput';
import {netManager} from '../lib/NetManager';
import {profileManager} from '../lib/ProfileManager';
import {syncro}      from '../lib/Syncro.js';


export default class SecureDataForm extends BaseComponent{

    constructor(props) {
        super(props);
        this.state = {
            tabActive: false,
            id: null,
            email: null,
            password: null,
            modalVisible: false,
            modalText: '',
            modalType: 'success'
        }
        this.save = this.save.bind(this);
    }

    componentDidMount(){
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={this.theme.styles.form_container}>
                    <ModalMessage type="success" onPress={()=> this._hideModal()} message={this.state.modalText} visible={this.state.modalVisible} />
                    <View style={this.theme.styles.form_cell}>
                            <Text style={this.theme.styles.form_label}>
                                Email
                            </Text>
                            <TextInput
                                style={this.theme.styles.form_input}
                                onChangeText={(email) => this.setState({email:email})}
                                maxLength = {40}
                                value={this.state.email}
                                placeholder="youremail@gmail.com"
                                underlineColorAndroid='rgba(0,0,0,0)'
                                />
                    </View>
                    <View style={this.theme.styles.form_cell}>
                        <Text style={this.theme.styles.form_label}>
                            Password
                        </Text>
                        <WCPasswordInput
                            style={this.theme.styles.form_input}
                            onChangeText={(password) => this.setState({password:password})}
                            maxLength = {40}
                            value={this.state.password}
                            />
                    </View>
                    <View style={this.theme.styles.form_cell}>
                        <Button
                            style={[this.theme.styles.global_default_button,{backgroundColor:this.theme.colors.primary}]}
                            onPress={()=> this.save()}
                            >
                            <View style={{flexDirection:"row"}}>
                                <Text style={[this.theme.styles.global_default_button_text,{color:"#fff", marginRight:5}]}>Salvar</Text>
                            </View>
                        </Button>
                    </View>
                </View>
            </View>
        );
    }

    async save(){
        var profile = await profileManager.getProfile();
        let profileChanges = {
            email:    this.state.email.trim(),
            password: this.state.password.trim(),
        };
        profile = {...profile, ...profileChanges};
        profileManager.set(profile);
        this.setState({
            modalText: "Los cambios se realizaron con exito",
            modalType: "success",
            modalVisible: true
        });
    }

    _hideModal(){
        this.setState({modalVisible:false});
        Actions.home();
    }
}
