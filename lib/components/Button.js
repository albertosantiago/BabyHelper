import React from 'react';
import { Text, View, TouchableOpacity} from 'react-native';
import BaseComponent from '../BaseComponent.js';

export default class Button extends BaseComponent {

    constructor(){
        super();
    }

    componentDidMount() {}

    render() {
        return (
        <TouchableOpacity
            style={this.props.style}
            onPress={this.props.onPress}
            >
            <View>
                {this.props.children}
            </View>
        </TouchableOpacity>);
    }

}
