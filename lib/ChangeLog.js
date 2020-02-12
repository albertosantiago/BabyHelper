"use strict";

import {AsyncStorage} from 'react-native';
import {noteManager} from './NoteManager';

const md5 = require('js-md5');

class ChangeLog{

    constructor(){
        var self = this;
        AsyncStorage.getItem("@BabyHelper:change-log").then((value) => {
            var logs = JSON.parse(value);
            if(logs===null){
                self.logs = [];
                return;
            }
            logs.sort(function(itemA, itemB){
                if (itemA.date < itemB.date)
                   return 1;
                if(itemA.date > itemB.date)
                   return -1;
                return 0;
            });
            self.logs = logs;
        }).done();
    }

    async applyChange(log){
        if(log.action==='add-note'){
            await noteManager.addExternalNote(log.obj);
        }
        if(log.action==='remove-note'){
            await noteManager.removeExternalNote(log.obj);
        }
    }

    log(action, obj){
        let now = new Date();
        let id = md5(action+obj+now);
        var log = {
            id: id,
            action: action,
            obj:    obj,
            date:   now
        };
        this.logs.push(log);
        AsyncStorage.setItem("@BabyHelper:change-log", JSON.stringify(this.logs));
    }

    getFrom(date){
        return this.logs.filter((val)=>{
            if(val.date >= date) {
                return val;
            }
        });
    }

    getAll(){
        return this.logs;
    }

    getLogByAction(action){
        return this.logs.filter((val)=>{
            if(val.action === action) {
                return val;
            }
        });
    }

    getLogs(){
        return this.logs;
    }

    getKidLog(kidId){
        return this.logs.filter((val)=>{
            if(val.obj.kid_ids.indexOf(kidId) !== -1) {
                return val;
            }
        });
    }

    delete(id){
        var aux = this.logs.filter((val)=>{
            if(val.id !== id) {
                return val;
            }
        });
        this.logs = aux;
        AsyncStorage.setItem("@BabyHelper:change-log", JSON.stringify(this.logs));
    }

    deleteAll(ids){
        var aux = this.logs.filter((val)=>{
            if(ids.indexOf(val.id) === -1) {
                return val;
            }
        });
        this.logs = aux;
        AsyncStorage.setItem("@BabyHelper:change-log", JSON.stringify(this.logs));
    }
}

export const changeLog = new ChangeLog();
