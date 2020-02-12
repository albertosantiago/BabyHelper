"use strict";
import {AsyncStorage} from 'react-native';
import {netManager} from './NetManager';
import Child from './models/Child';
import {eventApp} from "./EventApp.js";

const md5 = require('js-md5');

class KidManager{

    constructor(){
        this.loadKids();
    }

    loadKids(){
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem("@BabyHelper:childrens").then((value) => {
                var childrens = JSON.parse(value);
                if(childrens===null){
                    this.childrens = [];
                    return;
                }
                childrens.sort(function(itemA, itemB){
                    if (itemA.date < itemB.date)
                       return 1;
                    if(itemA.date > itemB.date)
                       return -1;
                    return 0;
                });
                this.childrens = childrens;
                resolve(childrens);
            });
        });
    }

    getAllChilds(){
        var self = this;
        return new Promise((resolve, reject) => {
            if(self.childrens===undefined){
                var check = function(){
                    if(self.childrens===undefined){
                        setTimeout(check, 100);
                    }else{
                        resolve(self.childrens);
                    }
                };
                setTimeout(check, 100);
            }else{
                resolve(self.childrens);
            }
        });
    }

    async countChilds(){
        let childs = await this.getAllChilds();
        return childs.length;
    }

    setCurrentChild(id){
        this.currentChild = this.getChild(id);
    }

    getCurrentChild(){
        if(this.currentChild===undefined){
            if(this.childrens.length!==0){
                return new Child(this.childrens[0]);
            }
        }
        let child = new Child(this.currentChild);
        return child;
    }

    getCurrentChildId(){
        var currentChild = this.getCurrentChild();
        return currentChild.id;
    }

    getChild(id){
        var child = this.childrens.find(function(child){
            if(child.id===id){
                return child;
            }
        });
        return new Child(child);
    }

    getChilds(ids){
        let ret = [];
        for(let id of ids){
            var child = this.childrens.find(function(child){
                if(child.id===id){
                    return child;
                }
            });
            child = new Child(child);
            ret.push(child);
        }
        return ret;
    }

    async saveChild(child){
        return new Promise((resolve, reject) => {
            if((child.id===null)||(child.id===undefined)){
                let id = child.user_id+"_"+md5(new Date().toISOString()).substring(0,15);
                child.id = id;
                this.childrens.push(child);
            }else{
                let id = child.id;
                let aux = [];
                this.childrens.forEach(function(element) {
                    if(element.id!==id){
                        aux.push(element);
                    }else{
                        aux.push(child);
                    }
                });
                this.childrens = aux;
            }
            AsyncStorage.setItem("@BabyHelper:childrens", JSON.stringify(this.childrens)).then(()=>{
                resolve(child.id);
            });
        });
    }

    async saveServerChild(child){
        let id  = child.id;
        let aux = [];
        let exists = false;
        this.childrens.forEach(function(element) {
            if(element.id!==id){
                aux.push(element);
            }else{
                exists = true;
                aux.push(child);
            }
        });
        if(!exists){
            aux.push(child);
        }
        this.childrens = aux;
        await AsyncStorage.setItem("@BabyHelper:childrens", JSON.stringify(this.childrens));
    }

    async removeChild(childId){
        var childrens = this.childrens;
        if(childrens!==null){
            let auxChildrens = [];
            for(let i=0; i<childrens.length;i++){
                if(childrens[i].id!==childId){
                    auxChildrens.push(childrens[i]);
                }
            }
            this.childrens = auxChildrens;
            await AsyncStorage.setItem("@BabyHelper:childrens", JSON.stringify(auxChildrens));
            eventApp.emit("kid-removed");
        }
    }

    async removeEditor(childId, editorId){
        var childrens = this.childrens;
        if(childrens!==null){
            let auxChildrens = [];
            for(let i=0; i<childrens.length;i++){
                if(childrens[i].id!==childId){
                    auxChildrens.push(childrens[i]);
                }else{
                    let child = childrens[i];
                    let auxEditors = [];
                    let editors    = child.editors;
                    for(let currentEditorId of editors){
                        if(editorId!==currentEditorId){
                            auxEditors.push(currentEditorId);
                        }
                    }
                    child.editors = auxEditors;
                    auxChildrens.push(child)
                }
            }
            this.childrens = auxChildrens;
            await AsyncStorage.setItem("@BabyHelper:childrens", JSON.stringify(auxChildrens));
        }
    }

    async getShareToken(kid){
        let resp = await netManager.get({
            url:'share/token/'+kid.id
        });
        if(resp.status===200){
            let ret = await resp.json();
            return ret.data.token;
        }
        throw {message:'No se pudo conseguir el token', code: 'connection_failure'};
    }
}

export let kidManager = new KidManager();
