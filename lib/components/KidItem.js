import React from 'react';
import { Text, View, Image, TouchableHighlight, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import BaseComponent from '../BaseComponent.js';
import IconButton from './IconButton';
import StatusIndicator from './StatusIndicator';
import LastKidNotes from './LastKidNotes';
import {kidManager} from '../KidManager.js';
import {noteManager} from '../NoteManager.js';
import {profileManager} from '../ProfileManager.js';
import {eventApp} from "../EventApp.js";
import {cron} from "../Cron.js";

import {NOTE_TYPES, IMAGES} from '../Constants';

export default class KidItem extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            lastNotes: [],
            isModalVisible: false,
            currentKid: props.child,
        };
        this.mounted = true;
        this.goAddBaby = this.goAddBaby.bind(this);
        this.setBabyEdition  = this.setBabyEdition.bind(this);
    }

    componentDidMount() {}

    render(){
        var name = "";
        var picture = <Image
            style={{width: 120, height: 120}}
            source={require("../../assets/if_kid_1930420.png")}
        />;
        var child = this.props.child;
        if(child.picture!==null){
            picture = <Image source={{uri: child.picture.path }} style={this.theme.styles.home_image} />;
        }
        if(child.name!==null){
            name = child.name;
        }

        return (
            <View style={{flex:1}}>
                <StatusIndicator />
                <ScrollView>
                    <View style={this.theme.styles.home_container}>
                        <TouchableHighlight
                            onPress={()=>this.setState({menuVisible: true})}>
                            <View style={{alignItems:"center", paddingTop:5}}>
                                <View
                                  style={this.theme.styles.home_image_container}
                                >
                                    {picture}
                                </View>
                                <View style={{flexDirection:"row", alignItems:"center", paddingTop:5}}>
                                    <Text style={this.theme.styles.home_title}>{name}</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                        <View style={this.theme.styles.home_buttonsContainer}>
                            <IconButton
                                type="primary"
                                size={30}
                                style={{margin:0,borderRadius:0,borderRightWidth:0}}
                                onPress={() => Actions.replace('mediaList',{child}) }
                                icon="ios-images"
                            />
                            <IconButton
                                type="primary"
                                size={30}
                                style={{margin:0,borderRadius:0,borderRightWidth:0}}
                                onPress={() => Actions.noteList({child})}
                                icon="md-clipboard"
                            />
                            <IconButton
                                type="primary"
                                size={30}
                                style={{margin:0,borderRadius:0, borderRightWidth:0}}
                                onPress={() => Actions.taskList({child})}
                                icon="md-create"
                            />
                            <IconButton
                                type="primary"
                                size={30}
                                style={{margin:0, borderRadius:0}}
                                onPress={() => this.setBabyEdition(child.id)}
                                icon="md-settings"
                            />
                        </View>
                        <View style={{marginTop:10, width:"90%", margin:"5%"}}>
                            <LastKidNotes child={this.state.currentKid} />
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }

    showCalendar(note){
        Actions.detailTabs({note:note});
    }

    async setBabyEdition(id){
        var profile = await profileManager.getProfile();
        var child   = kidManager.getChild(id);
        if(child.isOwner(profile)){
            Actions.jump('tutorTabs',{
                child: child
            });
        }else{
            Actions.babyOptions({
                child: child
            });
        }

    }

    goAddBaby(){
        Actions.babyForm();
    }

}
