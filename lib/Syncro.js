import config from "./Config";
import {AsyncStorage} from 'react-native';
import {netManager} from './NetManager';
import {profileManager} from './ProfileManager';
import {kidManager} from './KidManager';
import {noteManager} from './NoteManager';
import {changeLog} from './ChangeLog';
import {NetInfo} from 'react-native';
import {cron} from './Cron';
import {crashLogger} from './CrashLogger';

var RNFS = require('react-native-fs');

const iterationsConfig = {
    kids:    30,
    notes:   10,
    profile: 10,
    kidsModifications:  10,
    associatedProfiles: 30,
    externalProfiles:   30,
    deleteEditors:      60,
    kidsPermits: 10,
    deleteKids:  30,
    deviceInfo:  30
};

const STATUS = {
    STOPPED: 0,
    WORKING: 1
};

class Syncro{

    constructor(){
        this.status = STATUS.STOPPED;
        this.iterations = 0;
        this.exec = this.exec.bind(this);
        this.syncroKidMods = this.syncroKidMods.bind(this);
    }

    start(){
        cron.register(this.exec, 1, 'syncro');
    }

    async exec(){
        let isConnected = netManager.checkConnection();
        return new Promise(async (resolve, reject) => {
            if(this.status === STATUS.WORKING){
                resolve();
                return;
            }
            try{
                this.status = STATUS.WORKING;
                if(isConnected){
                    this.syncro().then(()=>{
                        this.iterations += 1;
                        this.status = STATUS.STOPPED;
                        resolve();
                    },()=>{
                        this.status = STATUS.STOPPED;
                        this.iterations += 1;
                        resolve();
                    });
                }
            }catch(e){
                this.status = STATUS.STOPPED;
                resolve();
            }
        });
    }

    async tryExec({func, args}){
        let isConnected = netManager.checkConnection();
        try{
            if(isConnected){
                let isConfirmed = await profileManager.get('confirmed');
                if(isConfirmed){
                    return this[func](...args);
                }
            }else{
                console.log("Not connected.");
            }
        }catch(e){
            console.error(e);
        }
    }

