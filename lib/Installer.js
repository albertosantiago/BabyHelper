import {AsyncStorage, PermissionsAndroid} from 'react-native';
import {config} from "./Config";
import {netManager} from "./NetManager";
import {profileManager} from "./ProfileManager";
import {kidManager} from "./KidManager";
import {noteManager} from "./NoteManager";
import firebase from 'react-native-firebase';

var RNFS = require('react-native-fs');
var DeviceInfo = require('react-native-device-info');

const paps = [
    {
        id: "papilla_arroz",
        name: "Arroz"
    },
    {
        id: "papilla_multicereal",
        name: "Multicereales"
    },
    {
        id: "papillas_cereales_miel",
        name: "8 Cereales y miel"
    },
    {
       id: "papilla_cereales_fruta",
       name: "Cereales y fruta"
    }
];

const medicines = [
    {
        id: "gotas_nasales",
        name: "Gotas Nasales"
    },
    {
        id: "vitamina_k",
        name: "Vitamina K"
    },
    {
        id: "vitamina_d",
        name: "Vitamina D"
    },
    {
        id: "jarabe_paracetamol",
        name: "Paracetamol"
    },
   {
       id: "amoxicilina",
       name: "Amoxicilina"
   },
   {
      id: "penicilina",
      name: "Penicilina"
   }
];

export default class Installer{

    constructor(){}

    check(){
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem("@BabyHelper:installed").then((value) => {
                this.createFolders();
                if(value==="true"){
                    resolve(true);
                }else{
                    resolve(false);
                }
            }).done();
        });
    }

    async start(){
        await this.askPermits();
        await this.clear();
        await this.loadFixtures();
        await this.loadDeviceInfo();
        await this.createFolders();
        this.restartServices();
    }

    async askPermits(){
        const granted = await PermissionsAndroid.requestMultiple(
            [
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            ], {
              title: "Permisos",
              message: "Estos permisos son necesarios para el correcto funcionamiento de la app.",
            },
        );
    }

    async reinstallUserFixtures(){
        await this.clearFixtures();
        await this.loadFixtures();
        this.restartServices();
    }

    async clear(){
        return await AsyncStorage.clear();
    }

    async clearFixtures(){
        let kids = await kidManager.getAllChilds();
        for(let kid of kids){
            await AsyncStorage.removeItem("@BabyHelper:syncro:last-note-update:"+kid.id);
        }
        return await AsyncStorage.multiRemove([
            "@BabyHelper:profile",
            "@BabyHelper:user-profiles",
            "@BabyHelper:childrens",
            "@BabyHelper:notes",
            "@BabyHelper:config",
            "@BabyHelper:medicines",
            "@BabyHelper:paps",
            "@BabyHelper:change-log"
        ]);
    }

    loadFixtures(){
        return new Promise(async (resolve, reject) => {
            let defaultProfile = profileManager.getDefaultProfile();
            profileManager.set(defaultProfile);
            await AsyncStorage.setItem("@BabyHelper:user-profiles", JSON.stringify([]));
            await AsyncStorage.setItem("@BabyHelper:childrens", JSON.stringify([]));
            await kidManager.loadKids();
            await AsyncStorage.setItem("@BabyHelper:notes", JSON.stringify([]));
            var defaultConfig = config.getDefault();
            await AsyncStorage.setItem("@BabyHelper:config", JSON.stringify(defaultConfig));
            await AsyncStorage.setItem("@BabyHelper:medicines", JSON.stringify(medicines));
            await AsyncStorage.setItem("@BabyHelper:paps", JSON.stringify(paps));
            await AsyncStorage.setItem("@BabyHelper:installed","true");
            resolve();
        });
    }

    async createFolders(){
        let check = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if(!check){
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                  title: "Grant SD card access",
                  message: "We need access",
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                check = true;
            } else {
                check = false;
            }
        }
        if(check){
            let path = RNFS.ExternalStorageDirectoryPath+"/Pictures/BabyHelper/";
            RNFS.mkdir(path).then(()=>{
                //Debería sustituir esto por una promesa
            },(err)=>{
                //Debería hacer algo
            });
        }
    }

    async loadDeviceInfo(){
        var deviceInfo = {
            uniqueId : DeviceInfo.getUniqueID(),
            model: DeviceInfo.getModel(),
            systemName: DeviceInfo.getSystemName(),
            systemVersion: DeviceInfo.getSystemVersion(),
            fcmToken: null
        };
        const fcmToken = await firebase.messaging().getToken();
        if(fcmToken){
            deviceInfo.fcmToken = fcmToken;
        }
        await AsyncStorage.setItem("@BabyHelper:deviceInfo", JSON.stringify(deviceInfo));
        AsyncStorage.setItem("@BabyHelper:deviceId", JSON.stringify(deviceInfo.uniqueID));
        netManager.setDeviceToken();
    }

    restartServices(){
        kidManager.loadKids();
        profileManager.load();
        noteManager.load();
    }

}
