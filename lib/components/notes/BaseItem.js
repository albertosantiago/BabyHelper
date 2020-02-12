import React from 'react';
import { Text, View, TouchableHighlight} from 'react-native';
import DateFormatter from '../../util';
import Icon from 'react-native-vector-icons/Ionicons';
import BaseComponent from '../../BaseComponent.js';
import {Actions} from 'react-native-router-flux';
import {profileManager} from '../../ProfileManager.js';
import {noteManager} from '../../NoteManager.js';
import {kidManager} from '../../KidManager.js';
import Modal from 'react-native-modal';
import Button from '../Button';
import {eventApp} from "../../EventApp.js";

export default class BaseItem extends BaseComponent {

    constructor(){
        super();
        this.state = {
            loaded: false,
            profile: undefined,
            kids: undefined
        };
        this.showDeleteOptions = this.showDeleteOptions.bind(this);
        this._deleteNote = this._deleteNote.bind(this);
    }

    componentDidMount() {
        profileManager.getProfile().then((profile)=>{
            let kids = kidManager.getChilds(this.props.note.kid_ids);
            this.setState({
                loaded: true,
                profile: profile,
                kids: kids
            })
        });
    }

    render() {

        if(!this.state.loaded){
            return null
        }

        var note     = this.props.note;
        var noteDate = new Date(note.date);
        var day  = DateFormatter.getDayForHumans(noteDate);
        var hour = DateFormatter.getHourForHumans(noteDate);

        return (
            <View style={[this.theme.styles.note_list_cell, this.props.layoutContainerStyle]}>
                {this._renderModalContent()}
                <View>
                    <View style={[{paddingTop:20,paddingBottom:10}, this.props.containerStyle]}>
                        {this.props.children}
                    </View>
                    <View style={{paddingTop:0, flexDirection:'row', zIndex:4}}>
                        {this._renderKidsInfo()}
                        <View style={{width:'50%', alignItems:'flex-end'}}>
                            <Text>{hour} {day} </Text>
                        </View>
                    </View>
                </View>
                {this._getUserInfo(note)}
            </View>
        );
    }

    _renderKidsInfo(){
        if(this.state.kids.length===0){
            return <View style={{width:'50%', alignItems:'flex-end'}}></View>
        }
        var text = "";
        for(let kid of this.state.kids){
            text += kid.name+" ";
        }
        return (
            <View style={{width:'50%', alignItems:'flex-start'}}>
                <Text>{text}</Text>
            </View>
        );
    }

    _getUserInfo(note){
        let userName = this._getUserName(note);
        return (
                <View style={{position:"absolute", top:0, right:5, width:205, flexDirection:'row', zIndex:4}}>
                    <View style={{width:180, alignItems:'flex-start', marginBottom:10,marginTop:3}}>
                        {userName}
                    </View>
                    <TouchableHighlight
                        style={{paddingLeft:0, paddingRight:0, marginRight:0,marginTop:0}}
                        underlayColor="#fff"
                        onPress={()=> this.showDeleteOptions(note.id)}>
                        <Icon name="md-close-circle" size={25} color="#444" />
                    </TouchableHighlight>
                </View>
        );
    }

    _getUserName(note){
        if(note.user_id === this.state.profile.id){
            return <Text style={{width:170, marginRight:10, textAlign:'right', fontSize:14}}>Tú</Text>;
        }
        let profile = profileManager.getUserProfile(note.user_id);
        return (
            <TouchableHighlight
                onPress={
                    ()=> {
                        Actions.tutorHome({
                            userId: note.user_id
                        });
                    }}
            >
                <Text style={{width:170, marginRight:10, textAlign:'right', fontSize:14}}>{profile.name}</Text>
            </TouchableHighlight>
        );
    }

    showDeleteOptions(noteId){
        this.setState({modalVisible: true, currentNoteId: noteId});
    }

    _renderModalContent(){
        return (
            <View>
                {(this.state.modalVisible)&&
                    <Modal
                      isVisible={this.state.modalVisible}
                      animationIn={'slideInLeft'}
                      animationOut={'slideOutRight'}
                    >
                        <View style={this.theme.styles.note_list_modal_content}>
                            <Text style={{margin:20, fontSize:21, fontWeight:"bold", textAlign:"center"}}>Confirma si quieres eliminar la nota</Text>
                            <View style={{flexDirection:"row"}}>
                                <Button
                                    style={this.theme.styles.global_danger_button}
                                    onPress={() => {this._hideModal()}}
                                    >
                                        <Text  style={this.theme.styles.global_danger_button_text}>Cancelar</Text>
                                </Button>
                                <Button
                                    style={this.theme.styles.global_success_button}
                                    onPress={() => {this._deleteNote()}}
                                    >
                                        <Text  style={this.theme.styles.global_success_button_text}>Eliminar</Text>
                                </Button>
                            </View>
                        </View>
                    </Modal>
                }
            </View>
        );
    }

    async _deleteNote(){
        var noteId  = this.state.currentNoteId;
        await noteManager.removeNote(noteId);
        this._hideModal();
    }

    _hideModal(){
        this.setState({modalVisible:false});
    }

}
