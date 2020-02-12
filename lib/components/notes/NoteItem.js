import React from 'react';
import BaseComponent from '../../BaseComponent.js';

import FeedItem from './FeedItem.js';
import CleaningItem from './CleaningItem.js';
import WeightItem from './WeightItem.js';
import PersonalItem from './PersonalItem.js';
import MedicineItem from './MedicineItem.js';
import ImageItem from './ImageItem.js';
import VideoItem from './VideoItem.js';
import AlarmItem from './AlarmItem.js';
import HeightItem from './HeightItem.js';
import DreamItem from './DreamItem.js';
import BathItem from './BathItem.js';
import TemperatureItem from './TemperatureItem.js';

export default class NoteItem extends BaseComponent {

    constructor(){
        super();
    }

    componentDidMount() {}

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.note === nextProps.note) {
            return false;
        }
        return true;
    }

    render() {
        let note = this.props.note;
        if(note.type==='feed'){
            return <FeedItem note={note} />
        }
        if(note.type==='cleaning'){
            return <CleaningItem note={note} />
        }
        if(note.type==='weight'){
            return <WeightItem note={note} />
        }
        if(note.type==='height'){
            return <HeightItem note={note} />
        }
        if(note.type==='dream'){
            return <DreamItem note={note} />
        }
        if(note.type==='bath'){
            return <BathItem note={note} />
        }
        if(note.type==='temperature'){
            return <TemperatureItem note={note} />
        }
        if(note.type==='personal'){
            return <PersonalItem note={note} />
        }
        if(note.type==='medicine'){
            return <MedicineItem note={note} />
        }
        if(note.type==='image'){
            return <ImageItem note={note} />
        }
        if(note.type==='video'){
            return <VideoItem note={note} />
        }
        if(note.type==='alarm'){
            return <AlarmItem note={note} />
        }
    }
}
