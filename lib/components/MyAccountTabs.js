import React from 'react';
import { Text, View, TouchableOpacity} from 'react-native';
import { Actions } from 'react-native-router-flux'
import BaseComponent from '../BaseComponent.js';
import {profileManager} from "../ProfileManager.js"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import InternetArea from './InternetArea';
import SecureArea from './SecureArea';

export default class MyAccountTabs extends BaseComponent {

    constructor(props){
        super(props);
        this.state = {
            profile: null,
            loaded: false
        };
    }

    componentDidMount() {
        profileManager.getProfile().then((profile)=>{
            this.setState({
                profile: profile,
                loaded: true
            });
        });
    }

    render() {
        return (
        <View style={{flexDirection:"row"}}>
            {this.renderTabs()}
            {this.renderChecks()}
        </View>);
    }

    renderTabs(){
        if(this.state.loaded!==true) return <View></View>;

        let tabs  = this._getTabs();
        let width = Math.round(100/tabs.length)+'%';

        return (
            <View style={{padding:0, flexDirection:"row"}}>
                {tabs.map((tab)=>{
                    return <View key={tab.key} style={[{padding:5, backgroundColor:this.theme.colors.primary, width:width}, tab.style]}>
                        <TouchableOpacity
                            onPress={()=>Actions[tab.key]()}
                            style={{alignItems:'center'}}
                        >
                            {
                                (tab.icon!==undefined)
                                ? <Icon name={tab.icon} size={40} color="white" />
                                : <Text style={{width:"100%", textAlign:"center", fontSize:20, color:this.theme.colors.white, fontWeight:'bold'}}>{tab.label}</Text>
                            }
                        </TouchableOpacity>
                    </View>
                })}
            </View>
        );
    }

    renderChecks(){
        let routes = this.props.navigationState.routes;
        let selectedIndex = this.props.navigationState.index;
        let key = routes[selectedIndex].key;
        if(key==='secureDataForm'){
            return <View>
                        <InternetArea />
                        <SecureArea />
                   </View>;
        }
        if(key==='registerForm'){
            return <View>
                        <InternetArea />
                   </View>;
        }
        return <View></View>
    }

    _getTabs(){
        var tabs = [];
        let routes = this.props.navigationState.routes;
        let selectedIndex = this.props.navigationState.index;

        let logged = profileManager.isLogged();

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
