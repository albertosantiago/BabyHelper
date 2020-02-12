import React from 'react';
import {
    Text, View,
    TextInput, ScrollView,
    Alert
}from 'react-native';

import { Actions } from 'react-native-router-flux';
import BaseComponent from '../lib/BaseComponent.js';
import Modal from 'react-native-modal';
import ModalMessage from '../lib/components/ModalMessage';
import ModalPasswordRecovery from '../lib/components/ModalPasswordRecovery';
import Button from '../lib/components/Button';
import MyImgPicker from '../lib/components/MyImgPicker';
import WCErrors from '../lib/components/WCErrors';
import WCInput from '../lib/components/WCInput';
import WCDatePicker from '../lib/components/WCDatePicker';
import WCPasswordInput from '../lib/components/WCPasswordInput';
import validator from 'validator';
import {netManager} from '../lib/NetManager';
import {profileManager} from '../lib/ProfileManager';

export default class RegisterForm extends BaseComponent{

    constructor(props) {
        super(props);
        this.state = {
            id: null,
            name: null,
            email: null,
            password: null,
            picture: null,
            confirmationCode1: null,
            confirmationCode2: null,
            modalVisible: false,
            modalContent: '',
            modalType: '',
            errors:{}
        }
        this.register = this.register.bind(this);
        this.renderModal = this.renderModal.bind(this);
    }

    componentDidMount(){
        profileManager.getProfile().then((profile) => {
            this.setState({
                name: profile.name,
                picture: profile.picture,
            });
        });
    }

