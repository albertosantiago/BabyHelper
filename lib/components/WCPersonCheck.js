import React from 'react';
import {
    Text, View,
    Image, TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BaseComponent from '../BaseComponent.js';

export default class IconButton extends BaseComponent {

    constructor(props){
        super(props);
        this.state = {
            icon: "md-checkmark-circle",
            size: 64,
            style: null,
            type: 'default'
        }
    }

    componentDidMount() {}

    render() {
        let icon = <View></View>;
        if(this.props.person.checked){
            icon = <View style={{
                        borderRadius:25, width:50, height:50,
                        position:'absolute', right:0, top:50,
                        backgroundColor:"#fff", justifyContent:'center',
                        alignItems:'center'}}>
                            <Icon name="md-checkmark-circle" color="#21ba45" size={50} />
                    </View>
        }
        let person = this.props.person;
        let image  = this._getImage(person);
        let name   = this._getName(person);
        return (
            <TouchableHighlight onPress={()=>this.changeState()}>
                <View key={person.id} style={{flexDirection:"row",borderWidth:0, borderRadius:10, borderColor:"#ddd", padding:5}}>
                    {image}
                    <Text style={{fontWeight:'bold', color:"#333", fontSize:21, marginLeft:30, marginTop:30, flexWrap:'wrap', width:150}}>{name}</Text>
                    {icon}
                </View>
            </TouchableHighlight>
        );
    }

    _getName(person){
        if(person.name){
            return person.name;
        }
        return "Yo";
    }

    _getImage(person){
        let image = null;
        if(this.props.person.picture!==null){
            image = <Image source={{uri:person.picture.path}} style={{width:90, height:90, borderRadius:50, borderWidth:2, borderColor:"#000"}}/>;
        }else{
            image = <Image
                style={this.theme.styles.form_comic_picture}
                source={require("../../assets/if_Face_blonde_2099205.png")}
            />;
            if(person.type==='kid'){
                image = <Image
                    style={this.theme.styles.form_comic_picture}
                    source={require("../../assets/if_kid_1930420.png")}
                />;
            }
        }
        return image;
    }

    changeState(){
        let state = !this.props.person.checked;
        if(state){
            this.props.onCheck(this.props.person);
        }else{
            this.props.onUncheck(this.props.person);
        }
    }

}
