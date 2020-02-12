import React from 'react';
import {
    Text, View, NativeModules,
    Image, TouchableHighlight,
    TouchableOpacity, Alert
} from 'react-native';
import Modal from 'react-native-modal';
import BaseComponent from '../BaseComponent.js';
import Icon from 'react-native-vector-icons/Ionicons';
import {crashLogger} from '../CrashLogger.js';

var ImagePicker = NativeModules.ImageCropPicker;

export default class MyImgPicker extends BaseComponent {

    constructor(props){
        super(props);
        this.state = {
            picture: props.picture,
            defaultPicture: props.defaultPicture,
            imageOptionsVisible: false,
        };
        this._showImageOptions = this._showImageOptions.bind(this);
        this._hideImageOptions = this._hideImageOptions.bind(this);
        this._pickPicture = this._pickPicture.bind(this);
        this._pickCamara  = this._pickCamara.bind(this);
    }

    componentWillReceiveProps (nextProps) {
      if (nextProps.picture !== this.props.picture) {
        this.setState({
            picture: nextProps.picture,
        })
      }
    }

    componentDidMount(){}

    render() {
        var picture = <Image
            style={this.theme.styles.form_comic_picture}
            source={require("../../assets/if_Face_blonde_2099205.png")}
        />;
        if(this.props.type==='kid'){
            picture = <Image
                style={this.theme.styles.form_comic_picture}
                source={require("../../assets/if_kid_1930420.png")}
            />;
        }
        if((this.state.picture!==undefined)&&
          (this.state.picture!==null)){
            picture = <Image source={{uri: this.state.picture.path }} style={this.theme.styles.form_picture} />;
        }
        return (
            <View>
                {this._renderImageOptions()}
                <TouchableOpacity
                    onPress={this._showImageOptions}
                    style={this.theme.styles.form_picture_container}
                >
                {picture}
                </TouchableOpacity>
            </View>
        );
    }

    _showImageOptions(){
        this.setState({imageOptionsVisible:true});
    }

    _hideImageOptions(){
        this.setState({imageOptionsVisible: false});
    }

    _renderImageOptions(){
        return (
            <View>
                <Modal
                  isVisible={this.state.imageOptionsVisible}
                  animationIn={'bounceIn'}
                  animationOut={'bounceOut'}
                  onBackdropPress={this._hideImageOptions}
                >
                    <View style={{flexDirection:"row", alignItems:"center", backgroundColor:"white", padding:15, borderRadius:10, borderWidth:2, justifyContent:'center', borderColor:"#000"}}>
                        <TouchableHighlight onPress={this._pickCamara} style={this.theme.styles.form_picture_button}>
                            <Icon name="md-camera" size={40} color="white" />
                        </TouchableHighlight>
                        <TouchableHighlight onPress={this._pickPicture} style={[this.theme.styles.form_picture_button, {marginLeft:12}]}>
                            <Icon name="md-images" size={40} color="white" />
                        </TouchableHighlight>
                    </View>
                </Modal>
            </View>
            );
    }

    async _pickPicture(){
        await  ImagePicker.openPicker({
           width: 300,
           height: 300,
           cropping: true,
           cropperCircleOverlay: true,
           compressImageMaxWidth: 640,
           compressImageMaxHeight: 480,
           compressImageQuality: 0.5,
           compressVideoPreset: 'MediumQuality',
           includeExif: true,
       }).then((image) => {
             this.setState({ picture: image});
             this.props.onChange(image);
             this._hideImageOptions();
         }, ()=>{
             return;
         }).catch(e => {
             crashLogger.log(err);
        });
    }

    async _pickCamara(){
        await ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
          cropperCircleOverlay: true,
          compressImageMaxWidth: 640,
          compressImageMaxHeight: 480,
          compressImageQuality: 0.5,
          compressVideoPreset: 'MediumQuality',
          includeExif: true,
        }).then((image) => {
            this.setState({ picture: image});
            this.props.onChange(image);
            this._hideImageOptions();
        }, ()=>{
            return;
        }).catch((e) => {
            crashLogger.log(err);
       });
    }

}
