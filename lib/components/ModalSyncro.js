import React from 'react';
import { Text, View, Image }from 'react-native';
import BaseComponent from '../BaseComponent.js';
import Modal from 'react-native-modal';
import Button from './Button';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';

export default class ModalSyncro extends BaseComponent {

    constructor(props){
        super(props);
        this.state = {
            visible:props.visible
        };
        var self = this;
    }

    componentWillReceiveProps (nextProps) {
      if (nextProps.elements !== this.props.elements) {
        this.setState({
          elements: nextProps.elements,
          dataSource: this.state.dataSource.cloneWithRows(nextProps.elements)
        })
      }
    }

    componentDidMount(){
    }

    render(){
        return (
            <View>
                <Modal
                  isVisible={this.props.visible}
                  animationIn={'slideInLeft'}
                  animationOut={'slideOutRight'}
                >
                    <View style={{backgroundColor:'#fafafa', borderRadius:10, padding:15, paddingTop:25, alignItems:'center'}}>
                        <Text style={{margin:5, fontSize:24, fontWeight:'bold', textAlign:"center", color:"#000"}}>Sincronizando datos</Text>
                        <Text style={{margin:5, fontSize:21, textAlign:"center", color:"#000"}}>Por favor, espere un momento...</Text>
                        <View style={{margin:10}}>
                            <Animatable.Image source={require("../../assets/syncro2.gif")} animation="rotate" iterationCount="infinite" duration={800} />
                        </View>
                    </View>
                </Modal>
            </View> );
    }

}
