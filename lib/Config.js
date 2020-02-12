"use strict";
import {AsyncStorage} from 'react-native';

const env="PROD";

const prodConf = {
  host: 'babyhelper.info',
  protocol: 'https',
};
const devConf = {
  host: '192.168.0.105:8000',
  protocol: 'http',
};

class Config{

    constructor(){
        var self = this;
        AsyncStorage.getItem("@BabyHelper:config").then((value) => {
            var config = JSON.parse(value);
            if(config===null){
                config = self.getDefault();
            }
            if(env==="DEV"){
                config = {...config, ...devConf};
            }
            if(env==="PROD"){
                config = {...config, ...prodConf};
            }
            self.config = config;
        }).done();
    }

    getAllConfig(){
        return this.config;
    }

    async getConfig(key){
        return new Promise((resolve, reject) => {
            if(this.config===undefined){
                setTimeout(()=>{
                  resolve(this.getConfig(key));
              }, 200);
            }else{
                resolve(this.config[key]);
            }
        });
    }

    async setConfig(key, value){
        return new Promise((resolve, reject) => {
            if(this.config===undefined){
                setTimeout(()=>{
                  resolve(this.setConfig(key, value));
                }, 100);
            }else{
                this.config[key] = value;
                AsyncStorage.setItem("@BabyHelper:config", JSON.stringify(this.config));
                resolve(value);
            }
        });
    }

    getDefault(){
        return {
            theme: 'default',
            host: 'babyhelper.info',
            protocol: 'https',
        };
    }

    getEnv(){
        return env;
    }

    isProd(){
        return (env==='PROD');
    }

}

export let config = new Config();
