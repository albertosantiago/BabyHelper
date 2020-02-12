"use strict";

import {AsyncStorage} from 'react-native';
const md5 = require('js-md5');

const defaultProfile = {
    id: null,
    picture:null,
    name:null,
    password: null,
    email: null,
    token:null,
    registered: false,
    confirmed: false,
    associated_users: []
};


class ProfileManager{

    constructor(){
        this.usersProfiles = [];
        this.profile = undefined;
        this.load();
    }

    async load(){
        await this.loadProfile();
        await this.loadUsersProfiles();
    }

    async loadUsersProfiles(){
        var value = await AsyncStorage.getItem("@BabyHelper:user-profiles");
        this.usersProfiles = JSON.parse(value);
        return this.usersProfiles;
    }

    async loadProfile(){
        var value = await AsyncStorage.getItem("@BabyHelper:profile");
        this.profile = JSON.parse(value);
        return this.profile;
    }

    async get(...args){
        return new Promise((resolve, reject) => {
            if((this.profile===undefined)||(this.profile===null)){
                setTimeout(() => {
                    resolve(this.get(...args));
                }, 100);
            }else{
                if(this.profile[args[0]]!==null){
                    if(args.length>1){
                        let ret = {};
                        for(let i=0;i<args.length;i++){
                            ret[args[i]] = this.profile[args[i]];
                        }
                        return ret;
                    }else{
                        resolve(this.profile[args[0]]);
                    }
                }else{
                    resolve(false);
                }
            }
        });
    }

    async set(profile){
        this.profile = {...this.profile, ...profile};
        return await AsyncStorage.setItem("@BabyHelper:profile", JSON.stringify(this.profile));
    }

    async getProfile() {
        return new Promise((resolve, reject) => {
            if(this.profile===undefined){
                setTimeout(async () => {
                    if(this.profile===undefined){
                        resolve(await this.getProfile());
                    }else{
                        resolve(this.profile);
                    }
                }, 100);
            }else{
                resolve(this.profile);
            }
        });
    }

    getDefaultProfile(){
        let aux = defaultProfile;
        aux.id  = md5(new Date().toISOString()).substring(0,15);
        return aux;
    }

    setUserProfile(profile){
        return new Promise((resolve, reject) => {
            let id = profile.id;
            let aux = [];
            if((this.usersProfiles!==null)&&(this.usersProfiles.length!==0)){
                this.usersProfiles.forEach(function(element) {
                    if(element.id!==id){
                        aux.push(element);
                    }
                });
            }
            aux.push(profile);
            this.usersProfiles = aux;
            AsyncStorage.setItem("@BabyHelper:user-profiles", JSON.stringify(this.usersProfiles)).then(()=>{
                resolve(profile.id);
            });
        });
    }

    getUserProfile(userId){
        for(let user of this.usersProfiles){
            if(user.id===userId){
                return user;
            }
        }
        if(userId===this.profile.id){
            return this.profile;
        }
        return false;
    }

    getAllUserProfiles(){
        return this.usersProfiles;
    }

    isLogged(){
        return ((this.profile!== null)&&(this.profile.confirmed)) ? true: false;
    }

}

export let profileManager = new ProfileManager();
