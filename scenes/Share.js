import React from 'react';
import {
    View, Text, StyleSheet,
    Animated, Dimensions,
    Image, ScrollView
} from 'react-native';

import BaseComponent from '../lib/BaseComponent.js';
import Lightbox from '../lib/components/BaseLightbox';
import { Actions } from 'react-native-router-flux';
import Button from '../lib/components/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import {netManager} from '../lib/NetManager';
import {profileManager} from '../lib/ProfileManager';
import {syncro} from '../lib/Syncro';
import LoginScreen from '../lib/components/LoginScreen';

export default class Share extends BaseComponent{

    constructor(props) {
        super(props);
        this.state = {
            status: 'pending',
            resolved: false
        };
        this.checkToken = this.checkToken.bind(this);
    }

    componentDidMount(){
        if(netManager.isLogged()){
            this.checkToken();
        }
    }

    render() {
        if(this.state.status==='resolved'){
            if(this.state.resolved){
                return this.renderResolved();
            }else{
                return this.renderRejected();
            }
        }else{
            if(!netManager.isLogged()){
                return (
                    <ScrollView
                        style={{backgroundColor:"#fff", flex:1, flexDirection:'column'}}
                        contentContainerStyle={{justifyContent:'center', alignItems:'center'}}
                    >
                        <View style={{paddingTop:20, paddingBottom:20, width:'90%',justifyContent:'center', alignItems:'center'}}>
                            <View>
                                <Image
                                    style={{width: 120, height: 120}}
                                    source={require("../assets/if_kid_1930420.png")}
                                />
                            </View>
                            <Text style={[this.theme.styles.home_title,{padding:10}]}>BabyHelper</Text>
                            <Text style={{padding:10, fontSize:18}}>Necesitas estar registrado para poder compartir los cuidados de los bebes.</Text>
                        </View>
                        <LoginScreen onLogin={this.checkToken} onRegister={()=>Actions.pop()} />
                    </ScrollView>
                );
            }else{
                return this.renderWorking();
            }
        }
    }

    checkToken(){
        var url = this.props.url;
        const shareUrl = "https://babyhelper.info/shared/";
        if(url.indexOf(shareUrl)!==-1){
            let token = this.props.url.substring(shareUrl.length, url.length);
            syncro.setSharedKid(token).then((child)=>{
                this.setState({
                    resolved: true,
                    status: 'resolved',
                    child
                });
            },(ret)=>{
                this.setState({
                    status: 'resolved',
                    resolved: false,
                    child
                });
            });
        }
    }

    renderWorking(){
        return (
            <View style={{flex:1, justifyContent:'center', backgroundColor:'#fafafa', borderRadius:10, padding:15, paddingTop:25, alignItems:'center'}}>
                <Text style={{margin:5, fontSize:24, fontWeight:'bold', textAlign:"center", color:"#000"}}>Sincronizando datos</Text>
                <Text style={{margin:5, fontSize:21, textAlign:"center", color:"#000"}}>Por favor, espere un momento...</Text>
                <View style={{margin:10}}>
                    <Animatable.Image source={require("../assets/syncro2.gif")} animation="rotate" iterationCount="infinite" duration={800} />
                </View>
            </View>
        );
    }

    renderResolved(){
        var name = "";
        var picture = <Image
            style={{width: 120, height: 120}}
            source={require("../assets/if_kid_1930420.png")}
        />;
        var child = this.state.child;
        if(child.picture!==null){
            picture = <Image source={{uri: child.picture.path }} style={this.theme.styles.home_image} />;
        }
        if(child.name!==null){
            name = child.name;
        }

        return (
            <Lightbox verticalPercent={0.7} horizontalPercent={0.9} type="success" onPress={()=>Actions.reset('home')}>
                <View style={{alignItems:"center", padding:5}}>
                <Text style={[this.theme.styles.home_title,{textAlign:'center'}]}>¡{name} te da la bienvenida!</Text>
                <View
                      style={this.theme.styles.home_image_container}
                    >
                        {picture}
                    </View>
                    <View style={{flexDirection:"column", alignItems:"center", paddingTop:5}}>
                        <Text style={{fontSize:18, padding:20,textAlign:'center'}}>Has sido añadid@ a la lista de tutores de {name}</Text>
                    </View>
                </View>
            </Lightbox>
        );
    }

    renderRejected() {
        return (
            <Lightbox verticalPercent={0.5} horizontalPercent={0.9} type="normal">
                <View style={{padding:20}}>
                    <Text style={{paddingBottom:20, fontWeight:'bold', fontSize:21, textAlign:'center'}}>
                        ¡¡Uppps!! Lo sentimos
                    </Text>
                    <Text style={{paddingBottom:20, textAlign:'center', fontSize:16}}>
                        El enlace no es válido. Los enlaces no son válidos despues de 24 horas
                    </Text>
                </View>
            </Lightbox>
        );
    }

}
