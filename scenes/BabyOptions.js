import React from 'react';
import { Text, View, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';

import BaseComponent from '../lib/BaseComponent.js';
import Button from '../lib/components/Button';
import ModalConfirmation from '../lib/components/ModalConfirmation';
import {kidManager} from '../lib/KidManager';
import {profileManager} from '../lib/ProfileManager';
import {changeLog} from '../lib/ChangeLog';
import {syncro} from '../lib/Syncro';

export default class BabyOptions extends BaseComponent{

    constructor(props) {
        super(props);
        this.state = {
            confirmationVisible: false,
            confirmationMessage: '',
            currentChild: props.child
        };
    }

    componentDidMount(){}

    render() {
        var child = this.state.currentChild;
        var name  = "";
        var picture = <Image
            style={{width: 120, height: 120}}
            source={require("../assets/if_kid_1930420.png")}
        />;
        if(child.picture!==null){
            picture = <Image source={{uri: child.picture.path }} style={this.theme.styles.home_image} />;
        }
        if(child.name!==null){
            name = child.name;
        }

        return (
            <View style={{flex: 1, backgroundColor:"#fff", flexDirection:"column", alignItems:'center'}}>
                <ModalConfirmation
                    visible={this.state.confirmationVisible}
                    message={this.state.confirmationMessage}
                    onCancel={()=>this.setState({confirmationVisible:false})}
                    onConfirm={()=> this.deleteChild()}
                />
                <View style={{alignItems:"center", paddingTop:50}}>
                    <View
                      style={this.theme.styles.home_image_container}
                    >
                        {picture}
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center", paddingTop:5}}>
                        <Text style={this.theme.styles.home_title}>{name}</Text>
                    </View>
                </View>
                <Button
                    style={[this.theme.styles.global_default_button,{backgroundColor:this.theme.colors.primary}]}
                    onPress={()=>this.showDeleteConfirmation()}
                >
                    <View style={{flexDirection:'row'}}>
                        <Text style={[this.theme.styles.global_default_button_text,{color:"#fff", marginRight:10, marginTop:5}]}>Eliminar</Text>
                    </View>
                </Button>
            </View>
        );
    }

    showDeleteConfirmation(){
        var kid = this.state.currentChild;
        let message = "Vas a eliminar los datos de " +kid.name+" ¿Estas seguro de continuar?";
        this.setState({
            confirmationVisible: true,
            confirmationMessage: message
        });
    }

    async deleteChild() {
        var profile = await profileManager.getProfile();
        var kid     = this.state.currentChild;
        if(kid.isOwner(profile)){
            changeLog.log('remove-kid',{
                kid_ids: [kid.id]
            });
            syncro.tryExec({
                func: 'syncroDeleteKids',
                args:[]
            });
        }else{
            changeLog.log('remove-editor', {
                editor_id: profile.id,
                kid_id:    kid.id
            });
            syncro.tryExec({
                func: 'syncroDeleteEditors',
                args:[]
            });
        }
        this.setState({
            confirmationVisible: false,
        });
        kidManager.removeChild(kid.id);
        Actions.home();
    }
}
