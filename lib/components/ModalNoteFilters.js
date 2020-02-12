import React from 'react';
import { Text, View, Image }from 'react-native';
import BaseComponent from '../BaseComponent.js';
import Modal from 'react-native-modal';
import Button from './Button';
import IconButton  from './IconButton';
import WCDropDown  from './WCDropDown';
import KidSelector from './KidSelector';
import EditorSelector from './EditorSelector';

import Icon from 'react-native-vector-icons/Ionicons';

import {NOTE_TYPES} from '../Constants';

export default class ModalNoteFilters extends BaseComponent {

    constructor(props){
        super(props);
        this.state = {
            currentKid: this.props.filters.currentKid,
            currentEditor: this.props.filters.currentEditor,
            noteType: this.props.filters.noteType,
        }
    }

    componentWillReceiveProps (nextProps) {
        if(nextProps.visible !== this.props.visible) {
            this.setState({
                visible: nextProps.visible
            });
        }
    }

    componentDidMount(){}

    render(){
        let filterTypeOptions = this._getNoteTypeOptions();
        return (
            <View>
                {(this.props.visible) &&
                    <Modal
                      isVisible={this.props.visible}
                      animationIn={'slideInLeft'}
                      animationOut={'slideOutRight'}
                      onBackdropPress={()=>this.props.onCancel()}
                    >
                        <View style={this.theme.styles.note_list_modal_content}>
                                <View style={{padding:0, borderBottomWidth:1, width:'100%', marginBottom:20}}>
                                    <Text style={{marginTop:0, width:'100%', fontSize:28, color:"#000", fontWeight:"bold", textAlign:"center"}}>Filtros</Text>
                                </View>
                                <View>
                                    <EditorSelector showImg={false} withAll={true} selected={this.state.currentEditor} onChange={(editor)=> this.setState({currentEditor:editor})} />
                                </View>
                                <View>
                                    <KidSelector showImg={false} withAll={true} selected={this.state.currentKid} onChange={(kid)=> this.setState({currentKid:kid})} />
                                </View>
                                <View style={{padding:0, paddingTop:0, height:70, justifyContent:'center'}}>
                                    <WCDropDown scrolled={true} selected={this.state.noteType} onChange={(opt)=> this.setState({noteType:opt})} options={filterTypeOptions} iconSize={30} expanded={true} />
                                </View>
                                <View style={[this.theme.styles.form_cell,{paddingTop:20}]}>
                                    <IconButton name="ios-funnel" size={50} onPress={()=>this.apply()} />
                                </View>
                        </View>
                    </Modal>
                }
            </View>
        );
    }


    _getNoteTypeOptions(){
        let options = [];
        options.push({
            key: 'all',
            text: "Todas las notas"
        });
        for(let noteType of NOTE_TYPES){
            options.push({
                key: noteType.key,
                text:  noteType.label,
                image: noteType.image
            });
        }
        return options;
    }

    apply(){
        this.props.onSubmit({
            currentKid: this.state.currentKid,
            currentEditor: this.state.currentEditor,
            noteType: this.state.noteType
        });
    }

}
