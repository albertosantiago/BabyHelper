import React from 'react';
import {
Text, View, NativeModules,
TextInput, Image, ScrollView,
Alert
} from 'react-native';

import { Actions } from 'react-native-router-flux';

import BaseComponent from '../../lib/BaseComponent.js';
import IconButton from '../../lib/components/IconButton';
import WCInput from '../../lib/components/WCInput';
import WCAccordion from '../../lib/components/WCAccordion';
import WCPersonCheck from '../../lib/components/WCPersonCheck';
import MyTimePicker from "../../lib/components/MyTimePicker";
import ModalMessage from '../../lib/components/ModalMessage';
import {noteManager} from '../../lib/NoteManager.js';
import {profileManager} from '../../lib/ProfileManager';
import {kidManager} from '../../lib/KidManager';
import KidSelector from '../../lib/components/KidSelector';
import VideoPlayer from '../../lib/components/VideoPlayer';
import RNThumbnail from 'react-native-thumbnail';
import WCErrors from '../../lib/components/WCErrors';
import Exif from 'react-native-exif';
import * as mime from 'react-native-mime-types';
import BaseLightbox from '../../lib/components/BaseLightbox';

var binaryToBase64 = require('binaryToBase64');
var RNFS           = require('react-native-fs');
const md5          = require('js-md5');
var ImagePicker    = NativeModules.ImageCropPicker;

export default class MediaForm extends BaseComponent{

