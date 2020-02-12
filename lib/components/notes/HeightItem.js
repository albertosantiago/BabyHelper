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

export default class HeightItem extends BaseComponent {

    static defaultProps = {
        withIcon: true
    }

    constructor(){
        super();
    }

    componentDidMount() {}

    render() {
        var note = this.props.note;
        var text = "Mide "+ note.ctm+"ctm de altura";

        return (
                <BaseItem note={note}  onPressDelete={this.props.onPressDelete}>
                    <View style={{flexDirection:'row', paddingBottom:5}}>
                        {(this.props.withIcon) &&
                            <View>
                                <Image
                                    style={{ margin:0, width:40, height:40}}
                                    source={require("../../../assets/centimeter.png")}
                                />
                            </View>
                        }
                        <View key={note.id} style={{flexDirection:"column", padding:5, paddingLeft:10, paddingTop:10}}>
                            <Text style={{fontWeight:"normal", fontSize:16}}>{text}</Text>
                            <View>{this._getPreviousText(note)}</View>
                        </View>
                    </View>
                </BaseItem>
        );
    }

    _getPreviousText(note){
        let previousText = <View></View>;
        let previousNote = noteManager.getPreviousNoteType(note);
        if(previousNote!==undefined){
            let differenceHeight = note.ctm-previousNote.ctm;
            if(differenceHeight>0){
                let text = "Tu bebe creció "+differenceHeight+" ctm";
                previousText = (
                    <View style={{flexDirection:"row"}}>
                        <Text style={{marginTop:7}}>{text}</Text>
                    </View>
                    );
            }
        }
        return previousText;
    }
}
