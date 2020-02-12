import React from 'react';
import { Text, View, TextInput, FlatList, Image, TouchableHighlight } from 'react-native';
import { Share } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import ModalConfirmation from '../lib/components/ModalConfirmation';
import ModalNeedRegistered from '../lib/components/ModalNeedRegistered';

import BaseComponent from '../lib/BaseComponent.js';
import IconButton from '../lib/components/IconButton';
import {profileManager} from '../lib/ProfileManager';
import {kidManager} from '../lib/KidManager';
import {changeLog} from '../lib/ChangeLog';


export default class TutorList extends BaseComponent{

    constructor(props) {
        super(props);
        this.share = this.share.bind(this);
        this.state = {
            kid: props.child,
            editors: [],
            confirmationMessage: "",
            confirmationVisible: false
        };
        this._renderItem   = this._renderItem.bind(this);
        this._keyExtractor = this._keyExtractor.bind(this);
    }

    componentDidMount(){
        this.loadEditors();
    }

    async loadEditors(){
        let editors = [];
        let kid     = kidManager.getChild(this.state.kid.id);
        if(kid.editors!==undefined){
            if(kid.editors.length!==0){
                for(let editorId of kid.editors){
                    let editor = profileManager.getUserProfile(editorId);
                    editors.push(editor);
                }
            }
        }
        this.setState({editors});
    }

    render() {
        var empty   = null;
        if(this.state.editors.length===0){
            empty = this._renderEmptyList();
        }
        return (
            <View style={{flex: 1}}>
                <ModalConfirmation
                    visible={this.state.confirmationVisible}
                    message={this.state.confirmationMessage}
                    onCancel={()=>this._hideModal()}
                    onConfirm={()=> this.removeTutor()}
                />
                <ModalNeedRegistered
                    visible={this.state.modalRegisterVisible}
                    onClose={()=>this.setState({modalRegisterVisible:false})}
                />
                <View style={{flexDirection:"row", position:'absolute', bottom:20, right:0}}>
                    <IconButton icon="md-share" type='inverted' size={30} color="#fff" onPress={()=>this.share()}/>
                </View>
                {empty!==null
                    ?
                    empty
                    :
                    <View>
                        <FlatList
                            inverted
                            data={this.state.editors}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                            />
                    </View>
                }
            </View>
        );
    }

    _keyExtractor(item, index){
        return item.id;
    }

    _renderItem({item, index}) {
        let profile = item;
        let picture = <Image
            style={{ margin:20, width:80, height:80, borderRadius: 60, borderWidth: 5}}
            source={require("../assets/if_kid_1930420.png")}
        />;
        if(profile.picture!==null){
            picture = <Image source={{uri: profile.picture.path }} style={{ margin:20, width:100, height:100, borderRadius: 50, borderWidth: 5, borderColor: '#ddd' }} />;
        }
        let name = profile.name;

        return (
            <View key={profile.id} style={{backgroundColor:"#fff", borderWidth:1, borderColor:"#ddd", width:'94%', margin:'3%', marginBottom:0}}>
                <View>
                    <TouchableHighlight
                        style={{paddingLeft:0, paddingRight:0, marginRight:0,marginTop:0}}
                        underlayColor="#fff"
                        onPress={()=> this.showProfile(profile.id)}>
                        <View style={this.theme.styles.global_fltListItem}>
                            <View style={this.theme.styles.global_fltImgBox}>
                                {picture}
                            </View>
                            <View style={this.theme.styles.global_fltDesc}>
                                <Text style={{margin:10, marginTop:40, fontSize:21, width:'60%', fontWeight: 'bold', color:"#333", flexWrap: "wrap"}}>{name}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={{position:"absolute", top:0, right:5,width:30,flexDirection:'row', zIndex:124}}>
                    <TouchableHighlight
                        style={{paddingLeft:0, paddingRight:0, marginRight:0,marginTop:0}}
                        underlayColor="#fff"
                        onPress={()=> this.showDeleteConfirmation(profile.id)}>
                            <Icon name="md-close-circle" size={30} color="#333" />
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

    _renderEmptyList(){
        let kid = this.state.kid;
        return (
            <View style={{padding:20, width:'80%', margin:'10%', backgroundColor:"#fff", borderColor:"#ddd", borderWidth:2}}>
                <Text style={{fontSize:20, fontWeight:'bold'}}>Aún no has compartido los cuidados de {kid.name} con nadie</Text>
                <Text style={{fontSize:16, marginTop:10}}>Pulsa el botón de la esquina inferior para compartir los cuidados de {kid.name} con más personas</Text>
            </View>);
    }

    showProfile(userId){
        Actions.tutorHome({userId:userId})
    }

    async removeTutor(profileId){
        var kid     = this.state.kid;
        changeLog.log('remove-editor', {
            kid_id:    kid.id,
            editor_id: this.state.currentEditorId
        });
        kidManager.removeEditor(kid.id, this.state.currentEditorId);
        this.setState({
            confirmationVisible: false,
        });
        this.loadEditors();
    }

    showDeleteConfirmation(profileId){
        var editor = null;
        for(let auxEditor of this.state.editors){
            if(auxEditor.id === profileId){
                editor = auxEditor;
            }
        }
        if(editor===null){
            return;
        }
        let message = "Vas a eliminar a "+editor.name+" como tutor. ¿Estas segur@ de continuar?";
        this.setState({
            confirmationVisible: true,
            confirmationMessage: message,
            currentEditorId: profileId
        });
    }

    _hideModal(){
        this.setState({confirmationVisible:false});
        this.loadEditors();
    }

    async share(){
        try{
            var profile = await profileManager.getProfile();
            if(!profile.confirmed){
                this.setState({modalRegisterVisible:true});
                return;
            }
            var kid     = this.state.kid;
            var token   = await kidManager.getShareToken(kid);

            var urlToken = 'https://babyhelper.info/shared/'+token;

            Share.share({
                message: profile.name+' quiere compartir contigo las notas de '+kid.name+' '+urlToken,
                url: urlToken,
                title: "Notas de "+kid.name
             }, {
                dialogTitle: 'Compartir notas de '+kid.name
            });
        }catch(e){
            console.log(e);
        }
    }
}
