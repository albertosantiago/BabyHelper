import React from 'react';
import { Text, View, Image, TouchableHighlight } from 'react-native';
import Modal from 'react-native-modal';
import BaseComponent from '../BaseComponent.js';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import {noteManager} from '../NoteManager';
import {profileManager} from '../ProfileManager';
import {cron} from "../Cron.js";

const CRON_KEY = "status-indicator-component";

export default class StatusIndicator extends BaseComponent {

    constructor(){
        super();
        this.state = {
            visible: false
        };
        this.mounted = true;
        this.CRON_KEY = CRON_KEY+"-"+ Math.floor(Math.random() * (10000000));
    }

    componentDidMount() {
        cron.register(()=>{
            if(this.mounted){
                this.check();
            }
        }, 4, this.CRON_KEY);
        this.check();
    }

    componentWillUnmount() {
        cron.unregister(this.CRON_KEY);
        this.mounted = false;
        this.removeListeners();
    }

    render() {
        if((!this.state.visible)||(this.state.forceHidden)){
            return <View></View>
        }
        let text = this.generateText();
        return (
                <View style={{ height:100,  alignItems:'center',width:'100%',
                               justifyContent:'center', position:'absolute', bottom:0, zIndex:100000}}>
                    <View style={{width:'95%',borderColor:"#777", borderWidth:1,backgroundColor:"#fff", borderRadius:10, padding:15}}>
                        <View style={{flexDirection:'row'}}>
                            <Animatable.View animation="rotate" iterationCount="infinite" duration={800}>
                                <Image
                                    style={{width: 30, height: 30}}
                                    source={require("../../assets/syncro2.gif")}
                                />
                            </Animatable.View>
                            <Text style={{paddingTop:5, paddingLeft:10,fontSize:14, textAlign:'center', color:"#333"}}>{text}</Text>
                        </View>
                        <View style={{position:"absolute", top:0, right:2, width:20,flexDirection:'row', zIndex:4}}>
                            <TouchableHighlight
                                style={{paddingLeft:0, paddingRight:0, marginRight:0,marginTop:0}}
                                underlayColor="#fff"
                                onPress={()=> this.forceHidden()}>
                                <Icon name="md-close-circle" size={22} color="#333" />
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
        );
    }

    forceHidden(){
        this.setState({
            forceHidden: true
        })
    }

    async check(){
        let visible = false;
        var pending = {
            imageDownloads : await this.getPendingDownloads('image'),
            videoDownloads : await this.getPendingDownloads('video'),
            imageUploads : await this.getPendingUploads('image'),
            videoUploads : await this.getPendingUploads('video'),
        };
        pending.total = pending.imageUploads+pending.imageDownloads+pending.videoUploads+pending.videoDownloads;
        if(pending.total!==0){
            visible = true;
        }
        this.setState({
            pending,
            visible
        })
    }

    async getPendingDownloads(type){
        let ret = await noteManager.countNotes([{
                key: 'type',
                val: type,
            },{
                key: 'uploaded',
                val: true
            },{
                key: 'downloaded',
                val: true,
                type: '!=='
            }]);
        return ret;
    }

    async getPendingUploads(type){
        let profile = await profileManager.getProfile();
        let ret =  await noteManager.countNotes([{
                key: 'type',
                val: type
            },{
                key: 'uploaded',
                val: false
            },{
                key: 'user_id',
                val: profile.id
            },{
                key: 'syncronized',
                val: true
            }]);
        return ret;
    }

    generateText(){
        let pending = this.state.pending;
        if((pending.imageDownloads!==0)||(pending.videoDownloads!==0)){
            if(pending.imageDownloads===0){
                return "Descargando "+pending.videoDownloads+" videos";
            }
            if(pending.videoDownloads===0){
                return "Descargando "+pending.imageDownloads+" imágenes";
            }
            return "Descargando "+pending.imageDownloads+" imágenes y "+pending.videoDownloads+" videos";
        }
        if(pending.imageUploads===0){
            return "Subiendo "+pending.videoUploads+" videos";
        }
        if(pending.videoUploads===0){
            return "Subiendo "+pending.imageUploads+" imágenes";
        }
        return "Subiendo "+pending.imageUploads+" imágenes y "+pending.videoUploads+" videos";
    }
}
