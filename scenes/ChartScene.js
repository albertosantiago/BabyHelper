import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Svg, { Circle, Rect } from 'react-native-svg'
import BaseComponent from '../lib/BaseComponent.js';
import * as d3scale from 'd3-scale';
import * as shape from 'd3-shape'
import LineChart from '../lib/components/chart/LineChart';

import {Dimensions, Platform} from 'react-native';
var { width, height } = Dimensions.get('window');

import {kidManager} from '../lib/KidManager.js';
import {noteManager} from '../lib/NoteManager.js';

export default class ChartScene extends BaseComponent {

    constructor() {
        super();
        this.currentKid = kidManager.getCurrentChild();
    }

    componentDidMount() {}


    render() {
        var key = "Peso de "+this.currentKid.name;
        var data = {}
        data[key] = [];

        var notes = noteManager.getNotes([{
            key:'kid_ids',
            val: this.currentKid.id,
            type: 'indexOf'
        },{
            key: 'type',
            val: 'weight'
        }],{
            orderBy: 'date',
            orderDir: 'asc'
        });
        for(let i=0;i<notes.length;i++){
            let date = new Date(notes[i].date);
            let weight = (notes[i].kg*1000)+notes[i].gr;
            data[key].push([
                date, weight
            ]);
        }
        const colors = ['#000'];

        return (
            <View style={{flex:1,flexDirection:'column', backgroundColor:"#fff"}}>
                <View style={{height:"80%", paddingLeft:10}}>
                    <View style={{flex:1,flexDirection:'row', backgroundColor:"#fff"}}>
                        <LineChart
                            exObj={data}
                            colors={colors}
                        />
                    </View>
                </View>
            </View>
        );
    }
}
