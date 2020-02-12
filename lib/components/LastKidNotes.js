import React from 'react';
import { Text, View, Image, TouchableHighlight, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import BaseComponent from '../BaseComponent.js';
import IconButton from './IconButton';
import StatusIndicator from './StatusIndicator';
import {kidManager} from '../KidManager.js';
import {noteManager} from '../NoteManager.js';
import {profileManager} from '../ProfileManager.js';
import {eventApp} from "../EventApp.js";
import {cron} from "../Cron.js";

import {NOTE_TYPES, IMAGES} from '../Constants';

const CRON_KEY = "last-kid-notes";

export default class KidItem extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            lastNotes: [],
            currentKid: props.child,
            currentProfile: undefined,
        };
        if((props.child.editors!==undefined)
            &&(props.child.editors.length>0)){
            this.state.multiuser = true;
        }
        this.mounted = true;
        this.CRON_KEY = CRON_KEY+"-"+ Math.floor(Math.random() * (10000000));
    }

    componentDidMount() {
        cron.register(()=>{
            if(this.mounted){
                this.loadNotes();
            }
        }, 3, this.CRON_KEY);
        profileManager.getProfile().then((currentProfile)=>{
            this.setState({currentProfile});
            this.loadNotes();
        });
    }

    componentWillUnmount() {
        cron.unregister(this.CRON_KEY);
        this.mounted = false;
        this.removeListeners();
    }

    loadNotes(){
        var currentKidId = this.state.currentKid.id;
        var lastNotes = [];
        for(let type of NOTE_TYPES){
            let key   = type.key;
            let notes = noteManager.getNotes([{
                key:  'kid_ids',
                val:  currentKidId,
                type: 'indexOf'
            },{
                key: 'type',
                val: key
            }],{
                size:5
            });
            if(notes.length>0){
                lastNotes.push(notes[0]);
            }
        }
        lastNotes.sort(function(itemA, itemB){
            if (itemA.date < itemB.date)
               return 1;
            if(itemA.date > itemB.date)
               return -1;
            return 0;
        });
        this.setState({
            lastNotes
        });
    }

    render(){
        if(this.state.lastNotes.length===0){
            return <View></View>;
        }
        var cont = 0;
        return (
            <View style={{padding:15}}>
                {this.state.lastNotes.map((note) => {
                    let borderTop = true;
                    if(cont==0){
                        borderTop = false;
                        cont++;
                    }
                    return this.renderLastNoteItem(note, borderTop);
                })}
            </View>
        );
    }

    renderLastNoteItem(note){
        let type = note.type;
        let time = new Date(note.date).getTime();
        var diff = this.getDiffTime(note.date);

        let key  = note.type+"_"+time;
        let source = "";
        let text   = "";

        if(type=='feed'){
            source = IMAGES.feed;
            if(note.feedType==='breast'){
                let breast = (note.breast==='left') ? 'izquierdo':'derecho';
                text  = "Tomó del pecho "+breast;
            }
            if(note.feedType==='pap'){
                text  = "Tomó "+note.papName;
            }
            if(note.feedType==='bottle'){
                text  = "Toma de "+note.feedAmount+" cc de biberón";
            }
        }
        if(type=='medicine'){
            source= IMAGES.medicine;
            text = "Tomó "+note.medicineName;
        }
        if(type=='cleaning'){
            source= IMAGES.cleaning;
            text = "Tuvo un cambio ";
        }
        if(type=='personal'){
            source= IMAGES.personal;
            text = note.text;
        }
        if(type=='weight'){
            source = IMAGES.weight;
            text = "Pesó "+note.weight+" Kg";
        }
        if(type=='height'){
            source = IMAGES.height;
            text = "Midió "+note.ctm+" ctm de altura";
        }
        if(type=='temperature'){
            source = IMAGES.temperature;
            text   = "Tenía " +(note.temp/10)+"º de temperatura";
        }
        if(type=='bath'){
            source = IMAGES.bath;
            text   = "Recibió un baño";
        }
        if(type=='dream'){
            if(note.noteType==='wakeup'){
                source = IMAGES.wakeup;
                text   = "Se levanto";
            }else{
                source = IMAGES.bed_down;
                text   = "Se acostó";
            }
        }

        let ownerName = "Tú";
        if(this.state.currentProfile.id!==note.user_id){
            let ownerProfile = profileManager.getUserProfile(note.user_id);
            ownerName = ownerProfile.name;
        }
        let owner = ownerName+", hace "+diff;

        if(text===""){
            return <View key={key}></View>;
        }

        let fontWeight = 'normal';
        let diffMinutes = this.getDiffMinutes(note.date);
        if(diffMinutes<=60){
            fontWeight = 'bold';
        }

        return (
            <View key={key} style={{padding:0, paddingTop:15}}>
                <View style={{flexDirection:"row"}}>
                    <Image
                        style={{ margin:0,marginRight:10, width:35, height:35}}
                        source={source}
                    />
                    <View style={{flexDirection:'column', width:'90%'}}>
                        <Text style={{marginTop:0, fontSize:16, flexWrap: "wrap", width:'90%', fontWeight}}>{text}</Text>
                        <Text style={{fontSize:12, width:'100%', fontWeight}}>{owner}</Text>
                    </View>
                </View>
            </View>);
    }

    getDiffTime(date){
        let lastDate = new Date(date);
        let now  = new Date();
        let diffHours = Math.round((now.getTime()-lastDate.getTime())/3600000);
        let diffMinutes = 0;
        let ret = "";
        if(diffHours>1){
            ret = diffHours+" horas";
        }else{
            ret = diffHours+" hora";
        }

        if(diffHours==0){
            let diffMinutes = Math.round((now.getTime()-lastDate.getTime())/60000);
            ret = diffMinutes+" minutos";
            if(diffMinutes==0){
                ret = "unos segundos"
            }
        }
        if(diffHours>24){
            let diffDays = Math.round(diffHours/24);
            let restHours = diffHours%24;
            ret = diffDays+" dias";
            if(restHours>0){
                ret = ret + " y "+restHours+" horas";
            }
        }
        return ret;
    }

    getDiffMinutes(date){
        let lastDate = new Date(date);
        let now  = new Date();
        return Math.round((now.getTime()-lastDate.getTime())/60000);
    }
}
