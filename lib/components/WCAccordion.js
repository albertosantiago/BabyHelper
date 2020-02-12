import React from 'react';
import {Text, View, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BaseComponent from '../BaseComponent.js';

export default class WCAccordion extends BaseComponent {

    constructor(props){
        super(props);
        this.state = {
            visible: false
        }
    }

    componentDidMount() {}

    render() {
        let icon = (this.state.visible) ? 'md-arrow-dropdown':'md-arrow-dropright';
        return (
            <View>
                <TouchableHighlight onPress={()=>this.changeVisibility()} underlayColor="#FFF">
                    <View style={{flexDirection:'row'}}>
                        <Icon name={icon} size={40} style={{marginTop:0, marginRight:15, color:"#000"}} />
                        <Text style={{fontWeight:'bold', fontSize:20, paddingBottom:20, marginTop:5, color:"#000"}}>{this.props.label}</Text>
                    </View>
                </TouchableHighlight>
                {(this.state.visible) &&
                    <View>
                        {this.props.children}
                    </View>
                }
            </View>
        );
    }

    changeVisibility(){
        let visible = !this.state.visible;
        this.setState({visible})
    }
}
