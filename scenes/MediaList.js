import React from 'react';
import {Text, View,FlatList} from 'react-native';
import { Actions } from 'react-native-router-flux'; // New code
import BaseComponent from '../lib/BaseComponent.js';
import IconButton from '../lib/components/IconButton';
import {noteManager} from '../lib/NoteManager';
import {kidManager} from '../lib/KidManager';
import ImageItem from '../lib/components/notes/ImageItem.js';
import VideoItem from '../lib/components/notes/VideoItem.js';
import StatusIndicator from '../lib/components/StatusIndicator';


export default class MediaList extends BaseComponent{

    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            currentKid: this.props.child
        };
        this._renderItem = this._renderItem.bind(this);
        this.loadNotes   = this.loadNotes.bind(this);
        this._showMediaForm = this._showMediaForm.bind(this);
    }

    async loadNotes(){
        var filters = [];
        filters.push({
            key: 'type',
            val: ['image','video'],
            type: 'OR'
        });
        filters.push({
            key: 'downloaded',
            val:  [true, undefined],
            type: 'OR'
        });
        if(this.state.currentKid!==undefined){
            filters.push({
                key: 'kid_ids',
                val:  this.state.currentKid.id,
                type: 'indexOf'
            });
        }
        var notes = await noteManager.getNotes(filters);
        this.setState({"notes": notes});
    }

    componentDidMount(){
        this.loadNotes();
        this.addListener("note-removed", this.loadNotes)
    }

    render(){
        var empty = null;
        if((this.state.notes===null)||(this.state.notes===undefined)){
            empty = this._renderEmptyList();
        }
        if(this.state.notes.length===0){
            empty = this._renderEmptyList();
        }
        return (
            <View style={{flex:1}}>
                <StatusIndicator />
                <View style={{flexDirection:"row", position:'absolute', bottom:20, right:0, zIndex:100}}>
                    <IconButton
                        icon="ios-images"
                        type='primary'
                        border="none"
                        size={30}
                        color="#fff"
                        onPress={this._showMediaForm}
                    />
                </View>
                {empty!==null
                    ?
                    empty
                    :
                    <View>
                        <FlatList
                            inverted
                            data={this.state.notes}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                            />
                    </View>
                }
            </View>
        );
    }

    _renderEmptyList() {
        let name = "";
        if(this.state.currentKid!==undefined){
            name = "de "+this.state.currentKid.name;
        }
        return (
            <View style={{flex: 1, backgroundColor:"#fff"}}>
                <View style={{padding:20, width:'80%', margin:'10%', backgroundColor:"#eee", borderColor:"#ddd", borderWidth:2}}>
                    <Text style={{fontSize:20, fontWeight:'bold'}}>Aún no has subido ninguna foto {name}</Text>
                    <Text style={{fontSize:16, marginTop:10}}>Pulsa el botón de la esquina inferior para añadir una foto {name}</Text>
                </View>
            </View>
        );
    }

    _renderItem({item, index}) {
        let note = item;

        return (
            <View>
                {(note.type==='video') ?
                    <VideoItem note={note} expanded={true} />
                    :
                    <ImageItem note={note} expanded={true} />
                }
            </View>
        );
    }

    _keyExtractor(item, index){
        return  item.id;
    }

    _showMediaForm(){
        Actions.mediaForm({
            child: this.props.child
        });
    }

    _createTitle(date){
        var today = new Date();
        if(date.toDateString()===today.toDateString()){
            return "Hoy";
        }
        today.setTime(today.getTime()-(24*3600*1000));
        if(date.toDateString()===today.toDateString()){
            return "Ayer";
        }
        var text = dateFormat(date, "dd-mm-yyyy");
        return text;
    }

}
