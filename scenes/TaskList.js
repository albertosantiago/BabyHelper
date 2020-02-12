import React from 'react';
import { Text, View, Image, TouchableHighlight, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import * as Animatable from 'react-native-animatable';

import {NOTE_TYPES, IMAGES} from '../lib/Constants';
import BaseComponent from '../lib/BaseComponent.js';

export default class TaskList extends BaseComponent {

    constructor(props) {
        super(props);
        this.ref = null;
        this.state = {
            fontSize: 10,
            modalVisible: false,
            currentKid: this.props.child
        };
        this.color = "#FFF";
        this.setNote = this.setNote.bind(this);
    }

    componentDidMount(){}

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    setNote(type){
        let actionKey = "note"+this.capitalizeFirstLetter(type)+"Form";
        Actions[actionKey]({
            child: this.state.currentKid
        });
    }

    render(){
        return (
            <ScrollView style={{flex:1, marginBottom:10, backgroundColor:"#fff"}}>
                {NOTE_TYPES.map((type)=>{
                    if((type.key!=='image')&&(type.key!=='video')){
                        return this.renderItem(type);
                    }
                })}
            </ScrollView>
        );
    }

    renderItem(type){
        return (
            <TouchableHighlight
                key={type.key}
                onPress={()=>{this.setNote(type.key)}}
                underlayColor="#81BBEB">
                <Animatable.View
                   ref={()=>{this.setNote(type.key)}}
                   style={[{ backgroundColor: this.color }, this.theme.styles.task_list_cell]}
                >
                        <Image
                            style={{ margin:0, width:45, height:45}}
                            source={type.image}
                        />
                    <Text style={this.theme.styles.task_list_name}>{type.label}</Text>
                </Animatable.View>
            </TouchableHighlight>
        );
    }
}
