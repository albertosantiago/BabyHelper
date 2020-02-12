import React from 'react';
import { Text, View, Image, TouchableHighlight} from 'react-native';
import { Actions } from 'react-native-router-flux';
import BaseComponent from '../../BaseComponent.js';
import BaseItem from './BaseItem';

export default class CleaningItem extends BaseComponent {

    static defaultProps = {
        withIcon: true
    }

    constructor(props){
        super(props);
    }

    componentDidMount() {}

    render() {
        var note = this.props.note;
        var text = "Hizo";

        if(note.piss===true){
            text += " pipi";
            if(note.shit===true){
                text += " y";
            }
        }
        if(note.shit===true){
            text += " caca";
        }
        return (
                <BaseItem note={note} onPressDelete={this.props.onPressDelete}>
                    <View style={{flexDirection:'row', paddingBottom:5}}>
                        {(this.props.withIcon) &&
                            <View>
                                <Image
                                    style={{ margin:0, width:40, height:40}}
                                    source={require("../../../assets/panal.png")}
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
