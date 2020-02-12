import React from 'react';
import {
    Text, View, Image
}
from 'react-native';
import BaseComponent from '../../BaseComponent.js';
import BaseItem from './BaseItem';
import I18n from '../../I18N.js';

var dateFormat = require('dateformat');
dateFormat.i18n = I18n.t("dateFormat");

export default class MedicineItem extends BaseComponent {

    static defaultProps = {
        withIcon: true
    }

    constructor(){
        super();
    }

    componentDidMount() {}

    render() {
        let note = this.props.note;

        var alarmDate = new Date(note.alarmDate);
        alarmDate = dateFormat(alarmDate, "dddd, d mmmm, HH:MM");

        var eventDate = new Date(note.eventDate);
        eventDate = dateFormat(eventDate, "dddd, d mmmm, HH:MM");

        return (
                <BaseItem note={note}  onPressDelete={this.props.onPressDelete}>
                    <View style={{flexDirection:'row', paddingBottom:5}}>
                        {(this.props.withIcon) &&
                                <View>
                                    <Image
                                        style={{ margin:0, width:35, height:35}}
                                        source={require("../../../assets/calendar.png")}
                                    />
                                </View>
                        }
                        <View style={{flexDirection:"column", padding:5, paddingLeft:10, paddingBottom:15, flex:1}}>
                            <View style={{flexDirection:'column'}}>
                                <Text style={{flexWrap: 'wrap', fontSize:16}} >{note.title}</Text>
                                <Text style={{flexWrap: 'wrap', fontSize:16}} >{note.text}</Text>
                                <Text style={{flexWrap: 'wrap',fontSize:16}} >{eventDate}</Text>
                            </View>
                        </View>
                    </View>
                </BaseItem>
        );
    }
    /**
    ALARMA
    <View style={{flexDirection:'row', paddingTop:5}}>
        <Text style={{flexWrap: 'wrap', fontWeight:'bold', fontSize:16, width:80, color:"#000"}}>Alarma:</Text>
        <Text style={{flexWrap: 'wrap', fontSize:16}} >{alarmDate}</Text>
    </View>
    **/
}
