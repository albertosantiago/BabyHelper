"use strict";

import {AsyncStorage} from 'react-native';
const md5 = require('js-md5');
import {profileManager} from './ProfileManager';
import {changeLog} from './ChangeLog';
import {eventApp} from "./EventApp.js";
import {syncro} from "./Syncro.js";

class NoteManager{

    constructor(){
        this.load();
    }

    load(){
        return AsyncStorage.getItem("@BabyHelper:notes").then((value) => {
            var notes = JSON.parse(value);
            if(notes===null){
                this.notes = [];
                return;
            }
            for(let i=0; i<notes.length; i++){
                notes[i].date = new Date(notes[i].date);
            }
            this.notes = notes;
            this.sort();
        }).done();
    }

    sort(){
        this.notes.sort(function(itemA, itemB){
            if (itemA.date < itemB.date)
               return 1;
            if(itemA.date > itemB.date)
               return -1;
            return 0;
        });
    }

    async updateNote(note){
        var notes    = this.notes;
        var auxNotes = [];
        if(notes!==null){
            for(let i=0; i<notes.length;i++){
                if(notes[i].id!==note.id){
                    auxNotes.push(notes[i]);
                }else{
                    auxNotes.push(note);
                }
            }
            this.notes = auxNotes;
            await AsyncStorage.setItem("@BabyHelper:notes", JSON.stringify(this.notes));
        }
    }

    async addNote(note){
        let profile  = await profileManager.getProfile();
        note.id = profile.id+"_"+md5(new Date().toISOString()+'--'+Math.random()).substring(0,15);
        note.user_id = profile.id;
        note.syncronized = false;
        note.createdAt   = new Date();
        this.notes.push(note);
        this.sort();
        await AsyncStorage.setItem("@BabyHelper:notes", JSON.stringify(this.notes));
        changeLog.log('add-note', note);
        syncro.tryExec({
            func: '_postNotes',
            args: []
        });
    }

    async removeNote(noteId){
        var notes = this.notes;
        if(notes!==null){
            let auxNotes = [];
            for(let i=0; i<notes.length;i++){
                if(notes[i].id!==noteId){
                    auxNotes.push(notes[i]);
                }else{
                    changeLog.log('remove-note', notes[i]);
                    syncro.tryExec({
                        func: '_postNotes',
                        args: []
                    });
                }
            }
            this.notes = auxNotes;
            await AsyncStorage.setItem("@BabyHelper:notes", JSON.stringify(this.notes));
        }
        eventApp.emit("note-removed");
    }

    getNotes(...args){
        var params = {
            orderBy: 'date',
            orderDir: 'desc',
            size: 1000,
        };

        var filters = args[0];
        if(args.length>1){
            params = {...params, ...args[1]};
        }

        if(filters===undefined){
            var ret = this.notes;
        }else{
            var ret = this.filterNotes(filters);
        }
        ret.sort(function(itemA, itemB){
            var key = params.orderBy;
            var orderMod = 1;
            if(params.orderDir=='asc'){
                orderMod = -1;
            }
            if (itemA[key] < itemB[key])
               return 1*orderMod;
            if(itemA[key] > itemB[key])
               return -1*orderMod;
            return 0;
        });
        return ret.slice(0,params.size);
    }

    countNotes(filters){
        var ret = this.notes;
        if(filters!==undefined){
            ret = this.filterNotes(filters);
        }
        return ret.length;
    }

    filterNotes(filters){
        var ret = this.notes.filter(function(note){
            if(filters instanceof Array){
                let i=0;
                for(i;i<filters.length;i++){
                    if(filters[i].type==='same-day'){
                        let auxDate = new Date(note[filters[i].key]);
                        if(auxDate.toDateString()!==filters[i].val.toDateString()){
                            return;
                        }
                    }
                    if(filters[i].type==='!=='){
                        if(note[filters[i].key]===filters[i].val){
                            return;
                        }
                    }
                    if(filters[i].type==='OR'){
                        if(filters[i].val.indexOf(note[filters[i].key])===-1){
                            return;
                        }
                    }
                    if(filters[i].type==='indexOf'){
                        if((note[filters[i].key].indexOf(filters[i].val))===-1){
                            return;
                        }
                    }
                    if(filters[i].type===undefined){
                        if(note[filters[i].key]!==filters[i].val){
                            return;
                        }
                    }
                }
            }else{
                if(note[filters.key]!==filters.val){
                    return;
                }
            }
            return note;
        });
        return ret;
    }

    getLastNote({type, kidId}){
        var ret = null;
        let notes = this.getNotes([{
            key: 'kid_ids',
            val:  kidId,
            type: 'indexOf'
        },{
            key: 'type',
            val:  type
        }]);
        notes.forEach(function(note){
            if(ret===null){
                ret = note;
            }else{
                if(ret.date<note.date){
                    ret = note;
                }
            }
        });
        return ret;
    }

    getPreviousNoteType(note){
        let to = this.notes.length;
        let notes = this.notes;
        for(let i=0;i<to;i++){
            if((notes[i].id!==note.id)&& (notes[i].kidId!==note.KidId)){
                if(notes[i].type === note.type){
                    if(notes[i].date < note.date){
                        return notes[i];
                    }
                }
            }
        }
    }

    async addExternalNote(note){
        let id  = note.id;
        note.syncronized = true;
        note.date = new Date(note.date);
        if((note.type==='image')||(note.type==='video')){
            note.downloaded = false;
        }
        let aux = [];
        let exists = false;
        this.notes.forEach(function(element) {
            if(element.id!==id){
                aux.push(element);
            }else{
                exists = true;
                aux.push(note);
            }
        });
        if(!exists){
            aux.push(note);
        }
        this.notes = aux;
        this.sort();
        await AsyncStorage.setItem("@BabyHelper:notes", JSON.stringify(this.notes));
    }

    async removeExternalNote(note){
        let id  = note.id;
        let aux = [];
        this.notes.forEach(function(element) {
            if(element.id!==id){
                aux.push(element);
            }
        });
        this.notes = aux;
        await AsyncStorage.setItem("@BabyHelper:notes", JSON.stringify(this.notes));
    }
}

export let noteManager = new NoteManager();
