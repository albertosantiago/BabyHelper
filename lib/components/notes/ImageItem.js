import React from 'react';
import {
Text, View, Image,
Dimensions, TouchableHighlight
} from 'react-native';
import BaseComponent from '../../BaseComponent.js';
import BaseItem from './BaseItem';
import Lightbox from '../Lightbox';
import Orientation from 'react-native-orientation';
import Share  from 'react-native-share';
import DateFormatter from '../../util';
import {profileManager} from '../../ProfileManager.js';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import Button from '../Button';
import IconButton from '../IconButton';
import {eventApp} from "../../EventApp.js";
import {noteManager} from '../../NoteManager.js';
import WCDropDown from '../WCDropDown';

export default class ImageItem extends BaseComponent {

    static defaultProps = {
        expanded: false
    }

    constructor(){
        super();
        this.state = {
            orientation: 'PORTRAIT',
            loaded: false
        };
        this.profile = undefined;
        this.changeState = this.changeState.bind(this);
        this.deleteNote  = this.deleteNote.bind(this);
        this.shareImg    = this.shareImg.bind(this);
        this._getMenuOptions = this._getMenuOptions.bind(this);
    }

    componentDidMount() {
        profileManager.getProfile().then((profile)=>{
            this.profile = profile;
            this.setState({
                loaded: true
            })
        });
    }

    showCalendar(note){
        Actions.detailTabs({note:note});
    }

    render() {
        var note     = this.props.note;
        var noteDate = new Date(note.date);
        var day  = DateFormatter.getDayForHumans(noteDate);
        var hour = DateFormatter.getHourForHumans(noteDate);

        if(!this.state.loaded){
            return null
        }

        var options = this._getMenuOptions();

        const activeProps = { resizeMode: 'contain', flex: 1, height };
        let picture = note.picture;

        let {width, height} = this._getThumbDimensions(picture);
        let layoutHeight = 200;
        if(height<200){
            layoutHeight = height-20;
        }

        return (
            <View style={[this.theme.styles.note_list_cell, this.props.layoutContainerStyle,{flexDirection:'column'}]}>
                <View style={{width:'100%'}}>
                    <View style={[{paddingTop:20}, this.props.containerStyle]}>
                        <View style={{height:layoutHeight, justifyContent:'center', zIndex:1, }}>
                            <Lightbox
                                onOpen={()=>this.setFluidOrientation()}
                                onClose={()=>this.unsetFluidOrientation()}>
                                 <Image source={{uri: note.picture.path }}  resizeMode="contain" style={{height}} />
                            </Lightbox>
                        </View>
                    </View>
                </View>
                <View style={{paddingTop:0, flexDirection:'column', zIndex:4, width:'100%'}}>
                    {(note.text)&&
                    <View style={{width:'100%', padding:15, paddingBottom:5}}>
                        <Text style={{width:'100%', flexWrap:'wrap'}}>{note.text}</Text>
                    </View>
                    }
                    <View style={{width:'100%', alignItems:'flex-end', paddingTop:5}}>
                        <Text>{hour} {day} </Text>
                    </View>
                </View>
                <View style={{position:"absolute", top:0, right:5,width:135,flexDirection:'row', zIndex:4}}>
                    <View style={{width:110, alignItems:'flex-start', marginBottom:10,marginTop:3}}>
                        <Text style={{width:100, marginRight:10, textAlign:'right', fontSize:16}}>Tú</Text>
                    </View>
                    <WCDropDown options={options} onChange={(opt)=> opt.onPress() }/>
                </View>
            </View>
        );
    }

    _getMenuOptions(){
        let options = [];
        if(this.props.note.user_id === this.profile.id){
            options.push({
                text: "Eliminar",
                icon: "md-trash",
                onPress: () => { this.deleteNote()}
            });
        }
        options.push({
            text: "Compartir",
            icon: "md-share",
            onPress: () => { this.shareImg()}
        });
        return options;
    }

    shareImg(){
        let options =  {
            title: "Imagen de Mara",
            message: "",
            url: this.props.note.picture.path,
            subject: "Foto de Mara"
        };
        Share.open(options).catch((err) => {
             err && console.log(err);
         });
    }

    async deleteNote(){
        await noteManager.removeNote(this.props.note.id);
    }

    changeState(orientation){
        this.setState({orientation});
    }

    setFluidOrientation(){
        Orientation.unlockAllOrientations();
        Orientation.addOrientationListener(this.changeState);
    }

    unsetFluidOrientation(){
        Orientation.removeOrientationListener(this.changeState);
        Orientation.lockToPortrait();
        //Esta librería debería devolver una promesa o ejecutarse enteramente pero tiene un retraso
        //por lo que tenemos que refrescar al cerrar.
        setTimeout(()=>{
            this.setState({orientation:'PORTRAIT'});
        },200)
    }

    _getThumbDimensions(picture){
        const {height, width} = Dimensions.get('window');

        var thumbWidth  = 0;
        var thumbHeight = 0;

        if(width<height){
            thumbWidth  = width*0.80;
            thumbHeight = (thumbWidth/picture.width)*picture.height;
        }else{
            thumbHeight = height*0.80;
            thumbWidth  = (thumbHeight/picture.height)*picture.width;
        }
        return {height:thumbHeight, width:thumbWidth};
    }
}
