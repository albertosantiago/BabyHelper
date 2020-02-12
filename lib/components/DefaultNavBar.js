import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Actions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons';
import BaseComponent from '../BaseComponent.js';
import {kidManager}  from '../KidManager';

export default class DefaultNavBar extends BaseComponent {

    constructor(props){
        super(props);
    }

    async componentDidMount() {}

    render() {
        return (
            <View style={[this.theme.styles.nav_bar_root]}>
                <View style={this.theme.styles.nav_bar_container}>
                    <View style={{width:"10%"}}>
                        <TouchableOpacity onPress={()=>this.back()}>
                            <View style={{flexDirection:'row', alignItems:'center', paddingLeft:10}}>
                                <Icon name="md-arrow-round-back" size={35} color={'#ffffff'} style={{marginTop:5,paddingRight:6}} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:"80%", alignItems:'center'}}>
                        <Text style={{marginLeft:"-7%", color:"#fff", fontWeight:"bold", fontSize:22, textAlign:"left", paddingTop:10}}>{this.props.title}</Text>
                    </View>
                    <View style={{width:'10%'}}>
                        {(this.props.renderRightButton) &&
                            this.props.renderRightButton()
                        }
                    </View>
                </View>
            </View>
        );
    }

    async back(){
        if(this.props.backMode==='reset'){
            if(this.props.backTo==='kidHome') {
                if(this.props.child===undefined){
                    Actions.reset('home');
                }else{
                    let totalChilds = await kidManager.countChilds();
                    if(totalChilds===1){
                        Actions.reset('home');
                    }else{
                        Actions.reset('kidHome', {child:this.props.child});
                    }
                }
            }else{
                Actions.reset(this.props.backTo);
            }
        }else if(this.props.backMode==='direct'){
            if(this.props.backTo==='kidHome') {
                if(this.props.child===undefined){
                    Actions.reset('home');
                }else{
                    let totalChilds = await kidManager.countChilds();
                    if(totalChilds===1){
                        Actions.reset('home');
                    }else{
                        Actions.kidHome({child:this.props.child});
                    }
                }
            }
        }else{
            Actions.pop();
        }
    }

}
