import React from 'react';
import { Text, View, TouchableOpacity} from 'react-native';
import BaseComponent from '../BaseComponent.js';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Lightbox extends BaseComponent {

    constructor(){
        super();
        this.state = {
            active: false
        };
    }

    componentDidMount() {}

    render() {
        if(this.state.active){
            return this._renderActive();
        }
        return (
            <TouchableOpacity
                onPress={()=>this.setActive()}
                >
                <View>
                    {this.props.children}
                </View>
            </TouchableOpacity>);
    }

    setActive(){
        this.setState({active:true});
        this.props.onOpen();
    }

    setUnactive(){
        this.setState({active:false});
        this.props.onClose();
    }

    _renderActive(){
        return (
            <Modal
                isVisible={this.state.active}
                animationIn={'slideInLeft'}
                animationOut={'slideOutLeft'}
                >
                <View style={{flex:1, justifyContent:'center'}}>
                    {this._renderHeader()}
                    {this.props.children}
                </View>
            </Modal>);
    }

    _renderHeader(){
        return (
            <View style={{position:'absolute', top:0, right:0, zIndex:100}}>
                <TouchableOpacity onPress={()=>this.setUnactive()}>
                    <Icon name="md-close" size={30} color="#fff" />
                </TouchableOpacity>
            </View>
        );
    }


}
