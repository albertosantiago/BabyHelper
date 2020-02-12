import React from 'react';
import {
    Text, View, Image,
    TouchableHighlight
}
from 'react-native';

import {noteManager} from "../../NoteManager.js";
import BaseComponent from '../../BaseComponent.js';
import { Actions } from 'react-native-router-flux'; // New code
import BaseItem from './BaseItem';

export default class TemperatureItem extends BaseComponent {

    static defaultProps = {
        withIcon: true
    }

    constructor(){
        super();
    }

    componentDidMount() {}

    render() {
        var note = this.props.note;
        var text = "Marcaba "+ (note.temp/10) +"º ";

        return (
                <BaseItem note={note}  onPressDelete={this.props.onPressDelete}>
                    <View style={{flexDirection:'row', paddingBottom:5}}>
                        {(this.props.withIcon) &&
                            <View>
                                <Image
                                    style={{ margin:0, width:40, height:40}}
                                    source={require("../../../assets/thermometer.png")}
                                />
                            </View>
                        }
                        <View key={note.id} style={{flexDirection:"column", padding:10}}>
                            <Text style={{fontWeight:"normal", fontSize:16}}>{text}</Text>
                        </View>
                    </View>
                </BaseItem>
        );
    }
}
