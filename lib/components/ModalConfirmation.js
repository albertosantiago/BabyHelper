import React from 'react';
import { Text, View }from 'react-native';
import BaseComponent from '../BaseComponent.js';
import Modal from 'react-native-modal';
import Button from './Button';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Message extends BaseComponent {

    constructor(props){
        super(props);
        this.state = {
            type: props.type,
            onPress:props.onPress,
            message:props.message,
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

    componentDidMount(){}

    render(){
        return (
            <View>
                {(this.props.visible)&&
                    <Modal
                      isVisible={this.props.visible}
                      animationIn={'slideInLeft'}
                      animationOut={'slideOutRight'}
                    >
                        <View style={this.theme.styles.note_list_modal_content}>
                            <Text style={{margin:20, fontSize:21, fontWeight:"bold", textAlign:"center"}}>{this.props.message}</Text>
                            <View style={{flexDirection:"row"}}>
                                <Button
                                    style={this.theme.styles.global_danger_button}
                                    onPress={() => {this.props.onCancel()}}
                                    >
                                        <Text  style={this.theme.styles.global_danger_button_text}>Cancelar</Text>
                                </Button>
                                <Button
                                    style={this.theme.styles.global_success_button}
                                    onPress={() => {this.props.onConfirm()}}
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

}
