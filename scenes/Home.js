import React from 'react';
import { Text, View, Image, FlatList, TouchableHighlight } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

import BaseComponent from '../lib/BaseComponent.js';
import KidList from '../lib/components/KidList';
import KidItem from '../lib/components/KidItem';
import {kidManager} from '../lib/KidManager.js';
import Button from '../lib/components/Button';

export default class Home extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            childrens: null,
            currentChildId: null,
            isModalVisible: false
        };
        this.renderEmpty = this.renderEmpty.bind(this);
        this.renderChildAlone = this.renderChildAlone.bind(this);
        this.renderChildrens  = this.renderChildrens.bind(this);
        this.loadChildrens = this.loadChildrens.bind(this);
    }

    componentDidMount() {
        this.addListener("kid-removed", this.loadChildrens);
        this.loadChildrens();
    }

    async loadChildrens(){
        var childrens = await kidManager.getAllChilds();
        this.setState({"childrens": childrens});
    }

    render() {
        if((this.state.childrens!==null)&&(this.state.childrens.length>0)){
            if(this.state.childrens.length===1){
                return this.renderChildAlone();
            }
            return this.renderChildrens();
        }
        return this.renderEmpty();
    }

    renderEmpty(){
        return (
            <View style={[this.theme.styles.home_container,{paddingTop:60}]}>
                <Text style={[this.theme.styles.home_title,{padding:20}]}>¡Bienvenido a BabyHelper!</Text>
                <View>
                    <Image
                        style={{width: 120, height: 120}}
                        source={require("../assets/if_kid_1930420.png")}
                    />
                </View>
                <Button
                    style={this.theme.styles.global_default_button}
                    onPress={()=> Actions.babyForm()}
                    >
                    <Text style={this.theme.styles.global_default_button_text}>¡Empieza Ahora!</Text>
                </Button>
            </View>
        );
    }

    renderChildAlone(){
        return <KidItem child={this.state.childrens[0]} />
    }

    renderChildrens(){
        return <KidList childrens={this.state.childrens} onPressDelete={this.deleteChild} />
    }

}
