import React from 'react';
import { View} from 'react-native';
import BaseComponent from '../BaseComponent.js';
import {profileManager} from '../ProfileManager.js';
import PersonSelector from './PersonSelector';

export default class EditorSelector extends BaseComponent {

    constructor(props){
        super(props);
        this.state = {
            selected: this.props.selected,
            editors: []
        };
    }

    componentDidMount(){
        let editors = profileManager.getAllUserProfiles();
        if(this.props.withAll){
            editors = [{name:"Todos los editores", id: -1, picture:{}, default: true}, ...editors];
        }
        if((this.state.selected === undefined) ||
            (this.state.selected === null)){
                this.setCurrentEditor(editors[0]);
        }
        this.setState({editors});
    }

    render() {
        if(this.state.editors.length<=1){
            return <View></View>;
        }
        let height = 110;
        if(!this.props.showImg){
            height = 70;
        }
        return (
            <View style={{height:height, width:"100%",justifyContent:'center'}}>
                <PersonSelector showImg={this.props.showImg} people={this.state.editors} selected={this.state.selected} onChange={(editor)=>this.setCurrentEditor(editor)} />
            </View>
        );

    }

    setCurrentEditor(editor){
        this.setState({
            selected: editor,
            visibleOptions: false
        });
        this.props.onChange(editor);
    }

}
