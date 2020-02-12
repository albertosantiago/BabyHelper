import React, { Component } from 'react';
import { Text, View, Image, FlatList, TouchableHighlight } from 'react-native';
import { AppRegistry, AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
var dateFormat = require('dateformat');

import BaseComponent from '../lib/BaseComponent.js';
import Button from '../lib/components/Button';
import IconButton from '../lib/components/IconButton';
import DateFormatter from '../lib/util';
import {kidManager} from '../lib/KidManager.js';
import {noteManager} from '../lib/NoteManager.js';
import NoteItem from '../lib/components/notes/NoteItem.js';

var RNFS = require('react-native-fs');

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

export default class DiaryTab extends BaseComponent {

    static defaultProps = {
        note: {
            type: 'cleaning',
            date: new Date()
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            type: props.note.type,
            title: '',
            imgSrc: ''
        };
        let title = '';
        let imgSrc = '';
        switch(props.note.type){
            case "cleaning":
                 title = 'Limpieza';
                 imgSrc = require('../assets/panal.png');
                 break;
            case "feed":
                 title = 'Comidas';
                 imgSrc = require('../assets/biberon.png');
                 break;
            case "weight":
                 title = 'Peso';
                 imgSrc = require('../assets/maquina_pesar.png');
                 break;
            case "medicine":
                 title = 'Medicinas';
                 imgSrc = require('../assets/medicinas.png');
                 break;
            case "personal":
                 title = 'Notas personales';
                 imgSrc = require('../assets/notas.png');
                 break;
        }
        this.state.title  = title;
        this.state.imgSrc = imgSrc;
        this.currentDate  = undefined;
        this._renderItem  = this._renderItem.bind(this);
        this.loadNotes();
   }

   componentDidMount(){
       Actions.refresh({title:this.state.title});
   }

  _renderItem(obj) {
      var note = obj.item;
      var header = <View></View>;
      if(this.currentDate!==dateFormat(note.date,'yyyy-mm-dd')){
          let auxDate = dateFormat(note.date,'yyyy-mm-dd');
          this.currentDate = auxDate;
          header = <View style={[this.theme.styles.note_list_cell,{borderBottomWidth:1, borderColor:"#ddd", backgroundColor:"#fff"}]}>
                        <Text style={{color:"#000",fontSize:20}}>{auxDate}</Text>
                    </View>
      }
      return (
          <View>
                {header}
                <NoteItem note={note} />
          </View>
      );
  }

  async loadNotes(){
      var currentKidId = kidManager.getCurrentChildId();
      var notes = await noteManager.getNotes([{
          key:'kid_ids',
          val:currentKidId,
          type: 'indexOf'
      },{
          key:'type',
          val: this.state.type
      }]);
      this.setState({"notes": notes});
  }

  _keyExtractor(item, index){
      return  item.id;
  }

  render() {
      return (
            <View style={[this.theme.styles.note_list_container,{paddingTop:0}]}>
                <View style={{flexDirection:"row", paddingTop:15, paddingBottom:5}}>
                    <Text style={{fontSize:24, color:"#000", marginLeft:20, marginTop:5}}>{this.state.title}</Text>
                    <Image
                        style={{ margin:0, marginTop:7, marginLeft:8, width:30, height:30}}
                        source={this.state.imgSrc}
                    />
                </View>
                <View style={{marginBottom:10, borderTopWidth:1, borderColor:"#DDD", width:"100%"}}></View>
                <FlatList
                    data={this.state.notes}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    />
            </View>
      );
  }
}