    syncro(){
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem("@BabyHelper:syncro:status").then(async (value) => {
                try{
                    if((value==="initial")||(value===null)){
                        if(this.checkExecFor('deviceInfo')){
                            await this.syncroDeviceInfo();
                        }
                    }else{
                        let isConfirmed = await profileManager.get('confirmed');
                        if(isConfirmed){
                            await this.syncroChanges();
                        }
                    }
                    resolve();
                }catch(e){
                    reject();
                }
            });
        });

    }

    async syncroDeviceInfo(){
        AsyncStorage.getItem("@BabyHelper:deviceInfo").then( async (value) => {
            try{
                var resp = await netManager.post({
                    url: 'devices/new',
                    data: JSON.parse(value),
                    includeTokens: false
                });
                if(resp.status===200){
                    var body = await resp.json();
                    AsyncStorage.setItem("@BabyHelper:syncro:status", 'done');
                    let deviceInfo = JSON.parse(value);
                    deviceInfo.token    = body.data.token;
                    deviceInfo.serverId = body.data.id;
                    AsyncStorage.setItem("@BabyHelper:deviceInfo", JSON.stringify(deviceInfo));
                }
            }catch(e){
                crashLogger.log(e);
            }
        });
    }

    async syncroChanges(){

        if(this.checkExecFor('associatedProfiles')){
            await this.syncroAssociatedProfiles();
        }
        if(this.checkExecFor('kidsModifications')){
            await this.syncroKidMods();
        }
        if(this.checkExecFor('kids')){
            await this.syncroKidProfiles();
            await this.syncroDeleteKids();
        }
        if(this.checkExecFor('kidsPermits')){
            await this.syncroKidPermits();
        }
        if(this.checkExecFor('notes')){
            await this.syncroNotes();
        }
        if(this.checkExecFor('profile')){
            await this.syncroProfile();
        }
        if(this.checkExecFor('externalProfiles')){
            await this.syncroExternalProfiles();
        }
        if(this.checkExecFor('deleteEditors')){
            await this.syncroDeleteEditors();
        }
        return;
    }

    checkExecFor(key){
        if((this.iterations%iterationsConfig[key])===0){
            return true;
        }
        return false;
    }

    async syncroKidPermits(){
        let currentUser = await profileManager.getProfile();
        let localKids   = await kidManager.getAllChilds();
        var ret = await netManager.get({
            url: 'kid/editable-list'
        });
        if(ret.status==200){
            let res  = await ret.json();
            let serverKids = res.data;
            for(let localKid of localKids){
                if(localKid.user_id!==currentUser.id){
                    let isOk = false;
                    for(let serverKid of serverKids){
                        if(localKid.id===serverKid.id){
                            isOk = true;
                        }
                    }
                    if(!isOk){
                        kidManager.removeChild(localKid.id);
                    }
                }
            }
        }
    }

    async syncroProfile(){
        let profile = await profileManager.getProfile();
        if(profile.confirmed===true){
            if(!profile.updatedServer){
                const data = new FormData();
                data.append('name', profile.name);
                data.append('id', profile.id);
                if(profile.picture!==null){
                    let chunks = profile.picture.path.split('.');
                    data.append('picture', {
                        uri:  profile.picture.path,
                        type: profile.picture.mime,
                        name: 'picture.'+chunks[1]
                    });
                }
                netManager.post({
                    url:'user/update',
                    data: data,
                    multipart: true
                }).then((resp) => {
                    if(resp.status===200){
                        profileManager.set({updatedServer: true});
                    }
                });
            }
        }
    }

    //SYNCRO KIDS FUNCTIONS
    //=========================================================
    async syncroKidMods(){
        return new Promise(async(resolve, reject)=>{
            var profile = await profileManager.getProfile();
            var kids    = await kidManager.getAllChilds();
            for(let kid of kids){
                if(!kid.updatedServer){
                    if(kid.user_id === profile.id){
                        await this._postKid(kid)
                    }
                }
            }
            resolve();
        });
    }

    async syncroKidProfiles(){
        return new Promise(async(resolve, reject)=>{
            var kids    = await kidManager.getAllChilds();
            for(let kid of kids){
                try{
                    await this._getKid(kid);
                }catch(e){
                    continue;
                }
            }
            resolve();
        });
    }

    _postKid(kid){
        return new Promise((resolve, reject)=>{
            const data = new FormData();
            data.append('id', kid.id);
            data.append('name', kid.name);
            data.append('birthdate', ''+kid.birthdate);
            data.append('sex', kid.sex);
            if((kid.picture!==null)&&(kid.picture.path!==null)){
                let chunks = kid.picture.path.split('.');
                data.append('picture', {
                    uri:   kid.picture.path,
                    type:  kid.picture.mime,
                    name: 'picture.'+chunks[1]
                });
            }
            netManager.post({
                url:'kid/store',
                data: data,
                multipart: true
            }).then(async(resp) => {
                if(resp===undefined){
                    reject();
                    return;
                }
                if(resp.status===200){
                    let ret = await resp.json();
                    let serverKid = ret.data;
                    kid.picture.url   = serverKid.picture;
                    kid.version       = serverKid.version;
                    kid.updatedServer = true;
                    await kidManager.saveChild(kid);
                    resolve(kid);
                }else{
                    reject();
                }
            },(e)=>{
                crashLogger.log(e);
                resolve();
            });
        });
    }

    _getKid(kid){
        return new Promise((resolve, reject)=>{
            netManager.get({
                url:'kid/'+kid.id,
                multipart: true
            }).then(async(resp) => {
                if(resp.status===200){
                    let ret = await resp.json();
                    let serverKid = ret.data;
                    if(serverKid.version!==kid.version){
                        serverKid.birthdate = new Date(serverKid.birthdate*1000);
                        if(serverKid.picture!==null){
                            /**
                            * No descargamos la imagen si ya esta descargada.
                            **/
                            if(((kid.picture!==undefined)&&(kid.picture!==null))&&(kid.picture.url!==serverKid.picture)){
                                urlImg = serverKid.picture;
                                ret    = await netManager.downloadImg({url:urlImg});
                                serverKid.picture = null;
                                if(ret.status===200){
                                    serverKid.picture = {
                                        path: ret.filePath,
                                        mime: ret.mime,
                                        url:  urlImg
                                    };
                                }
                            }else{
                                serverKid.picture = kid.picture;
                            }
                        }
                        kid = {...kid, ...serverKid};
                        await kidManager.saveServerChild(kid);
                    }
                    resolve();
                }else{
                    resolve();
                }
            }, (e)=>{
                reject(e);
            });
        });
    }

    async syncroAssociatedProfiles(){
        var ret = await netManager.get({
            url: 'auth/user'
        });
        if(ret.status==200){
            let res = await ret.json();
            let profile = res.data;
            let update  = {
                associated_users: profile.associated_users
            };
            await profileManager.set(update);
        }
    }

    //SYNCRO EXTERNAL PROFILES
    async syncroExternalProfiles(){
        var currentUser = await profileManager.getProfile();
        var kids        = await kidManager.getAllChilds();
        var usersToUpdate = currentUser.associated_users;

        kids.forEach(async (kid)=> {
            if((kid.editors!==null)
            &&(kid.editors!==undefined)){
                usersToUpdate = [...usersToUpdate, ...kid.editors];
            }
            usersToUpdate.push(kid.user_id);
        });
        //Eliminamos nuestro perfil de la actualización
        if(usersToUpdate.length>0){
            usersToUpdate = usersToUpdate.filter((userId)=>{
                if(userId!==currentUser.id){
                    return true;
                }
                return false;
            });
        }
        usersToUpdate.forEach(async(userId)=>{
            netManager.get({
                url:'user/profile/'+userId,
                multipart: true
            }).then(async(resp) => {
                if(resp.status===200){
                    let ret = await resp.json();
                    let serverProfile = ret.data;
                    let urlPicture    = serverProfile.picture;
                    let localProfile  = profileManager.getUserProfile(serverProfile.id);
                    if(localProfile.picture){
                        if(localProfile.picture.url === urlPicture ){
                            serverProfile.picture = localProfile.picture;
                            await profileManager.setUserProfile(serverProfile);
                            return;
                        }
                    }
                    ret = await netManager.downloadImg({url:urlPicture});
                    serverProfile.picture = null;
                    if(ret.status===200){
                        serverProfile.picture = {
                            path: ret.filePath,
                            mime: ret.mime,
                            url: urlPicture
                        };
                    }
                    await profileManager.setUserProfile(serverProfile);
                }
            });
        });
    }

    //SYNCRO NOTES FUNCTIONS
    //---------------------------------------------------------
    async syncroNotes() {
        await this._getNotes(false);
        await this._postNotes();
    }

    async _postNotes(){
        return new Promise(async (resolve, reject)=>{
            let noteTypes = ['add-note','remove-note'];
            for(let noteType of noteTypes){
                var data = changeLog.getLogByAction(noteType);
                if(data.length===0){
                    continue;
                }
                for(let log of data){
                    var changes = {data:log};
                    let ret = await netManager.post({
                        url: 'change-log/update',
                        data: changes
                    });
                    if(ret.status===200){
                        let note = log.obj;
                        note.syncronized = true;
                        noteManager.updateNote(note);
                        changeLog.delete(log.id);
                    }
                    if(ret.status===409){
                        let json = await ret.json();
                        if(json.message==='log_already_exists'){
                            let note = log.obj;
                            note.syncronized = true;
                            noteManager.updateNote(note);
                            changeLog.delete(log.id);
                        }
                    }
                }
            }
            resolve();
        });
    }

    /**
    Cogemos las notas de los crios.
    Esto lo ponemos de este modo para hacer que en el login se espera para redireccionar
    hasta que se carguen correctamente las notas de los chavales.
    **/
    async _getNotes(includeUserLogs){
        return new Promise(async (resolve, reject)=>{
            var kids = await kidManager.getAllChilds();
            for (let i=0; i<kids.length;i++) {
                let kid = kids[i];
                if(kid.updatedServer!==true){
                    continue;
                }
                let lastSyncro = await AsyncStorage.getItem("@BabyHelper:syncro:last-note-update:"+kid.id);
                let from = await this._getNotesForChild(kid, includeUserLogs, lastSyncro);
                if(from!==null){
                    await AsyncStorage.setItem("@BabyHelper:syncro:last-note-update:"+kid.id, ''+from);
                }
            }
            resolve();
        });
    }

    async _getNotesForChild(kid, includeUserLogs, from){
        let params = [];
        if(from!==undefined){
            params['from'] = from;
        }
        params['includeUserLogs'] = includeUserLogs;
        params['kidId'] = kid.id;
        let url = 'change-log/kid';
        let ret = await netManager.get({url, data:params});
        if(ret.status===200){
            let res = await ret.json();
            for(let log of res.data){
                await changeLog.applyChange(log);
            }
            let from = res.meta.from;
            return from;
        }
        return null;
    }

    async syncroDeleteEditors(){
        var logs = changeLog.getLogByAction('remove-editor');
        if(logs.length===0){
            return;
        }
        for(log of logs){
            netManager.post({
                url: 'kid/remove-editor',
                data: log
            }).then((ret) => {
                if(ret.status===200){
                    changeLog.delete(log.id);
                }
            });
        }
    }

    async syncroDeleteKids(){
        var logs = changeLog.getLogByAction('remove-kid');
        if(logs.length===0){
            return;
        }
        for(log of logs){
            netManager.post({
                url: 'kid/remove',
                data: {
                    kid_id: log.obj.kid_ids[0]
                }
            }).then((ret) => {
                let statusToErase = [200,404,410,401];
                if(statusToErase.indexOf(ret.status)!==-1){
                    changeLog.delete(log.id);
                }
            });
        }
    }
    //Carga de todos los datos disponibles...
    //-----------------------------------------------------------
    async loadFromServer(){
        return new Promise((resolve, reject)=>{
            this.loadProfile().then(()=>{
                this.loadKids().then(()=> {
                    this._getNotes(true).then(() => {
                        resolve()
                    });
                });
            });
        });
    }

    //{"message":"authenticated_user","data":{"id":9,"name":"Alberto","email":"ambertonotaez@gmail.com","created_at":"2018-02-03 10:56:42","updated_at":"2018-02-03 10:56:42"}}
    async loadProfile(){
        var ret = await netManager.get({
            url: 'auth/user'
        });
        if(ret.status==200){
            let res = await ret.json();
            let profile = res.data;
            if(profile.picture!==null){
                ret = await netManager.downloadImg({url:profile.picture});
                profile.picture = null;
                if(ret.status===200){
                    profile.picture = {
                        path: ret.filePath,
                        mime: ret.mime,
                    };
                }
            }
            await profileManager.set(profile);
        }
    }

    async loadKids(){
        var ret = await netManager.get({
            url: 'kid/list'
        });
        if(ret.status==200){
            let res  = await ret.json();
            let kids = res.data;
            for(let kid of kids){
                if(kid.picture!==null){
                    let url = kid.picture;
                    let ret = await netManager.downloadImg({url});
                    kid.picture = null;
                    if(ret.status===200){
                        kid.picture = {
                            path: ret.filePath,
                            mime: ret.mime,
                            url:  url
                        };
                    }
                }
                kid.updatedServer = true;
                await kidManager.saveServerChild(kid);
            };
        }
    }

    getSharedKid(token){
        return new Promise(async (resolve, reject) => {
            var resp = await netManager.get({
                url: 'share/kid-info/'+token
            });
            if(resp.status==200){
                let ret = await resp.json();
                let kid = ret.data;
                resolve(kid);
            }else{
                reject();
            }
        });
    }

    setSharedKid(token){
        return new Promise(async (resolve, reject) => {
            var resp = await netManager.get({
                url: 'share/kid/'+token
            });
            if(resp.status==200){
                let ret = await resp.json();
                let kid = ret.data;
                if(kid.picture!==null){
                    let url = kid.picture;
                    ret = await netManager.downloadImg({url});
                    kid.picture = null;
                    if(ret.status===200){
                        kid.picture = {
                            path: ret.filePath,
                            mime: ret.mime,
                            url: url
                        };
                    }
                }
                kid.updatedServer = true;
                await kidManager.saveServerChild(kid);
                await this._getNotesForChild(kid, true);
                resolve(kid);
            }else{
                let ret = await resp.json();
                reject(ret);
            }
        });
    }

    //PRIVATE UTIL FUNCTIONS
    //---------------------------------------------------
    _getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

export let syncro = new Syncro();
