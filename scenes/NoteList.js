import React from 'react';
import { Text, View, FlatList, TouchableHighlight } from 'react-native';
import { Actions } from 'react-native-router-flux';
import BaseComponent from '../lib/BaseComponent.js';
import Button from '../lib/components/Button';
import IconButton from '../lib/components/IconButton';
import ModalNoteFilters from '../lib/components/ModalNoteFilters';
import {kidManager} from '../lib/KidManager.js';
import {noteManager} from '../lib/NoteManager.js';
import NoteItem from '../lib/components/notes/NoteItem.js';
import Icon from 'react-native-vector-icons/Ionicons';

var dateFormat = require('dateformat');

export default class NoteList extends BaseComponent{

    constructor(props) {
        super(props);
        this.ref = null;
        var date = new Date();
        this.state = {
            notes: [],
            visibleFilters: false,
            filters: {
                currentKid: props.child,
                currentEditor: undefined,
                noteType: undefined
            },
            date: date,
            currentKid: props.child
        };
        this.currentDate = undefined;
        this._renderItem   = this._renderItem.bind(this);
        this._keyExtractor = this._keyExtractor.bind(this);
        this.loadNotes     = this.loadNotes.bind(this);
        this.onNoteRemoved = this.onNoteRemoved.bind(this);
        this.applyFilters  = this.applyFilters.bind(this);
    }

    componentDidMount() {
        let refreshProps = {};
        if(this.state.currentKid!==undefined){
            refreshProps.title = 'Notas de '+this.state.currentKid.name;
        }
        refreshProps.renderRightButton = () => {
            return <View>
                        <TouchableHighlight onPress={()=> this.showFilters()}>
                            <Icon name="ios-funnel" size={30} style={{padding:0, marginRight:10, marginTop:10}} color="#fff" />
                        </TouchableHighlight>
                    </View>
        };
        this.loadNotes(this.state.filters).then((notes) => {
            this.setState({"notes": notes});
        });
        Actions.refresh(refreshProps);
        this.addListener("note-removed", this.onNoteRemoved);
    }

    onNoteRemoved(){
        this.loadNotes(this.state.filters).then((notes) => {
            this.setState({"notes": notes});
        });
    }

    showFilters(){
        this.setState({
            visibleFilters: true
        });
    }

    hideFilters(){
        this.setState({
            visibleFilters: false
        });
    }

    applyFilters(filters){
        let newState = {
            visibleFilters: false,
            filters : {
                currentKid: filters.currentKid,
                currentEditor: filters.currentEditor,
                noteType: filters.noteType
            }
        };
        this.loadNotes(newState.filters).then((notes)=>{
            newState.notes = notes;
            this.setState(newState);
        });
    }

    async loadNotes(stateFilters){
        var filters = [];
        filters.push({
            key: 'downloaded',
            val:  [true, undefined],
            type: 'OR'
        });
        filters.push({
            key: 'type',
            val:  'video',
            type: '!=='
        });
        filters.push({
            key: 'type',
            val:  'image',
            type: '!=='
        });
        if((stateFilters.currentKid!==undefined)&&
            (stateFilters.currentKid.id!==-1)){
            filters.push({
                key: 'kid_ids',
                val: stateFilters.currentKid.id,
                type: 'indexOf'
            });
        }
        if((stateFilters.currentEditor!==undefined)&&
            (stateFilters.currentEditor.id!==-1)){
            filters.push({
                key: 'user_id',
                val: stateFilters.currentEditor.id
            });
        }
        if((stateFilters.noteType!==undefined)&&
            (stateFilters.noteType.key!=='all')){
            filters.push({
                key: 'type',
                val: stateFilters.noteType.key
            });
        }
        var notes = await noteManager.getNotes(filters);
        return notes;
    }

    render() {
        var empty = null;
        if((this.state.notes===null)||(this.state.notes===undefined)){
            empty = this._renderEmptyList();
        }
        if(this.state.notes.length===0){
            empty = this._renderEmptyList();
        }
        return (
            <View style={{flex:1}}>
                {(this.state.visibleFilters) &&
                    <ModalNoteFilters visible={this.state.visibleFilters} filters={this.state.filters} onSubmit={(filters)=> this.applyFilters(filters)} onCancel={()=>this.hideFilters()}/>
                }
                <View style={{flexDirection:"row", position:'absolute', bottom:20, right:0, zIndex: 100}}>
                    <IconButton
                        icon="md-create"
                        type='primary'
                        border="none"
                        size={30}
                        color="#fff"
                        onPress={()=>Actions.taskList({child:this.state.currentKid})}
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

    _renderEmptyList(){
        return (
                <View style={this.theme.styles.note_list_empty_container}>
                    <View style={this.theme.styles.note_list_empty_text_container}>
                        <Text style={this.theme.styles.note_list_empty_text}>No has anotado nada</Text>
                        <Button
                            style={this.theme.styles.global_default_button}
                            onPress={() => Actions.taskList()}
                            >
                                <Text  style={this.theme.styles.global_default_button_text}>Anotar</Text>
                        </Button>
                    </View>
                </View>);
    }

    /**
    _renderItem({item, index}) {
        return <NoteItem note={item} />;
    }
    **/

    _renderItem({item, index}) {
        let note   = item;
        let header = <View></View>;
        let title  = "";

        let auxDate = new Date(note.date);

        if(this.currentDate===undefined){
            this.currentDate = auxDate;
        }

        if((this.currentDate.toDateString()!==auxDate.toDateString())||
            (index===(this.state.notes.length-1)))
        {
            title = this._createTitle(this.currentDate);
            this.currentDate = auxDate;
            header = <View style={{padding:10, margin:20, backgroundColor:"#333",borderRadius:10, width:120}}>
                          <Text style={{color:"#fff",fontSize:14, textAlign:'center'}}>{title}</Text>
                      </View>
        }

        return (
            <View>
                  {(index===(this.state.notes.length-1))&&
                      header
                  }
                  <NoteItem note={note} />
                  {((index!==(this.state.notes.length-1))&&(index!==0))&&
                      header
                  }
            </View>
        );
    }

    _keyExtractor(item, index){
        return  item.id+"_"+index;
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
