"use strict";
import {AsyncStorage} from 'react-native';
var Fabric = require('react-native-fabric');
var { Crashlytics } = Fabric;

class CrashLogger{

    constructor(){
        this.setToken();
    }

    async setToken(){
        var aux = await AsyncStorage.getItem("@BabyHelper:deviceInfo");
        var deviceInfo = JSON.parse(aux);
        if(deviceInfo!==null){
            Crashlytics.setString('device-token', deviceInfo.token);
        }
    }

    log(err){
        if(typeof(err)==='object'){
            err = JSON.stringify(err);
        }
        Crashlytics.logException(err);
    }

    crash(){
        Crashlytics.crash();
    }

}

export const crashLogger = new CrashLogger();
