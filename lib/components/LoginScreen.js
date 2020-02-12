import React from 'react';
import {Text, View, ScrollView, TouchableOpacity, Image} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ModalMessage from './ModalMessage';
import ModalSyncro from './ModalSyncro';
import ModalLoginForm from './ModalLoginForm';
import BaseComponent from '../BaseComponent.js';
import Button from './Button';
import {netManager} from '../NetManager';
import {profileManager} from '../ProfileManager';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {syncro}   from '../Syncro.js';
import {crashLogger} from '../CrashLogger.js';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import InternetArea from './InternetArea';

export default class LoginScreen extends BaseComponent{

    constructor(props) {
        super(props);
        this.state = {
            loginForm: false
        };
        this._signIn = this._signIn.bind(this);
        this.showWelcome = this.showWelcome.bind(this);
        this.goRegisterForm = this.goRegisterForm.bind(this);
    }

    componentDidMount(){
        GoogleSignin.configure({
            webClientId:'728380312031-mrgtbhks8ivn670hisnsc61fsldno7rb.apps.googleusercontent.com'
        }).then(() => {

        });
    }

    render() {
        return (
            <View style={{backgroundColor:"#fff", flex:1, justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                <InternetArea />
                <ModalMessage type={this.modalType} onPress={()=> this.props.onLogin()} message={this.state.modalContent} title={this.state.modalTitle} visible={this.state.modalVisible} />
                <ModalSyncro  visible={this.state.modalSyncroVisible} />
                {(this.state.loginForm)&&
                    <ModalLoginForm visible={this.state.loginForm} onCancel={()=> this._hideModal()} onLogged={()=>this._hideAndLoad()}/>
                }
                <View style={{padding:20}}>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Button style={{backgroundColor:"#eee", padding:20, borderRadius:10}}
                            onPress={()=> this._signIn()}>
                            <View style={{flexDirection:'row'}}>
                                <Image source={require('../../assets/google_logo.png')} />
                                <Text style={{fontSize:21, fontWeight:'bold'}}>Login with Google</Text>
                            </View>
                        </Button>
                    </View>
                    <View style={{padding:20}}>
                        <Text style={{fontSize:16}}>Si no tienes cuenta, al entrar con Google se creará de forma automática en BabyHelper</Text>
                    </View>
                </View>
                <View style={{padding:20}}>
                    <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Button style={[{backgroundColor:this.theme.colors.primary,padding:20, paddingBottom:20,paddingTop:20, borderRadius:10}]}
                            onPress={()=> this._showLoginForm()}>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontSize:21, fontWeight:'bold', color:"#fff"}}>Login with Mail</Text>
                            </View>
                        </Button>
                    </View>
                    <View style={{padding:20, flexDirection:'row'}}>
                        <Text style={{fontSize:16}}>¿Aún no tienes cuenta?</Text>
                        <TouchableOpacity
                            onPress={()=>this.goRegisterForm()}
                        >
                            <Text style={{marginLeft:10, textDecorationLine: 'underline', color:this.theme.colors.primary, fontSize:16}}>Registrate ahora</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    _showLoginForm(){
        this.setState({
            loginForm: true
        });
    }

    _hideModal(){
        this.setState({
            loginForm: false
        });
    }

    _hideAndLoad(){
        this._hideModal();
        this.loadUser();
    }

    goRegisterForm(){
        Actions.registerForm({
            onRegister: this.props.onRegister
        });
    }

    _signIn(){
        GoogleSignin.signIn()
            .then(async (user) => {
                var profile = await profileManager.getProfile();
                let profileChanges = {
                    email: user.email,
                    id_token: user.idToken,
                    login_type: 'google'
                };
                profile = {...profile, ...profileChanges};
                await profileManager.set(profile);
                var ret = await netManager.login();
                if(ret){
                    if(ret.new){
                        profileChanges = {
                            registered: true,
                            confirmed: true
                        };
                        if((profile.name===undefined)||(profile.name===null)){
                            if(profile.picture===null){
                                syncro.loadProfile().then(async ()=>{
                                    this.showWelcome(true);
                                });
                            }else{
                                profile.name = user.name;
                                profile = {...profile, ...profileChanges};
                                await profileManager.set(profile);
                                this.showWelcome(true);
                            }
                        }else{
                            profile = {...profile, ...profileChanges};
                            await profileManager.set(profile);
                            this.showWelcome(true);
                        }
                    }else{
                        this.loadUser();
                    }
                }else{
                    this.setState({
                        modalContent: "Los datos de acceso no son validos",
                        modalType: "error",
                        modalVisible: true
                    });
              }
        })
        .catch((err) => {
            crashLogger.log(err);
        })
        .done();
    }

    loadUser(){
        this.setState({
            modalSyncroVisible: true
        })
        syncro.loadFromServer().then(async ()=>{
            this.setState({
                modalSyncroVisible: false
            });
            this.showWelcome(false);
        });
    }

    async showWelcome(firstTime){
        let profile = await profileManager.getProfile();
        let name    = profile.name;
        var modalContent = "Bienvenido de nuevo";
        if(firstTime){
            modalContent = "Tu cuenta se creo con éxito";
        }
        this.setState({
            modalTitle: "¡Hola "+name+"!",
            modalContent: modalContent,
            modalType: "success",
            modalVisible: true
        });
    }
}
