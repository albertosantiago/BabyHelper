"use strict";
import {profileManager} from './ProfileManager';
import {AsyncStorage} from 'react-native';
import {config} from './Config';
var RNFS = require('react-native-fs');
import * as mime from 'react-native-mime-types';
import Exif from 'react-native-exif';
import {GoogleSignin} from 'react-native-google-signin';
import {cron} from './Cron';
import {crashLogger} from './CrashLogger';
import {NetInfo} from 'react-native';
import {eventApp} from "./EventApp.js";
import Upload from 'react-native-background-upload';

const axios = require('axios');

class NetManager{

    constructor(){
        this.currentRequests = [];
        this.setHost();
        cron.register(this.refreshToken.bind(this), 200, 'netmanager-refresh-token');
        this.isConnected = false;
        this.logged      = false;
        this.onConnectionChange = this.onConnectionChange.bind(this);
        this.onConnectionChange();
        NetInfo.addEventListener('connectionChange', this.onConnectionChange);
    }

    isLogged(){
        return this.logged;
    }

    flushRequests(){
        for(let request of this.currentRequests){
            request.cancel();
        }
        this.currentRequests = [];
    }

    onConnectionChange(){
        NetInfo.isConnected.fetch().then(isConnected => {
            this.isConnected = isConnected;
        });
        eventApp.emit("netmanager-change-connection");
    }

    checkConnection(){
        return this.isConnected;
    }

    refreshToken(){
        return new Promise(async (resolve, reject)=>{
            if(this.logged){
                this.patch({
                    url: 'auth/refresh'
                }).then(async(ret) => {
                    if(ret.status===200){
                        let res = await ret.json();
                        this.userToken = res.data.token;
                        resolve(true);
                    }else{
                        resolve(false);
                    }
                },(e)=>{
                    resolve(false);
                });
            }
            resolve(false);
        });
    }

    async setHost(){
        this.host     = await config.getConfig('host');
        this.protocol = await config.getConfig('protocol');
        if(this.host===undefined){
            this.host = "babyhelper.info";
            this.protocol = "https";
        }
    }

    async setDeviceToken(){
        var aux = await AsyncStorage.getItem("@BabyHelper:deviceInfo");
        var deviceInfo = JSON.parse(aux);
        this.deviceToken = deviceInfo.token;
    }

    async login(){
        return new Promise(async (resolve, reject) =>{
            if(this.isConnected){
                var profile = await profileManager.getProfile();
                if(profile.login_type==='google'){
                    var ret = await this.googleLogin(profile);
                    resolve(ret);
                }
                if(profile.login_type==='email'){
                    var ret =  await this.mailLogin(profile);
                    resolve(ret);
                }
            }
            reject();
        });
    }

    async mailLogin(profile){
        let ret = await this.post({
            url: 'auth/login',
            data:{
                email: profile.email,
                password: profile.password
            }
        });
        if(ret.status===200){
            let res = await ret.json();
            this.userToken = res.data.token;
            this.logged = true;
            return true;
        }
        return false;
    }

    async googleLogin(profile) {
        var ret = await netManager.post({
            url: 'auth/google-login',
            data:{
                id: profile.id,
                email: profile.email,
                id_token: profile.id_token
            }
        });
        if(ret.status===200){
            let res = await ret.json();
            this.userToken = res.data.token;
            this.logged = true;
            return res.data;
        }
        return false;
    }

    setUserToken(userToken){
        this.userToken = userToken;
    }

    async post({url, data, multipart}){
        try{
            if(!multipart){
                data = JSON.stringify(data);
            }
            var headers = await this._getHeaders({multipart});

            //Comprobamos que la url es local.
            if(url.indexOf('http')===-1){
                url = this.protocol+'://'+this.host+'/api/'+url;
            }

            return fetch(url, {
                method: 'POST',
                headers: headers,
                body: data,
            }).catch((error) => {
                console.error(error);
            });
        }catch(e){
            crashLogger.log(e);
        }
    }

    async downloadImg({url}){
        return new Promise(async(resolve, reject) => {
            var chunks = url.split("/");
            var imageName = chunks[(chunks.length-1)];
            imageName = RNFS.ExternalStorageDirectoryPath+"/Pictures/BabyHelper/"+imageName;
            let filePath = 'file:///'+imageName;

            let exists = await RNFS.exists(filePath);
            if(exists){
                let data = await Exif.getExif(filePath);
                return resolve({
                    status:   200,
                    filePath: filePath,
                    width:    data.ImageWidth,
                    height:   data.ImageHeight,
                    exif:     data.exif,
                    mime:     mime.lookup(imageName),
                });
            }
            //Comprobamos que la url es local.
            if(url.indexOf('http')===-1){
                url = this.protocol+'://'+this.host+''+url;
            }

            RNFS.downloadFile({
                fromUrl: url,
                toFile:  imageName
            }).promise.then((ret) => {
                Exif.getExif(filePath).then((data)=>{
                    resolve({
                        status:   ret.statusCode,
                        filePath: filePath,
                        width:    data.ImageWidth,
                        height:   data.ImageHeight,
                        exif:     data.exif,
                        mime:     mime.lookup(imageName),
                    });
                }, (e)=>{
                    crashLogger.log(e);
                    reject(e);
                });
            },(e)=>{
                crashLogger.log(e);
                reject(e);
            });
        });
    }