    render() {
        return (
            <ScrollView style={{ flex: 1 }}>
                {this.renderModal()}
                <View style={this.theme.styles.form_container}>
                    <View style={this.theme.styles.form_cell}>
                        <MyImgPicker picture={this.state.picture} onChange={(picture)=> this.setState({picture:picture})}/>
                    </View>
                    <View>
                        <WCErrors errors={this.state.errors} />
                    </View>
                    <View>
                        <WCInput
                            label="Nombre"
                            error={this.state.errors.name}
                            style={this.theme.styles.form_input}
                            onChangeText={(name) => this.setState({name})}
                            maxLength = {40}
                            value={this.state.name}
                            placeholder="Mi nombre"
                            underlineColorAndroid='rgba(0,0,0,0)'
                            />
                    </View>
                    <View>
                        <WCInput
                            label="Email"
                            error={this.state.errors.mail}
                            style={this.theme.styles.form_input}
                            onChangeText={(email) => this.setState({email})}
                            maxLength = {40}
                            value={this.state.email}
                            placeholder="youremail@gmail.com"
                            underlineColorAndroid='rgba(0,0,0,0)'
                            />
                    </View>
                    <View>
                        <WCPasswordInput
                            label="Contraseña"
                            error={this.state.errors.password}
                            style={this.theme.styles.form_input}
                            onChangeText={(password) => this.setState({password})}
                            maxLength = {40}
                            value={this.state.password}
                            />
                    </View>
                    <View style={this.theme.styles.form_cell}>
                        <View style={{flexDirection:"row", padding:20, alignItems:"center", justifyContent:"center"}}>
                            <Button
                                style={[this.theme.styles.global_default_button,{backgroundColor:"#000"}]}
                                onPress={()=> this.register()}
                                >
                                <Text style={[this.theme.styles.global_default_button_text,{color:"#fff"}]}>Registrarse</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }

    renderModal(){
        if(this.state.modalType==='success'){
            return (
                <View>
                    <ModalMessage type="success" onPress={()=> this._hideModal()} message={this.state.modalContent} visible={this.state.modalVisible} />
                </View>
            );
        }
        if(this.state.modalType==='error_email_registered'){
            return (
                <View>
                    <ModalPasswordRecovery visible={this.state.modalVisible} onClose={()=>this.setState({modalVisible:false})} />
                </View>
            );
        }
        //Si es la de confirmación
        return (
            <View>
                <Modal
                    isVisible={this.state.modalVisible}
                    animationIn={'bounceIn'}
                    animationOut={'bounceOut'}
                    >
                    <View style={{backgroundColor:"#fff", borderRadius:10, padding:10, paddingTop:20, width:'100%', alignItems:'center', justifyContent:'center'}}>
                        <Text style={{fontSize:24, fontWeight:"bold", marginBottom:10, textAlign:'center'}}>¡Gracias por tu registro!</Text>
                        <Text style={{fontSize:20, marginBottom:10, textAlign:'center'}}>Solo queda un paso para completar tu cuenta.</Text>
                        <Text style={{fontSize:16, marginBottom:10, textAlign:'center'}}>Hemos enviado un código a tu cuenta de correo, introducelo a continuación para acabar el registro.</Text>
                        <View style={{flexDirection:'row'}}>
                            <TextInput
                                style={[this.theme.styles.form_input,{width:'25%', textAlign:"center"}]}
                                onChangeText={(confirmationCode1) => this.setState({confirmationCode1:confirmationCode1})}
                                maxLength = {6}
                                placeholder="111"
                                underlineColorAndroid='rgba(0,0,0,0)'
                            />
                            <Text style={{fontWeight:'bold', fontSize:24, marginTop:10}}> - </Text>
                            <TextInput
                                style={[this.theme.styles.form_input,{width:'25%', textAlign:"center"}]}
                                onChangeText={(confirmationCode2) => this.setState({confirmationCode2:confirmationCode2})}
                                maxLength = {6}
                                placeholder="222"
                                underlineColorAndroid='rgba(0,0,0,0)'
                            />
                        </View>
                        <Button
                            onPress={()=> this.confirm()}
                            style={this.theme.styles.global_default_button}
                        >
                            <Text style={this.theme.styles.global_default_button_text}>Confirmar</Text>
                        </Button>
                    </View>
                </Modal>
            </View>
        );
    }

    async confirm(){
        var resp = await netManager.post({
            url: 'user/confirmation',
            data:{
                confirmationCode: this.state.confirmationCode1+'-'+this.state.confirmationCode2
            }
        });
        if(resp.status===200){
            let ret = await resp.json();
            if(ret.message==='confirmation_ok'){
                let profile = await profileManager.getProfile();
                let profileChanges = {
                    confirmed: true,
                    updatedServer: false
                };
                profile = {...profile, ...profileChanges};
                profileManager.set(profile);
                this.setState({modalType: "success", modalVisible: true, modalContent: '¡Enhorabuena! Tu registro se completo con exito' });
            }
        }
    }

    validate(){
        let errors = {};
        let name = this.state.name;
        let password = this.state.password;
        let email    = this.state.email;

        if(email!==null){
            email = email.toString().trim();
            if(!validator.isEmail(email)){
                errors.mail = "El email introducido no es correcto";
            }
        }else{
            errors.mail = "El email es obligatorio";
        }
        if(password!==null){
            password = password.toString();
            if(!validator.isLength(password, { min:5, max:15 })){
                errors.password = "La contraseña debe tener entre 5 y 15 caracteres.";
            }
        }else{
            errors.password = "La contraseña es obligatoria";
        }
        if(name!==null){
            name = name.toString().replace(/\s\s+/g,' ');
            if(!validator.isLength(name, { min:2, max:25 })){
                errors.name = "El nombre tiene que tener un número de caracteres entre 2 y 15";
            }
            name = name.toString().replace(/\s+/g,'');
            if(!validator.isAlphanumeric(name, ['es-ES'])){
                errors.name = "El nombre solo puede contener caracteres alfanuméricos";
            }
        }else{
            errors.name = "El nombre es obligatorio";
        }
        this.setState({errors});
        let keys = Object.keys(errors);
        for(let key of keys){
            if(errors[key]!==null){
                return false;
            }
        }
        return true;
    }

    async register(){
        if(!this.validate()){
            return;
        }
        try {
            let profile = await profileManager.getProfile();
            const data = new FormData();
            data.append('id', profile.id);
            data.append('name', this.state.name.trim().replace(/\s\s+/g, ' '));
            data.append('email', this.state.email.trim());
            data.append('password', this.state.password.trim());

            if(this.state.picture!==null){
                let chunks = this.state.picture.path.split('.');
                data.append('picture', {
                    uri:  this.state.picture.path,
                    type: this.state.picture.mime,
                    name: 'picture.'+chunks[1]
                });
            }
            let resp = await netManager.post({
                url:'user/store',
                data: data,
                multipart: true
            });
            if(resp.status===200){
                let ret = await resp.json();
                let currentProfile = await profileManager.getProfile();
                let profileChanges = {
                    registered: true,
                    confirmed:  false,
                    name:     this.state.name,
                    picture:  this.state.picture,
                    email:    this.state.email.trim(),
                    password: this.state.password.trim(),
                    login_type: 'email'
                };
                currentProfile = {...currentProfile, ...profileChanges};
                profileManager.set(currentProfile);
                netManager.login();
                this.setState({
                    modalType: "confirmation",
                    modalVisible: true
                });
            }else{
                if(resp.status===422){
                    let ret = await resp.json();
                    this.setState({
                        modalType: "error_email_registered",
                        modalVisible: true
                    });
                }
            }
        }catch (error) {
            Alert.alert(
                'Error',
                'Hubo un problema guardando los datos.',
                [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: true }
            );
        }
    }

    _hideModal(){
        this.setState({modalVisible:false});
        if(this.props.onRegister!==undefined){
            this.props.onRegister();
        }else{
            Actions.home();
        }
    }
}
