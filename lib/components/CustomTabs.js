import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import { Actions } from 'react-native-router-flux'
import BaseComponent from '../BaseComponent.js';

export default class CustomTabs extends BaseComponent {

    constructor(props){
        super(props);
    }

    componentDidMount() {}

    render() {
        return (
        <View style={{flexDirection:"row"}}>
            {this.renderTabs()}
        </View>);
    }

    renderTabs(){
        var tabs = [];
        let routes = this.props.navigationState.routes;
        let selectedIndex = this.props.navigationState.index;

        for(let i=0;i<routes.length;i++){
            let route = routes[i];
            let key = route.key;
            let label = route.routes[0].params.tabBarLabel;
            let style = (selectedIndex===i) ? {borderTopWidth:6, borderColor:this.theme.colors.primary_dark} : {borderTopWidth:6, borderColor:this.theme.colors.primary_light};
            tabs.push({
                key:key,
                label:label,
                style: style
            });
        }

        let width = Math.round(100/tabs.length)+'%';
        return <View style={{padding:0, flexDirection:"row"}}>
                {tabs.map((tab)=>{
                    return <View key={tab.key} style={[{padding:12, backgroundColor:this.theme.colors.primary, width:width}, tab.style]}>
                        <TouchableOpacity
                            onPress={()=>Actions[tab.key]()}
                        >
                            <Text style={{width:"100%", textAlign:"center", fontSize:20, color:this.theme.colors.white, fontWeight:'bold'}}>{tab.label}</Text>
                        </TouchableOpacity>
                    </View>
                })}
            </View>;
    }

}
