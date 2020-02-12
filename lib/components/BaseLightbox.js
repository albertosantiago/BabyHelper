import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Animated, Dimensions, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Button from './Button';
import BaseComponent from '../BaseComponent';

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

export default class BaseLightbox extends BaseComponent {

  static propTypes = {
      children: PropTypes.any,
      horizontalPercent: PropTypes.number,
      verticalPercent: PropTypes.number,
      type: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
    };
    this._renderButton = this._renderButton.bind(this);
    this.onConfirm  = this.onConfirm.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    if(this.props.handler!==undefined){
        this.props.handler(this);
    }
    Animated.timing(this.state.opacity, {
        duration: 100,
        toValue: 1,
    }).start();
  }

  closeModal() {
      let exec = Actions.pop;
      if(this.props.onPress){
          exec = this.props.onPress;
      }
      Animated.timing(this.state.opacity, {
          duration: 500,
          toValue: 0,
      }).start(exec);
  }

  _renderLightBox = () => {
    const { children, horizontalPercent = 1, verticalPercent = 1 } = this.props;
    const height = verticalPercent ? deviceHeight * verticalPercent : deviceHeight;
    const width = (horizontalPercent ? deviceWidth * horizontalPercent : deviceWidth);
    return (
      <View
        style={{
          width,
          height,
          paddingTop:10,
          borderRadius:10,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
      >
        {children}
        {this._renderButton()}
      </View>
    );
  }

    _renderButton(){
      let type = this.props.type;
      let buttonStyle = this.theme.styles.global_primary_button;
      let textStyle   = this.theme.styles.global_primary_button_text
      if(type==="success"){
          buttonStyle =this.theme.styles.global_success_button;
          textStyle   =this.theme.styles.global_success_button_text;
      }
      if((type==='success')||(type==='normal')||(type===undefined)){
         return (
              <Button
                  style={buttonStyle}
                  onPress={this.closeModal}
              >
                  <Text  style={textStyle}>Cerrar</Text>
              </Button>
          );
      }
      if(this.props.type==="confirm"){
          let buttonStyle = this.theme.styles.global_danger_button;
          let textStyle   = this.theme.styles.global_danger_button_text
          buttonConfirmStyle =this.theme.styles.global_success_button;
          textConfirmStyle   =this.theme.styles.global_success_button_text;
          return (
              <View style={{flexDirection:'row'}}>
                  <Button
                      style={buttonStyle}
                      onPress={this.closeModal}
                  >
                      <Text  style={textStyle}>Cancelar</Text>
                  </Button>
                  <Button
                      style={buttonConfirmStyle}
                      onPress={this.onConfirm}
                  >
                      <Text  style={textConfirmStyle}>Salvar</Text>
                  </Button>
             </View>
          );
      }
  }

  async onConfirm(){
     this.props.onConfirm();
  }

  render() {
    return (
      <Animated.View style={[styles.container, { opacity: this.state.opacity }]}>
        {this._renderLightBox()}
      </Animated.View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(52,52,52,0.5)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
