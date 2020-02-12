import config from "./Config";
import {AsyncStorage} from 'react-native';
import {netManager} from './NetManager';
import {profileManager} from './ProfileManager';
import {kidManager} from './KidManager';
import {noteManager} from './NoteManager';
import {changeLog} from './ChangeLog';
import {cron} from './Cron';
import {crashLogger} from './CrashLogger';

var RNFS = require('react-native-fs');

const STATUS = {
    STOPPED: 0,
    WORKING: 1
};

class SyncroMedia{

    constructor(){
        this.status = STATUS.STOPPED;
        this.start  = this.start.bind(this);
        this.exec   = this.exec.bind(this);
        this.syncro = this.syncro.bind(this);
    }

    start(){
        cron.register(this.exec, 2, 'syncro-media');
    }

    async exec(){
        return new Promise(async (resolve, reject) => {
            let isConfirmed = await profileManager.get('confirmed');
            if(!isConfirmed){
                resolve();
                return;
            }
            if(this.status === STATUS.WORKING){
                resolve();
                return;
            }
            try{
                if(netManager.checkConnection()){
                    await this.syncro();
                }
                resolve();
            }catch(e){
                this.status = STATUS.STOPPED;
                resolve();
            }
        });
    }

    async syncro(){
        this.status = STATUS.WORKING;
        await this.uploadImages();
        await this.uploadVideos();
        await this.downloadImages();
        await this.downloadVideos();
        this.status = STATUS.STOPPED;
        return;
    }

    async downloadImages(){
        return new Promise(async (resolve, reject)=>{
            var notes = await noteManager.getNotes([{
                key: 'type',
                val: 'image'
            },{
                key: 'uploaded',
                val: true
            },{
                key: 'downloaded',
                val: true,
                type: '!=='
            }]);
            for(let note of notes){
                ret = await netManager.downloadImg({url:note.url_server});
                if(ret.status===200){
                    note.picture = {
                        path:   ret.filePath,
                        mime:   ret.mime,
                        width:  ret.width,
                        height: ret.height,
                        exif:   ret.exif,
                    };
                    note.downloaded = true;
                    await noteManager.updateNote(note);
                }
                if(ret.status===404){
                    await noteManager.removeNote(note.id);
                }
            }
            resolve();
        });
    }

    async uploadImages(){
        return new Promise(async (resolve, reject)=>{
            let profile = await profileManager.getProfile();
            var notes   = await noteManager.getNotes([{
                key: 'type',
                val: 'image'
            },{
                key: 'uploaded',
                val: false
            },{
                key: 'user_id',
                val: profile.id
            },{
                key: 'syncronized',
                val: true
            }]);
            for(let note of notes){
                if(note.picture!==null){
                    const data = new FormData();
                    data.append('note_id', note.id);
                    let chunks = note.picture.path.split('.');
                    data.append('picture', {
                        uri:  note.picture.path,
                        type: note.picture.mime,
                        name: 'picture.'+chunks[1]
                    });
                    let resp = await netManager.post({
                        url:'change-log/upload-img',
                        data: data,
                        multipart: true
                    });

                    if(resp.status==200){
                        let ret = await resp.json();
                        note.uploaded  = true;
                        note.file_name  = ret.data.file_name;
                        note.url_server = ret.data.url_server;
                        note.downloaded = true;
                        await noteManager.updateNote(note);
                    }
                }
            }
            resolve();
        });
    }

    async downloadVideos(){
        return new Promise(async (resolve, reject)=>{
            var notes = await noteManager.getNotes([{
                key: 'type',
                val: 'video'
            },{
                key: 'uploaded',
                val: true
            },{
                key: 'downloaded',
                val: true,
                type: '!=='
            }]);
            for(note of notes){
                if(note.downloaded){
                    continue;
                }
                ret = await netManager.downloadVideo({url:note.url_server});
                if(ret.status===200){
                    note.video.path = ret.filePath;
                    note.video.mime = ret.mime;
                    note.downloaded = true;
                    await noteManager.updateNote(note);
                }
                if(ret.status===404){
                    let serverNote = await this._getServerNote(note);
                    if(note.url_server!==serverNote.url_server){
                        note.url_server = serverNote.url_server;
                        await noteManager.updateNote(note);
                    }else{
                        await noteManager.removeExternalNote(note);
                    }
                }
            }
            resolve();
        });
    }

    async uploadVideos(){
        return new Promise(async (resolve, reject)=>{
            let profile = await profileManager.getProfile();
            var notes   = await noteManager.getNotes([{
                key: 'type',
                val: 'video'
            },{
                key: 'uploaded',
                val: false
            },{
                key: 'user_id',
                val: profile.id
            },{
                key: 'syncronized',
                val: true
            }]);
            for(let note of notes){
                if(note.video!==null){
                    let params = {
                        note_id: note.id
                    };
                    try{
                        await netManager.uploadVideo({
                            parameters: params,
                            url:'change-log/upload-video',
                            path: note.video.path,
                            field: 'video',
                            onComplete: async (ret) => {
                                note.downloaded  = true;
                                note.syncronized = true;
                                note.uploaded    = true;
                                note.file_name   = ret.data.file_name;
                                note.url_server  = ret.data.url_server;
                                await noteManager.updateNote(note);
                            }
                        });
                    }catch(e){
                        console.log(e);
                        continue;
                    }
                }
            }
            resolve();
        });
    }

    async _getServerNote(note){
        let resp = await netManager.get({url:'change-log/note/'+note.id+"/"+note.kid_ids[0]});
        if(resp.status===200){
            let json = await resp.json();
            return json.data.obj;
        }
        return null;
    }

}

export let syncroMedia = new SyncroMedia();
