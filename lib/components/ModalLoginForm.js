import React from 'react';
import {Text, View, ScrollView, TouchableOpacity, Linking} from 'react-native';
import { Actions } from 'react-native-router-flux';
import BaseComponent from '../BaseComponent.js';
import Modal from 'react-native-modal';
import Button from './Button';
import WCPasswordInput from './WCPasswordInput';
import WCErrors from './WCErrors';
import WCInput from './WCInput';
import {netManager} from '../NetManager';
import {profileManager} from '../ProfileManager';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {syncro}      from '../Syncro.js';
import validator from 'validator';

export default class ModalLoginForm extends BaseComponent{

    constructor(props) {
        super(props);
        this.state = {
            id: null,
            email: null,
            password: null,
            visible: this.props.visible,
            errors:{}
        }
        this.login = this.login.bind(this);
    }

    componentDidMount(){}

    render() {
        return (
            <Modal
                isVisible={this.state.visible}
                animationIn={'slideInLeft'}
                animationOut={'slideOutRight'}
                >
                    <View style={{backgroundColor:"#fff", justifyContent:'center', alignItems:'center', paddingTop:10,paddingBottom:10, height:455, borderRadius:10}}>
                        <View>
                            <WCInput
                                label="Email"
                                error={this.state.errors.mail}
                                style={this.theme.styles.form_input}
                                onChangeText={(email) => this.setState({email:email})}
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
                                onChangeText={(password) => this.setState({password:password})}
                                maxLength = {40}
                                value={this.state.password}
                                />
                        </View>
                        <View>
                            <WCErrors errors={this.state.errors} />
                        </View>
                        <View style={[this.theme.styles.form_cell,{flexDirection:'row'}]}>
                            <Button
                                style={[this.theme.styles.global_danger_button]}
                                onPress={()=> this.props.onCancel()}
                                >
                                <View style={{flexDirection:"row"}}>
                                    <Text style={[this.theme.styles.global_danger_button_text]}>Cancelar</Text>
                                </View>
                            </Button>
                            <Button
                                style={[this.theme.styles.global_default_button,{backgroundColor:this.theme.colors.primary}]}
                                onPress={()=> this.login()}
                                >
                                <View style={{flexDirection:"row"}}>
                                    <Text style={[this.theme.styles.global_default_button_text,{color:"#fff", marginRight:5}]}>Entrar</Text>
                                    <Icon name="login-variant" size={25} color="#fff"/>
                                </View>
                            </Button>
                        </View>
                        <View style={[{flexDirection:'row'}]}>
                            <Text style={{fontSize:16}}>¿Aún no tienes cuenta?</Text>
                            <TouchableOpacity
                                onPress={()=>this.goRegisterForm()}
                            >
                                <Text style={{marginLeft:10, textDecorationLine: 'underline', color:this.theme.colors.primary, fontSize:16}}>Registrate ahora</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection:'row', width:'96%', padding:"2%", paddingTop:18}}>
                            <Text style={{fontSize:16}}>¿Olvidaste tu contraseña?</Text>
                            <TouchableOpacity
                                onPress={()=>this.goPasswordRecovery()}
                            >
                                <Text style={{marginLeft:5, textDecorationLine: 'underline', color:this.theme.colors.primary, fontSize:16}}>Recupérala aquí</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={{marginTop:7,fontSize:11}}>* Abrir el enlace con el navegador</Text>
                        </View>
                </View>
            </Modal>
        );
    }

    goRegisterForm(){
        this.props.onCancel();
        Actions.registerForm();
    }

    validate(){
        let errors = {};
        let password = this.state.password;
        let email    = this.state.email.trim();

        if(email!==null){
            email = email.toString();
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
        this.setState({errors});
        let keys = Object.keys(errors);
        for(let key of keys){
            if(errors[key]!==null){
                return false;
            }
        }
        return true;
    }

    async login(){
        if(!this.validate()){
            return;
        }
        var profile = await profileManager.getProfile();
        let profileChanges = {
            email:    this.state.email.trim(),
            password: this.state.password.trim(),
            login_type: 'email'
        };
        profile = {...profile, ...profileChanges};
        await profileManager.set(profile);
        var ret = await netManager.login();
        if(ret){
            this.props.onLogged();
        }else{
            this.setState({
                errors:{
                    'incorrect_data':'Los datos de acceso son incorrectos.'
                }
            })
        }
    }

    goPasswordRecovery(){
        Linking.openURL('https://babyhelper.info/password/recovery').catch(err => console.error('An error occurred', err));
    }

}