    async downloadVideo({url}){
        return new Promise(async (resolve, reject) => {
            var chunks = url.split("/");
            var videoName = chunks[(chunks.length-1)];
            videoName     = RNFS.ExternalStorageDirectoryPath+"/Pictures/BabyHelper/"+videoName;
            //Comprobamos que la url es local.
            if(url.indexOf('http')===-1){
                url = this.protocol+'://'+this.host+'/'+url;
            }
            let filePath = 'file:///'+videoName;
            let exists = await RNFS.exists(filePath);
            if(exists){
                return resolve({
                    status:   200,
                    filePath: filePath,
                    mime:     mime.lookup(videoName),
                });
            }
            RNFS.downloadFile({
                fromUrl: url,
                toFile:  videoName
            }).promise.then((ret) => {
                Exif.getExif(filePath).then((resp)=>{
                    let data = {
                        status:   ret.statusCode,
                        filePath: filePath,
                        mime:     mime.lookup(videoName),
                    };
                    resolve(data);
                });
            }, ()=>{
                reject();
            });
        });
    }

    async uploadVideo({url, path, parameters, field, onComplete}){
        return new Promise(async (resolve, reject) => {
            var headers = await this._getHeaders({multipart:false});
            headers['content-type'] = 'application/octet-stream';

            //Comprobamos que la url es local.
            if(url.indexOf('http')===-1){
                url = this.protocol+'://'+this.host+'/api/'+url;
            }

            path = path.replace('file://','');
            let id = Math.round(Math.random()*100000000000000);

            const options = {
                field: field,
                url: url,
                path: path,
                method: 'POST',
                type: 'multipart',
                headers: headers,
                parameters: parameters,
                notification: {
                    enabled: true
                }
            };

            Upload.startUpload(options).then((uploadId) => {
                /**
                Mirar react-native-background-upload
                **/
                Upload.addListener('cancelled', uploadId, (data) => {
                    reject();
                });
                Upload.addListener('completed', uploadId, (data) => {
                    onComplete(JSON.parse(data.responseBody));
                    resolve();
                });
            }).catch((err) => {
                reject(err);
            })
        });
    }

    get({url, data, includeTokens}){
        return new Promise(async(resolve, reject) => {
            var CancelToken = axios.CancelToken;
            var source = CancelToken.source();
            var d = new Date();

            source.key = "get-"+url+d.getTime()+"-"+Math.floor(Math.random() * 100000);
            this.currentRequests.push(source);

            var headers = await this._getHeaders({includeTokens});
            let urlParams = "?";
            if(data!==undefined){
                let dataKeys = Object.keys(data);
                dataKeys.forEach((key)=>{
                    urlParams += key+"="+data[key]+"&";
                });
            }

            url = url+urlParams
            //Comprobamos que la url es local.
            if(url.indexOf('http')===-1){
                url = this.protocol+'://'+this.host+'/api/'+url;
            }

            axios.request({
                url: url,
                method: 'GET',
                headers: headers,
                cancelToken: source.token
            }).then((response)=>{
                response.json = function(){
                    return this.data;
                };
                this.removeRequest(source);
                resolve(response);
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    removeRequest(source){
        this.currentRequests = this.currentRequests.filter((item)=>{
            if(item.key!==source.key){
                return item;
            }
        });
    }

    async patch({url, data, includeTokens}){
        var headers = await this._getHeaders({includeTokens});
        var params = {
            method: 'PATCH',
            headers: headers,
        };
        let urlParams = "?";
        if(data!==undefined){
            let dataKeys = Object.keys(data);
            dataKeys.forEach((key)=>{
                urlParams += key+"="+data[key]+"&";
            });
        }
        //Comprobamos que la url es local.
        if(url.indexOf('http')===-1){
            url = this.protocol+'://'+this.host+'/api/'+url;
        }
        return fetch(url+urlParams, params);
    }


    async _getHeaders({multipart, includeTokens}){
        if((this.deviceToken===undefined)||(this.deviceToken===null)){
            await this.setDeviceToken();
        }
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        if(this.deviceToken!==null){
            headers['Device-Token'] = this.deviceToken;
        }
        if(includeTokens!==false){
            if(this.userToken!==undefined){
                headers['Authorization'] = 'Bearer '+this.userToken;
            }
        }
        if(multipart){
            headers['Content-Type'] = 'multipart/form-data';
        }
        return headers;
    }

}

export let netManager = new NetManager();
