import React from 'react';
import { Text, View, Image, FlatList, TouchableHighlight } from 'react-native';
import BaseComponent from '../lib/BaseComponent.js';
import { Calendar as RNCalendar, CalendarList, Agenda } from 'react-native-calendars';
import {kidManager} from '../lib/KidManager.js';
import {noteManager} from '../lib/NoteManager.js';

import {
  Scene,
  Router,
  Actions,
  Reducer,
  ActionConst,
  Overlay,
  Tabs,
  Drawer,
  Stack,
  Lightbox,
} from 'react-native-router-flux';

var dateFormat = require('dateformat');

export default class CalendarTab extends BaseComponent{

    static navigationOptions = {
        tabBarLabel: 'Calendario',
    };

    constructor(props) {
        super(props);
        this.state = {
            notes:[],
            title:''
        };
        switch(props.note.type){
            case "cleaning":
                 title = 'Calendario de limpieza'
                 break;
            case "feed":
                 title = 'Calenario de comida'
                 break;
            case "weight":
                 title = 'Calendario de peso'
                 break;
            case "medicine":
                 title = 'Calenario de medicinas'
                 break;
            case "personal":
                 title = 'Calendario de notas'
                 break;
        }
        this.state.title = title;
    }

    componentDidMount() {
        Actions.refresh({title:this.state.title});
        var notes = noteManager.getNotes({
            key: 'type',
            val: this.props.note.type
        });
        this.setState({
            notes: notes
        });
    }

    render() {
        var formattedNotes = {};
        var markedDates={};

        this.state.notes.forEach((note)=>{
            var key = dateFormat(new Date(note.date), 'yyyy-mm-dd');
            if(formattedNotes[key]===undefined){
                formattedNotes[key] = [];
            }
            formattedNotes[key].push(note);
            markedDates[key] = {selected: true, marked: true};
        });

        return (
            <View style={{flex:1, backgroundColor:"#fff",padding:10}}>
                <Text style={{fontSize:24, color:"#000", marginLeft:20, marginTop:20}}>{this.state.title}</Text>
                <View style={{marginBottom:10, borderTopWidth:1, borderColor:"#DDD", width:"100%"}}></View>
                <View style={{flex:1, marginTop:20}}>
                    <RNCalendar
                        markedDates={markedDates}
                        dayComponent={(params) => {
                            const {date, state} = params;
                            var key = date.dateString;
                            var len = 0;
                            if(formattedNotes[key]!==undefined){
                                var len = formattedNotes[key].length;
                            }
                            var dots = <View style={{backgroundColor:"#fff", borderTopWidth:1, borderColor:"#ddd"}}>
                                        <Text style={{color:"#aaa"}}>{len}</Text>
                                    </View>;
                            return (
                                <View style={{flex: 1, flexDirection:"column", alignItems:"center"}}>
                                    <Text style={{textAlign: 'center', color: state === 'disabled' ? 'gray' : 'black'}}>{date.day}</Text>
                                    {dots}
                                </View>
                            );
                        }}
                    />
                </View>
            </View>
        );
    }
}
