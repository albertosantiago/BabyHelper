"use strict";

import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob';
import {AsyncStorage} from 'react-native';
import {config} from './Config.js';


class AdManager {

    constructor(){}

    exec(){
        AsyncStorage.getItem("@BabyHelper:execution-number").then((value) => {
            value = parseInt(value);
            if(!isNaN(value)){
                if(value>3){
                    let rand = Math.floor(Math.random()*2);
                    if(rand===1){
                        if(config.isProd()){
                            AdMobInterstitial.setAdUnitID('ca-app-pub-7990781443832926/4164166055');
                            AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd(), (e)=> console.log(e));
                        }else{
                            this._exportStorage();
                            AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712');
                            AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId]);
                            AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd(), (e)=> console.log(e));
                        }
                    }
                }
                value++;
            }else{
                value=1;
            }
            AsyncStorage.setItem("@BabyHelper:execution-number", ''+value);
        });
    }
}

export let adManager = new AdManager();
