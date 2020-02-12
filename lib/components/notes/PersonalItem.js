import React from 'react';
import {
    Text, View, Image,
    TouchableHighlight
}
from 'react-native';
import { Actions } from 'react-native-router-flux'; // New code
import BaseComponent from '../../BaseComponent.js';
import BaseItem from './BaseItem';

export default class PersonalItem extends BaseComponent {

    static defaultProps = {
        withIcon: true
    }

    constructor(){
        super();
    }

    componentDidMount() {}

    render() {
        var note = this.props.note;
        return (
                <BaseItem note={note}  onPressDelete={this.props.onPressDelete}>
                    <View style={{flexDirection:'row', paddingBottom:5}}>
                        {(this.props.withIcon) &&
                            <View>
                                <Image
                                    style={{ margin:0, width:40, height:40}}
                                    source={require("../../../assets/notas.png")}
                                />
                            </View>
                        }
                        <View key={note.id} style={{flexDirection:"column", paddingLeft:10, flex:1}}>
                            <Text style={{flexWrap: 'wrap', fontSize:16}} >{note.text}</Text>
                        </View>
                    </View>
                </BaseItem>
        );
    }
}
