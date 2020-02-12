import React from 'react';
import {View} from 'react-native';
import BaseComponent from '../lib/BaseComponent.js';
import KidItem from '../lib/components/KidItem';
import {kidManager} from '../lib/KidManager.js';
import { Actions } from 'react-native-router-flux'

export default class KidHome extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            child: props.child
        };
    }

    componentDidMount(){
        Actions.refresh({title:this.state.child.name});
    }

    render() {
        if(!this.state.child) return <View></View>;
        return <KidItem child={this.state.child} />
    }

}
