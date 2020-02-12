import React from 'react';
import { Text, View, TouchableHighlight } from 'react-native';
import {config} from '../lib/Config.js';
import {theme as themeManager} from '../lib/Theme.js';
import { Actions } from 'react-native-router-flux';
import BaseComponent from '../lib/BaseComponent.js';

export default class ThemeManager extends BaseComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }


    render() {
        return (
            <View style={{flex:1, backgroundColor:"white", flexDirection:"column", alignItems:"center"}}>
                <Text style={{textAlign:"center",fontWeight:"bold", fontSize:24, margin:20, padding:20, color:"#000"}}>Elige el color</Text>
                <View style={{backgroundColor:"white", flexDirection:"row"}}>
                    <TouchableHighlight onPress={()=> this.changeTheme("blue")}
                        style={{
                            backgroundColor:"#2296F3",
                            width:80,
                            height:80,
                            borderRadius:40,
                            margin:30,
                            marginTop:10,
                        }}>
                        <View></View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={()=> this.changeTheme("pink")}
                        style={{
                            backgroundColor:"#EC008C",
                            width:80,
                            height:80,
                            borderRadius:40,
                            margin:30,
                            marginTop:10,
                        }}>
                        <View></View>
                    </TouchableHighlight>
                </View>
                <View style={{backgroundColor:"white", flexDirection:"row"}}>
                    <TouchableHighlight onPress={()=> this.changeTheme("orange")}
                        style={{
                            backgroundColor:"#F3621D",
                            width:80,
                            height:80,
                            borderRadius:40,
                            margin:30,
                            marginTop:10,
                        }}>
                        <View></View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={()=> this.changeTheme("purple")}
                        style={{
                            backgroundColor:"#6B0073",
                            width:80,
                            height:80,
                            borderRadius:40,
                            margin:30,
                            marginTop:10,
                        }}>
                        <View></View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

    changeTheme(theme){
        config.setConfig('theme', theme);
        themeManager.setTheme(theme);
        Actions.home();
    }
}
