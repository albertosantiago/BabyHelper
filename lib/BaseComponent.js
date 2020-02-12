import React from 'react';
import {theme} from './Theme.js';
import {eventApp} from "./EventApp.js";

export default class BaseComponent extends React.Component {

    constructor(props) {
        super(props);
        this.loadTheme();
        this.loadTheme = this.loadTheme.bind(this);
        this.listeners = [];
        this.addListener = this.addListener.bind(this);
        this.removeListeners = this.removeListeners.bind(this);
        this.addListener("theme-change", this.loadTheme);
    }

    componentDidMount() {}

    componentWillUnmount() {
        this.removeListeners();
    }

    removeListeners(){
        if(this.listeners.length>0){
            for(let listener of this.listeners){
                eventApp.removeListener(listener.event, listener.func);
            }
        }
    }

    addListener(event, func){
        this.listeners.push({
            event,
            func
        });
        eventApp.addListener(event, func);
    }

    render() {}

    loadTheme(){
        this.theme = {};
        this.theme.styles = theme.getStyles();
        this.theme.colors = theme.getColors();
    }
}
