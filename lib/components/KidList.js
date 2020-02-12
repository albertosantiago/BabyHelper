import React from 'react';
import { Text, View, Image, FlatList, TouchableHighlight, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {kidManager} from '../KidManager.js';
import BaseComponent from '../BaseComponent.js';
import IconButton from './IconButton';
import StatusIndicator from './StatusIndicator';

export default class KidList extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            childrens: props.childrens
        };
        this._renderItem   = this._renderItem.bind(this);
        this._keyExtractor = this._keyExtractor.bind(this);
    }

    componentDidMount() {}

    _keyExtractor(item, index){
        return  item.id;
    }

    _renderItem(obj){
        let child = obj.item;
        let picture = <Image
            style={{ margin:20, width:80, height:80, borderRadius: 60, borderWidth: 5}}
            source={require("../../assets/if_kid_1930420.png")}
        />;
        if(child.picture!==null){
            picture = <Image source={{uri: child.picture.path }} style={{ margin:20, width:120, height:120, borderRadius: 60, borderWidth: 5, borderColor: '#ddd' }} />;
        }
        let name = child.name;

        return (
            <View key={child.id} style={{backgroundColor:"#fff", borderWidth:1, borderColor:"#ddd", width:'90%', margin:'5%', marginBottom:0}}>
                <TouchableHighlight onPress={()=> {this.goKidHome(child)}} style={{margin:5}}>
                    <View style={this.theme.styles.global_fltListItem}>
                        <View style={this.theme.styles.global_fltImgBox}>
                            {picture}
                        </View>
                        <View style={this.theme.styles.global_fltDesc}>
                            <Text style={{margin:10, width:150, marginTop:40, fontSize:24, fontWeight: 'bold', color:"#333", flexWrap:"wrap"}}>{name}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    render(){
        return (
            <View style={{flex:1}}>
                <StatusIndicator />
                <ScrollView style={{flex:1,paddingTop:0}}>
                    <View>
                        <FlatList
                            data={this.props.childrens}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                            />
                    </View>
                    <View style={{height:120}}></View>
                    {this._renderButtons()}
                </ScrollView>
            </View>
         );
    }

    _renderButtons(){
        return (
            <View style={{width:'100%', position:'absolute',bottom:20,alignItems:'center', justifyContent:'center'}}>
                <View>
                    <View style={this.theme.styles.home_buttonsContainer}>
                        <IconButton
                            type="primary"
                            size={30}
                            style={{margin:0,borderRadius:0,borderRightWidth:0}}
                            onPress={() => Actions.mediaList()}
                            icon="ios-images"
                        />
                        <IconButton
                            type="primary"
                            size={30}
                            style={{margin:0,borderRadius:0,borderRightWidth:0}}
                            onPress={() => Actions.noteList()}
                            icon="md-clipboard"
                        />
                        <IconButton
                            type="primary"
                            size={30}
                            style={{margin:0,borderRadius:0}}
                            onPress={() => Actions.taskList()}
                            icon="md-create"
                        />
                    </View>
                </View>
            </View>
        );
    }

    goKidHome(child){
        Actions.kidHome({
            child
        });
    }
}
