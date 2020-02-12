'use strict';

import React, {
  Component
} from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';

import Video from 'react-native-video';
import Modal from 'react-native-modal';
import {Dimensions, Platform} from 'react-native';
import Orientation from 'react-native-orientation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class VideoPlayer extends Component {

  constructor(props){
      super(props);
      this.state = {
          rate: 1,
          volume: 1,
          muted: false,
          resizeMode: 'cover',
          duration: 0.0,
          currentTime: 0.0,
          paused: true,
          orientation: 'PORTRAIT',
      };
      this.video = Video;
      this.changeState   = this.changeState.bind(this);
      this.setFullScreen = this.setFullScreen.bind(this);
      this.setFluidOrientation   = this.setFluidOrientation.bind(this);
      this.unsetFluidOrientation = this.unsetFluidOrientation.bind(this);
      this._renderModal = this._renderModal.bind(this);
  }

  onLoad = (data) => {
    this.setState({ duration: data.duration });
  };

  onProgress = (data) => {
    this.setState({ currentTime: data.currentTime });
  };

  onEnd = () => {
    this.setState({ paused: true })
    this.video.seek(0)
  };

  onAudioBecomingNoisy = () => {
    this.setState({ paused: true })
  };

  onAudioFocusChanged = (event: { hasAudioFocus: boolean }) => {
    this.setState({ paused: !event.hasAudioFocus })
  };

  getCurrentTimePercentage() {
    if (this.state.currentTime > 0) {
      return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
    }
    return 0;
  };

  render(){
    return (
        <View style={{width:this.props.width, height:this.props.height}}>
            { (!this.state.fullScreen) ?
                this._renderPoster()
                :
                this._renderModal()
            }
         </View>
      );
  }

  _renderPoster(){
      let playTop = (this.props.height/2)-40;
      return (
          <TouchableOpacity
            onPress={()=>this.setFullScreen()}
            >
                <View style={{width:this.props.width, height:this.props.height, backgroundColor:"#000"}}>
                    <Image
                        source={{uri: this.props.video.path }}
                        style={{width:this.props.width, height:this.props.height}}
                        />
                    <View style={{position:'absolute', top:playTop, left:0, width:"100%", alignItems:'center'}}>
                        <Icon name="play-circle-outline" size={80} color="#eee" />
                    </View>
                </View>
         </TouchableOpacity>
     );
  }

  _renderModal(){
      const flexCompleted = this.getCurrentTimePercentage() * 100;
      const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
      let {width, height} = this._getVideoDimensions(this.props.video);

      return (
       <Modal
            isVisible={this.state.fullScreen}
            animationIn={'slideInLeft'}
            animationOut={'slideOutRight'}
        >
          <View style={{flex:1,padding:0, margin:0, width:"100%", height:"100%", alignItems:'center', justifyContent:'center'}}>
              <TouchableOpacity
                style={{}}
                onPress={() => this.setState({ paused: !this.state.paused })}
              >
                <Video
                  ref={(ref: Video) => { this.video = ref }}
                  style={{width,height}}
                  source={{ uri: this.props.video.path}}
                  rate={this.state.rate}
                  paused={this.state.paused}
                  volume={this.state.volume}
                  muted={this.state.muted}
                  resizeMode={this.state.resizeMode}
                  onLoad={this.onLoad}
                  onProgress={this.onProgress}
                  onEnd={this.onEnd}
                  onAudioBecomingNoisy={this.onAudioBecomingNoisy}
                  onAudioFocusChanged={this.onAudioFocusChanged}
                  repeat={false}
                />
              </TouchableOpacity>
              <View style={styles.controls}>
                <View style={styles.trackingControls}>
                  <View style={styles.progress}>
                    <View style={[styles.innerProgressCompleted, { flex: flexCompleted }]} />
                    <View style={[styles.innerProgressRemaining, { flex: flexRemaining }]} />
                  </View>
                </View>
              </View>
              <View style={{position:'absolute', top:0, right:0}}>
                <TouchableOpacity
                    onPress={()=>this.unsetFullScreen()}
                >
                    <Icon name="close-circle" size={30} color="#eee" />
                </TouchableOpacity>
              </View>
          </View>
        </Modal>);
    }

    setFullScreen(){
        this.setState({ fullScreen: true, paused: false });
        this.setFluidOrientation();
    }

    unsetFullScreen(){
        this.setState({ fullScreen: false, paused: true });
        this.unsetFluidOrientation();
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

    changeState(orientation){
        this.setState({orientation});
    }

    _getVideoDimensions(video){
        const {height, width} = Dimensions.get('window');

        var thumbWidth  = 0;
        var thumbHeight = 0;

        if(width<height){
            thumbWidth  = width*0.80;
            thumbHeight = (thumbWidth/video.width)*video.height;
        }else{
            thumbHeight = height*0.80;
            thumbWidth  = (thumbHeight/video.height)*video.width;
        }
        return {height:thumbHeight, width:thumbWidth};
    }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  controls: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    position: 'absolute',
    bottom: "10%",
    left: 20,
    right: 20,
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  innerProgressCompleted: {
    height: 12,
    backgroundColor: '#cccccc',
  },
  innerProgressRemaining: {
    height: 12,
    backgroundColor: '#2C2C2C',
  },
  generalControls: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    paddingBottom: 10,
  },
  rateControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  volumeControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resizeModeControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlOption: {
    alignSelf: 'center',
    fontSize: 11,
    color: 'white',
    paddingLeft: 2,
    paddingRight: 2,
    lineHeight: 12,
  },
});
