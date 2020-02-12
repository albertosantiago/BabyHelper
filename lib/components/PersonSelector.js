import React from 'react';
import { Text, View,
    TouchableOpacity,
    Image, TouchableHighlight,
    FlatList
} from 'react-native';

import BaseComponent from '../BaseComponent.js';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';


export default class PersonSelector extends BaseComponent {

    constructor(props){
        super(props);
        this.state = {
            selected: this.props.selected,
            people:   this.props.people,
            type: this.props.type,
        };
        this.showSelector  = this.showSelector.bind(this);
        this._renderItem   = this._renderItem.bind(this);
        this._keyExtractor = this._keyExtractor.bind(this);
    }

    componentDidMount(){}

    render() {
        if(this.state.people.length<=1){
            return <View></View>;
        }
        let person = this._getCurrentPerson();
        if(this.props.size==='small'){
            return this.renderSelectedSmall(person);
        }
        if((this.props.showImg===undefined)||(this.props.showImg===true)){
            return this.renderSelectedWithImg(person);
        }
        return this.renderSelected(person);
    }

    _getCurrentPerson(){
        if(this.state.selected!==undefined) {
            return this.state.selected
        }
        let curentPerson = undefined;
        for(let person of this.state.people){
            if(person.default){
                return person;
            }
        }
        return this.state.people[0];
    }

    renderSelected(person){
        let name = person.name;
        return (
            <View key={person.id} style={{height:40, borderWidth:0, borderColor:"#ddd", width:'100%', margin:'0%', marginBottom:0}}>
                {this._renderSelector()}
                <TouchableHighlight onPress={()=> {this.showSelector()}} style={{margin:5}}>
                    <View style={this.theme.styles.global_fltListItem}>
                        <View style={this.theme.styles.global_fltDesc}>
                            <Text style={{margin:10, marginTop:0, fontSize:22, fontWeight: 'bold', color:"#333"}}>{name}</Text>
                        </View>
                        <View style={{paddingTop:0, alignItems:'flex-end'}}>
                            <Icon name="md-arrow-dropdown-circle" size={30} color="#000" />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    renderSelectedSmall(person){
        let name = person.name;
        return (
            <View key={person.id} style={{height:50, borderWidth:0, borderColor:"#ddd", width:'100%', margin:'0%', marginBottom:0}}>
                {this._renderSelector()}
                <TouchableHighlight onPress={()=> {this.showSelector()}}
                    style={{margin:0, alignItems:'flex-end',
                            justifyContent:'flex-end', height:110,
                            width:'100%'}}
                >
                    <View style={this.theme.styles.global_fltListItem}>
                        <View style={this.theme.styles.global_fltDesc}>
                            <Text style={{margin:10, marginTop:20, fontSize:14, fontWeight: 'normal', color:"#333"}}>{name}</Text>
                        </View>
                        <View style={{paddingTop:20, alignItems:'flex-end'}}>
                            <Icon name="md-arrow-dropdown" size={20} color="#000" />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    renderSelectedWithImg(person){
        let picture = null;
        if(this.props.type==='kid'){
            picture = <Image
                style={{ margin:20, width:60, height:60, borderRadius: 60, borderWidth: 5}}
                source={require("../../assets/if_kid_1930420.png")}
            />;
        }else{
            picture = <Image
                style={{ margin:20, width:60, height:60, borderRadius: 60, borderWidth: 5}}
                source={require("../../assets/if_Face_blonde_2099205.png")}
            />;
        }
        if(person.picture!==null){
            picture = <Image source={{uri: person.picture.path }} style={{ margin:10, width:90, height:90, borderRadius: 45, borderWidth: 3, borderColor: '#ddd' }} />;
        }
        let name = person.name;
        return (
            <View key={person.id} style={{height:110, borderWidth:0, borderColor:"#ddd", width:'100%', margin:'0%', marginBottom:0}}>
                {this._renderSelector()}
                <TouchableHighlight onPress={()=> {this.showSelector()}} style={{margin:0,height:110, width:'100%'}}>
                    <View style={this.theme.styles.global_fltListItem}>
                        <View style={this.theme.styles.global_fltImgBox}>
                            {picture}
                        </View>
                        <View style={this.theme.styles.global_fltDesc}>
                            <Text style={{margin:10, marginTop:40, fontSize:22, fontWeight: 'bold', color:"#333"}}>{name}</Text>
                        </View>
                        <View style={{paddingTop:40, alignItems:'flex-end'}}>
                            <Icon name="md-arrow-dropdown-circle" size={30} color="#000" />
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _renderSelector(){
        if(!this.state.visibleOptions){
            return <View></View>;
        }
        return (
            <Modal
                isVisible={true}
                animationIn='slideInLeft'
                animationOut='slideOutRight'
            >
                <View style={{backgroundColor:"#fff"}}>
                    <FlatList
                        data={this.state.people}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        />
                </View>
            </Modal>
        );
    }

    _keyExtractor(item, index){
        return  item.id;
    }

    _renderItem(obj){
        let person = obj.item;
        let picture = <Image
            style={{ margin:20, width:70, height:70, borderRadius: 60, borderWidth: 5}}
            source={require("../../assets/if_kid_1930420.png")}
        />;
        if(person.picture!==null){
            picture = <Image source={{uri: person.picture.path }} style={{ margin:20, width:100, height:100, borderRadius: 50, borderWidth: 5, borderColor: '#ddd' }} />;
        }
        let name = person.name;
        return (
            <View key={person.id} style={{backgroundColor:"#fff", borderBottomWidth:1, borderColor:"#ddd", width:'100%', margin:'0%', marginBottom:0}}>
                <TouchableHighlight onPress={()=> {this.setCurrentPerson(person)}} style={{margin:5}}>
                    {(person.id==-1) ?
                        <View style={this.theme.styles.global_fltListItem}>
                            <View style={this.theme.styles.global_fltDesc}>
                                <Text style={{margin:10, width:"100%", marginTop:40, fontSize:24, fontWeight: 'bold', color:"#333", flexWrap:"wrap"}}>{name}</Text>
                            </View>
                        </View>
                        :
                        <View style={this.theme.styles.global_fltListItem}>
                            <View style={this.theme.styles.global_fltImgBox}>
                                {picture}
                            </View>
                            <View style={this.theme.styles.global_fltDesc}>
                                <Text style={{margin:10, width:150, marginTop:40, fontSize:24, fontWeight: 'bold', color:"#333", flexWrap:"wrap"}}>{name}</Text>
                            </View>
                        </View>
                    }
                </TouchableHighlight>
            </View>
        );
    }

    setCurrentPerson(person){
        this.setState({
            selected: person,
            visibleOptions: false
        });
        this.props.onChange(person);
    }

    showSelector(){
        this.setState({
            visibleOptions: true
        })
    }
}
