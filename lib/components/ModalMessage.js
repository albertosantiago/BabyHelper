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
        return this.renderAutoMode();
    }

    renderAutoMode() {
        if(this.props.visible){
            var self = this;
            setTimeout(function(){
                self.props.onPress();
            },1200);
        }

        return (
            <View>
                <Modal
                  isVisible={this.props.visible}
                  animationIn={'slideInLeft'}
                  animationOut={'slideOutRight'}
                >
                    <View style={{backgroundColor:'#fafafa', borderRadius:10, padding:15, paddingTop:25, alignItems:'center'}}>
                        {(this.props.title) &&
                            <Text style={{margin:5, fontSize:24, fontWeight:'bold', textAlign:"center", color:"#000"}}>{this.props.title}</Text>
                        }
                        <Text style={{margin:5, fontSize:21, textAlign:"center", color:"#000"}}>{this.props.message}</Text>
                        <View style={{margin:10}}>
                            <Icon name="md-checkmark-circle" color="#16ab39" size={50} />
                        </View>
                    </View>
                </Modal>
            </View> );
    }

    renderButtonMode(){
        return (
            <View>
                <Modal
                  isVisible={this.props.visible}
                  animationIn={'slideInLeft'}
                  animationOut={'slideOutRight'}
                >
                    <View style={this.theme.styles.form_modal_content}>
                        <Text style={{margin:10, fontSize:21, textAlign:"center"}}>{this.props.message}</Text>
                        <Button
                            style={[this.theme.styles.global_default_button, {backgroundColor: '#16ab39'}]}
                            onPress={this.props.onPress}
                            >
                                <Text style={this.theme.styles.global_default_button_text}>Volver al inicio</Text>
                        </Button>
                    </View>
                </Modal>
            </View> );
    }
}