    constructor(props) {
        super();
        var date = new Date();
        this.state = {
            date: date,
            text: null,
            picture: null,
            childs:[],
            selectedPeople:[],
            errors:{},
            type: "image",
            currentChild: props.child
        };
        this._pickPicture = this._pickPicture.bind(this);
        this._pickCamara  = this._pickCamara.bind(this);
        this._pickVideo   = this._pickVideo.bind(this);
        this.setImage = this.setImage.bind(this);
        this.setVideo = this.setVideo.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount(){
        kidManager.getAllChilds().then((childs)=>{
            this.setState({childs});
            if(this.state.currentChild!==undefined){
                this.setSelected(this.state.currentChild);
            }
        })
    }

    render() {
        var media = this._getMedia();
        return (
            <BaseLightbox type="confirm" onConfirm={this.save}  horizontalPercent={0.9} verticalPercent={0.95} handler={(baseLightbox)=> this.setState({baseLightbox})}>
                <ScrollView style={{backgroundColor:"#fff", paddingLeft:"2%", paddingRight:"2%", width:'96%'}}>
                    <ModalMessage type="success" onPress={()=> this._hideModal()} message={this.state.modalText} visible={this.state.modalVisible} />
                    <View style={{alignItems:'center',width:'100%', paddingTop:30, paddingBottom:0}}>
                        {media}
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center", backgroundColor:"white", padding:10, paddingTop:5, justifyContent:'center'}}>
                        <IconButton icon="md-camera" size={30} type="primary" color="white" onPress={this._pickCamara} />
                        <IconButton icon="md-images" size={30} type="primary" color="white" onPress={this._pickPicture} style={{marginLeft:0}} />
                        <IconButton icon="md-videocam" size={30} type="primary" color="white" onPress={this._pickVideo} style={{marginLeft:0}} />
                    </View>
                    <View>
                        <WCErrors errors={this.state.errors} />
                    </View>
                    <View style={{width:"90%", marginLeft:"5%"}}>
                        <WCAccordion label="Etiquetar bebes">
                            {this.renderRelatedPersons()}
                        </WCAccordion>
                    </View>
                    <View style={{width:"90%", marginLeft:"5%"}}>
                        <WCAccordion label="Añadir Comentario">
                            <WCInput
                                containerStyle={{width:"100%"}}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                error={this.state.errors.text}
                                multiline={true}
                                maxLength={400}
                                numberOfLines={12}
                                value={this.state.text}
                                onChangeText={(text)=> this.setState({text})}
                                style={{width:"100%", height: 200,  backgroundColor: '#fff', fontSize:18, borderColor:"#ddd", borderWidth:1, textAlignVertical: "top", borderRadius:10 }} />
                        </WCAccordion>
                    </View>
                    <View style={{flexDirection:'column', alignItems:'flex-start', padding:0, paddingTop:15}}>
                        <MyTimePicker date={this.state.date} onChange={(date)=> this.setState({date})}/>
                    </View>
                </ScrollView>
            </BaseLightbox>
        );
    }

    _getMedia(){
        var media = <Image
            style={{width:162, height:135}}
            source={require("../../assets/image_blank3.png")}
        />;

        if(this.state.type==='image'){
            if((this.state.picture!==undefined)&&
              (this.state.picture!==null)){
                  let width = 200;
                  let height = (200/this.state.picture.width)*this.state.picture.height;
                  return <Image source={{uri: this.state.picture.path }} style={{width, height}} />;
            }
        }
        if(this.state.type==='video'){
            if((this.state.video!==undefined)&&
              (this.state.video!==null)){
                  let width = 200;
                  let height = (200/this.state.video.width)*this.state.video.height;
                  return <VideoPlayer
                            video={this.state.video}
                            width={width}
                            height={height}
                        />;
            }
        }
        return media;
    }

    async _pickPicture(){
        await  ImagePicker.openPicker({
           width: 300,
           height: 300,
           cropping: false,
           cropperCircleOverlay: false,
           compressImageMaxWidth: 1280,
           compressImageMaxHeight: 960,
           compressImageQuality: 1,
           includeExif: true,
           mediaType: "photo",
         }).then(image => {
             this.setImage(image);
         }).catch(e => {
           if(e.code !=="E_PICKER_CANCELLED"){
               Alert.alert(e.message ? e.message : e);
           }
        });
    }

    async _pickVideo(){
        await ImagePicker.openPicker({
          width: 300,
          height: 300,
          cropping: false,
          cropperCircleOverlay: false,
          compressImageMaxWidth: 1280,
          compressImageMaxHeight: 960,
          compressImageQuality: 1,
          compressVideoPreset: 'HighQuality',
          includeExif: true,
          mediaType: "video",
      }).then(video => {
            RNFS.stat(video.path).then((fileStats)=>{
                if(fileStats.size>(145*1024*1024)){
                    errors = {
                        maxSize: "El video supera el tamaño permitido de 120M"
                    };
                    this.setState({errors});
                }else{
                    this.setVideo(video);
                    /**
                    RNThumbnail.get(video.path).then((result) => {
                        Exif.getExif(result.path).then((data)=>{
                            let thumb = {
                                filePath: result.path,
                                width:    data.ImageWidth,
                                height:   data.ImageHeight,
                                exif:     data.exif,
                                mime:     mime.lookup(result.path)
                            };
                            video.thumb = thumb;
                            this.setVideo(video);
                        });
                        //Otra posible futura opción
                        RNFS.readFile(result.path, 'base64').then((data)=>{
                            var base64Icon = "data:image/jpeg;base64," + data;
                            video.thumb = base64Icon;
                            this.setVideo(video);
                        });
                    });
                    **/
                }
            });
        }).catch(e => {
            if(e.code !=="E_PICKER_CANCELLED"){
                Alert.alert(e.message ? e.message : e);
            }
       });
    }

    async _pickCamara(){
        await ImagePicker.openCamera({
          width: 300,
          height: 300,
          cropping: false,
          cropperCircleOverlay: false,
          compressImageMaxWidth: 1280,
          compressImageMaxHeight: 960,
          compressImageQuality: 1,
          includeExif: true,
        }).then(image => {
            this.setImage(image);
        }).catch(e => {
            if(e.code !=="E_PICKER_CANCELLED"){
                Alert.alert(e.message ? e.message : e);
            }
       });
    }

    setImage(image){
        let timestamp = parseInt(image.modificationDate);
        var date = new Date(timestamp);
        this.setState({
            picture:image,
            date:  date,
            type: "image"
        });
    }

    setVideo(video){
        var date = new Date();
        this.setState({
            video,
            date,
            type: 'video'
        });
    }

    renderRelatedPersons(){
        let people = this.getPeople();
        return (
            <View style={{width:"98%", margin:"1%", marginTop:10, marginBottom:20}}>
            {
                people.map((person)=>{
                    return (
                        <WCPersonCheck key={person.id} person={person} onCheck={(person)=>this.setSelected(person)} onUncheck={(person)=>this.unselectPerson(person)}/>
                    );
                })
            }
            </View>
        );
    }

    getPeople(){
        let people = [];
        let childs  = this.state.childs;
        for(let child of childs){
            child.type = 'kid';
            child.checked = false;
            people.push(child);
            /**
            if((child.editors!== undefined) &&
               (child.editors.length>0)){
                for(let editor of child.editors){
                    let user = profileManager.getUserProfile(editor);
                    user.type = 'adult';
                    user.checked = false;
                    people.push(user);
                }
            }
            let user = profileManager.getUserProfile(child.user_id);
            user.checked = false;
            people.push(user);
            **/
        }
        for(let person of people){
            this.state.selectedPeople.forEach((selected)=>{
                if(selected.id===person.id){
                    person.checked = true;
                }
            });
        }
        people = people.filter((value, index, self)=>{
            return self.findIndex((element)=>{
                return element.id===value.id;
            }) === index;
        });
        return people;
    }

    setSelected(person){
        let selectedPeople = this.state.selectedPeople;
        selectedPeople.push(person);
        this.setState({selectedPeople});
    }

    unselectPerson(unselectPerson){
        let aux = [];
        this.state.selectedPeople.forEach((person)=>{
            if(person.id!==unselectPerson.id){
                aux.push(person);
            }
        });
        this.setState({
            selectedPeople: aux
        });
    }

    validate(){
        let errors = {};
        if(this.state.type==='image'){
            if(this.state.picture===null){
                errors.image = "No has seleccionado ninguna imagen";
            }
        }else{
            if(this.state.video===null){
                errors.video = "No has seleccionado ningún video";
            }
        }

        if(this.state.selectedPeople.length===0){
            errors.non_selected = "Tienes que seleccionar un bebe como mínimo";
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

    save(){
        if(!this.validate()){
            return;
        }
        let relatedChildIds = [];
        let relatedAdultIds = [];
        for(let person of this.state.selectedPeople){
            if(person.type==='adult'){
                relatedAdultIds.push(person.id);
            }else{
                relatedChildIds.push(person.id)
            }
        }

        if(this.state.type==='image'){
            this.saveImage(relatedChildIds);
        }else{
            this.saveVideo(relatedChildIds);
        }
        let text = "¡La imagen se salvo con éxito!";
        if(this.state.type==='video'){
            text = "El video se salvo con éxito";
        }
        this.setState({
            editing:false,
            modalText: text,
            modalVisible: true,
            modalType: "success"
        });
    }

    saveImage(relatedChilds){
        let note = {
            kid_ids:  relatedChilds,
            type:     "image",
            picture:  this.state.picture,
            text:     this.state.text,
            date:     this.state.date,
            uploaded: false,
        };
        noteManager.addNote(note);
    }

    saveVideo(relatedChilds){
        let note = {
            kid_ids:  relatedChilds,
            type:     "video",
            video:    this.state.video,
            text:     this.state.text,
            date:     this.state.date,
            uploaded: false,
        };
        noteManager.addNote(note);
    }

    _hideModal(){
        if(this.props.child!==undefined){
            Actions.jump('mediaList', {child:this.props.child});
        }else{
            Actions.jump('mediaList');
        }
    }

}
