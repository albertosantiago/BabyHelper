import React from 'react';
import { View} from 'react-native';
import BaseComponent from '../BaseComponent.js';
import {kidManager} from '../KidManager.js';
import PersonSelector from './PersonSelector';

export default class KidSelector extends BaseComponent {

    constructor(props){
        super(props);
        this.state = {
            selected: this.props.selected,
            kids: []
        };
    }

    componentDidMount(){
        kidManager.getAllChilds().then((kids)=>{
            if(this.props.withAll){
                kids = [{name:"Todos los bebes", id: -1, picture:{}, default: true}, ...kids];
            }
            if((this.state.selected === undefined) ||
                (this.state.selected === null)){
                    this.setCurrentChild(kids[0]);
            }
            this.setState({kids});
        });
    }

    render() {
        if(this.state.kids.length<2){
            return <View  style={{paddingTop:20, paddingBottom:10}}></View>;
        }
        let containerStyle = {height: 120, width:"100%", justifyContent:'center', paddingTop:40, paddingBottom:40};
        if(!this.props.showImg){
            containerStyle.height = 70;
        }
        if(this.props.size==='small'){
            containerStyle.height = 20;
            containerStyle.paddingTop = 0;
            containerStyle.paddingBottom = 0;
        }
        return (
            <View style={containerStyle}>
                <PersonSelector showImg={this.props.showImg} size={this.props.size} type="kid" people={this.state.kids} selected={this.state.selected} onChange={(kid)=>this.setCurrentChild(kid)} />
            </View>
        );
    }

    setCurrentChild(child){
        this.setState({
            selected: child,
            visibleOptions: false
        });
        this.props.onChange(child);
    }

}
