import React from 'react';
import {View, Text, Image} from 'react-native';
import BaseComponent from '../lib/BaseComponent.js';
import {profileManager} from '../lib/ProfileManager.js';
import {IMAGES} from '../lib/Constants';

export default class TutorHome extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            userProfile: undefined
        };
        this.loadProfile = this.loadProfile.bind(this);
    }

    componentDidMount() {
        this.loadProfile();
    }

    async loadProfile(){
        var profile = profileManager.getUserProfile(this.props.userId);
        this.setState({"userProfile": profile});
    }

    render() {
        if(!this.state.userProfile) return <View></View>;
        var name = "";
        var profile = this.state.userProfile;
        var picture = <Image
            style={{width: 120, height: 120}}
            source={IMAGES.defaultAdult}
        />;
        if(profile.picture!==null){
            picture = <Image source={{uri: profile.picture.path }} style={this.theme.styles.home_image} />;
        }
        if(profile.name!==null){
            name = profile.name;
        }

        return (
            <View style={{flex:1, backgroundColor:"#fff"}}>
                <View style={{alignItems:"center", paddingTop:5}}>
                    <View
                      style={this.theme.styles.home_image_container}
                    >
                        {picture}
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center", paddingTop:15}}>
                        <Text style={this.theme.styles.home_title}>{name}</Text>
                    </View>
                    <View>
                        <Text>Usuario desde 2018-06-18</Text>
                    </View>
                </View>
            </View>
        );
    }

}
