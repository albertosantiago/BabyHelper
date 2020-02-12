import React from 'react';
import { Text, View, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BaseComponent from '../BaseComponent.js';

export default class IconButton extends BaseComponent {

    constructor(props){
        super(props);
        this.state = {
            icon: "md-checkmark-circle",
            size: 64,
            style: null,
            type: 'default'
        }

        if(props.icon!==undefined){
            this.state.icon = props.icon;
        }
        if(props.size!==undefined){
            this.state.size = props.size;
        }
        if(props.style!==undefined){
            this.state.style = props.style;
        }
        if(props.type!==undefined){
            this.state.type = props.type;
        }
    }

    componentDidMount() {}

    render() {
        let underlayColor="#fff";
        let touchableStyle = {margin:20};
        let iconColor = "#000";

        if(this.state.type==='primary'){
            touchableStyle = {justifyContent:'space-around', margin:20, width:(this.state.size*2), height:(this.state.size*2), alignItems:'center', backgroundColor:this.theme.colors.primary, borderRadius:this.state.size, borderColor:this.theme.colors.primary_dark, borderWidth:1 };
            underlayColor  = this.theme.colors.primary;
            iconColor      = "#fff";
        }
        if(this.state.type==='inverted'){
            touchableStyle = {justifyContent:'space-around', margin:20, width:(this.state.size*2), height:(this.state.size*2), alignItems:'center', backgroundColor:'#000', borderRadius:this.state.size, borderColor:"#000", borderWidth:2 };
            underlayColor  = '#000';
            iconColor      = "#fff";
        }
        if(this.state.style!==null){
            touchableStyle = [touchableStyle, this.state.style];
        }
        if(this.props.border==='none'){
            touchableStyle.borderWidth = 0;    
        }

        return (
            <TouchableHighlight onPress={this.props.onPress} underlayColor={underlayColor} style={touchableStyle} >
                <Icon name={this.state.icon} size={this.state.size} color={iconColor} />
            </TouchableHighlight>
        );
    }

}
