import React from 'react';
import {
    Text, View, TextInput,
    TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BaseComponent from '../BaseComponent.js';

export default class WCPasswordInput extends BaseComponent {

    constructor(){
        super();
        this.state = {
            secureTextEntry: true
        }
    }

    componentDidMount() {}

    render() {
        let inputErrorStyle = (this.props.error) ? {borderColor: this.theme.colors.error}: {};
        let labelErrorStyle = (this.props.error) ? {color: this.theme.colors.error}: {};
        let iconColor = (this.props.error) ? this.theme.colors.error : "grey";
        return (
            <View style={this.theme.styles.form_cell}>
                <Text style={[this.theme.styles.form_label, labelErrorStyle]}>
                    {this.props.label}
                </Text>
                <View>
                    <View style={[{width: 250, height:50, backgroundColor:this.theme.colors.white, margin:5, padding:5,borderWidth:1, borderColor:"#DDD", borderRadius: 10, flexDirection:"row"},inputErrorStyle]}>
                        <TextInput
                            style={{backgroundColor:"#fff", padding:0, margin:0, width:'85%', fontSize:18}}
                            onChangeText={this.props.onChangeText}
                            maxLength = {this.props.maxLength}
                            value={this.props.value}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            secureTextEntry={this.state.secureTextEntry}
                            />
                        {(this.state.secureTextEntry) ?
                            <TouchableHighlight onPress={()=> this.setState({secureTextEntry:false})}>
                                <Icon name="md-eye" size={30} color={iconColor} style={{marginTop:6}}/>
                            </TouchableHighlight>
                            :
                            <TouchableHighlight onPress={()=> this.setState({secureTextEntry:true})}>
                                <Icon name="md-eye-off" size={30} color={iconColor} style={{marginTop:6}} />
                            </TouchableHighlight>
                        }
                    </View>
                </View>
            </View>
        );
    }

}
