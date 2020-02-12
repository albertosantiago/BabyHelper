import React from 'react';
import { Text, View, TextInput} from 'react-native';
import BaseComponent from '../BaseComponent.js';

export default class WCInput extends BaseComponent {

    constructor(){
        super();
    }

    componentDidMount() {}

    render() {
        let containerStyle = this.theme.styles.form_cell;
        if(this.props.containerStyle){
            containerStyle = this.props.containerStyle;
        }
        let inputErrorStyle = (this.props.error) ? {borderColor: this.theme.colors.error}: {};
        let labelErrorStyle = (this.props.error) ? {color: this.theme.colors.error}: {};
        return (
            <View style={containerStyle}>
                <Text style={[this.theme.styles.form_label, labelErrorStyle]}>
                    {this.props.label}
                </Text>
                <TextInput
                    style={[this.props.style, inputErrorStyle]}
                    onChangeText={this.props.onChangeText}
                    maxLength={this.props.maxLength}
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    multiline={this.props.multiline}
                    numberOfLines={this.props.numberOfLines}
                    underlineColorAndroid={this.props.underlineColorAndroid}
                    />
            </View>
        );
    }

}
