import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import { Actions } from 'react-native-router-flux'
import BaseComponent from '../BaseComponent.js';
import {profileManager} from "../ProfileManager.js";
import {kidManager} from "../KidManager.js";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default class BabyTabs extends BaseComponent {

    constructor(props){
        super(props);
        this.state = {
            isOwner: false,
            profile: null,
            loaded: false
        };
    }

    componentDidMount() {
        profileManager.getProfile().then((profile)=>{
            let isOwner = false;
            let kid     = null;
            if((this.props.navigationState.params!== undefined)
                &&(this.props.navigationState.params.child!==undefined)){
                kid = this.props.navigationState.params.child;
                if(kid.isOwner(profile)){
                    isOwner = true;
                }
            }
            this.setState({
                isOwner: isOwner,
                kid: kid,
                profile: profile,
                loaded: true
            });
        });
    }

    render() {
        return (
        <View style={{flexDirection:"row"}}>
            {this.renderTabs()}
        </View>);
    }

    renderTabs(){
        if(this.state.loaded!==true) return <View></View>;
        if(this.state.isOwner!==true) return <View></View>;

        let tabs  = this._getTabs();
        let width = Math.round(100/tabs.length)+'%';

        return (
            <View style={{padding:0, flexDirection:"row"}}>
                {tabs.map((tab)=>{
                    return <View key={tab.key} style={[{padding:5, backgroundColor:this.theme.colors.primary, width:width}, tab.style]}>
                        <TouchableOpacity
                            onPress={()=>Actions[tab.key]({child:this.props.navigationState.params.child})}
                            style={{alignItems:'center'}}
                        >
                            <Icon name={tab.icon} size={40} color="white" />
                        </TouchableOpacity>
                    </View>
                })}
            </View>
        );
    }

    _getTabs(){
        var tabs = [];
        let routes = this.props.navigationState.routes;
        let selectedIndex = this.props.navigationState.index;

        let logged = ((this.state.profile!== null)&&(this.state.profile.confirmed))?true:false;

        for(let i=0;i<routes.length;i++){
            let route = routes[i];
            let key = route.key;
            if(logged){
                if(key==='registerForm'){
                    continue;
                }
            }else{
                if((key==='secureDataForm')||(key==='logout')){
                    continue;
                }
            }
            let label = route.routes[0].params.tabBarLabel;
            let icon  = route.routes[0].params.icon;
            let style = (selectedIndex===i) ? {borderTopWidth:6, borderColor:this.theme.colors.primary_dark} : {borderTopWidth:6, borderColor:this.theme.colors.primary_light};
            tabs.push({
                key:key,
                label:label,
                style: style,
                icon: icon
            });
        }
        return tabs;
    }

}
