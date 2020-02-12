import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Linking,
  AsyncStorage,
  AppRegistry,
  AppState
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {
  Scene,
  Router,
  Actions,
  Reducer,
  ActionConst,
  Overlay,
  Tabs,
  Modal,
  Drawer,
  Stack,
  Lightbox
} from 'react-native-router-flux';

//Scenes
import * as Animatable from 'react-native-animatable';
import I18n from './lib/I18N.js';
import Home from './scenes/Home';
import KidHome from './scenes/KidHome';
import BabyForm from './scenes/BabyForm';
import TaskList from './scenes/TaskList';
import NoteList from './scenes/NoteList';
import CalendarTab from './scenes/CalendarTab';
import DiaryTab from './scenes/DiaryTab';
import ChartScene from './scenes/ChartScene';
import ProfileForm from './scenes/ProfileForm';
import RegisterForm from './scenes/RegisterForm';
import Login from './scenes/Login';
import Logout from './scenes/Logout';
import TutorList from './scenes/TutorList';
import TutorHome from './scenes/TutorHome';
import SecureDataForm from './scenes/SecureDataForm';
import FoodForm from './scenes/notes/FoodForm';
import WeightForm from './scenes/notes/WeightForm';
import HeightForm from './scenes/notes/HeightForm';
import CleaningForm from './scenes/notes/CleaningForm';
import MedicinesForm from './scenes/notes/MedicinesForm';
import TemperatureForm from './scenes/notes/TemperatureForm';
import PersonalForm from './scenes/notes/PersonalForm';
import DreamForm from './scenes/notes/DreamForm';
import BathForm from './scenes/notes/BathForm';
import ThemeManager from './scenes/ThemeManager';
import MediaForm from './scenes/notes/MediaForm';
import AlarmForm from './scenes/notes/AlarmForm';
import MediaList from './scenes/MediaList';
import BabyOptions from './scenes/BabyOptions';
import Share from './scenes/Share';
import HomeNavBar from './lib/components/HomeNavBar';
import DefaultNavBar from './lib/components/DefaultNavBar';
import CustomTabs from './lib/components/CustomTabs';
import MyAccountTabs from './lib/components/MyAccountTabs';
import BabyTabs from './lib/components/BabyTabs';
import BaseComponent from './lib/BaseComponent.js';
//Libraries
import Orientation from 'react-native-orientation';
import Installer     from './lib/Installer.js';
import {config} from './lib/Config.js';
import {cron} from './lib/Cron.js';
import {profileManager} from './lib/ProfileManager.js';
import {kidManager}  from './lib/KidManager.js';
import {noteManager} from './lib/NoteManager.js';
import {adManager} from './lib/AdManager.js';
import {netManager}  from './lib/NetManager.js';
import {populate} from './lib/Populate.js';
import {syncro}      from './lib/Syncro.js';
import {syncroMedia} from './lib/SyncroMedia';
import {eventApp} from "./lib/EventApp.js";

import firebase from 'react-native-firebase';
import type { Notification } from 'react-native-firebase';

const myZoomOut = {
    0: {
        opacity: 1,
        scale: 1,
    },
    0.5: {
        opacity: 1,
        scale: 0.7,
    },
    1: {
        opacity: 1,
        scale: 1,
    },
};

//Pones el condicional para testing, puesto que lo sustituimos por un mock.
if(firebase.notifications){
    // Build a channel
    const channel = new firebase.notifications.Android.Channel('default-channel', 'Default Channel', firebase.notifications.Android.Importance.Max)
      .setDescription('My apps default channel');
    // Create the channel
    firebase.notifications().android.createChannel(channel);
}



export default class App extends BaseComponent {

    constructor(){
        super();
        this.state = {
            loaded: false,
            appState: AppState.currentState
        };
        this._handleOpenURL = this._handleOpenURL.bind(this);
        this._handleAppStateChange = this._handleAppStateChange.bind(this);
        adManager.exec();
    }

    componentDidMount() {
        if(this.state.loaded===false){
            Orientation.lockToPortrait();
            this.setInitialValues().then((ret) => {
                this.init();
            });
        }
        Linking.addEventListener('url', this._handleOpenURL);
        AppState.addEventListener('change', this._handleAppStateChange);

        /*
        ACTUALMENTE NO HACEMOS NADA CON LAS NOTIFICACIONES SALVO MANDARLAS AL DISPOSITIVO.
        COMENTAMOS LOS LISTENERS QUE NO VAMOS A USAR.

        TAMBIEN DESCOMENTAR EN index.js
        this.setMessageListeners();
        */
    }

    setMessageListeners(){
        this._setMessagePermits().then((enabled)=>{
            if(enabled){
                this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {});
                this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {});
                this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {});
                this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
                    const action = notificationOpen.action;
                    const notification: Notification = notificationOpen.notification;
                });
            }
        });
        firebase.notifications().getInitialNotification()
          .then((notificationOpen: NotificationOpen) => {
                if (notificationOpen) {
                  const action = notificationOpen.action;
                  const notification: Notification = notificationOpen.notification;
                }
         });
    }

    async _setMessagePermits(){
        let enabled = await firebase.messaging().hasPermission();
        if (!enabled) {
            try{
                enabled = await firebase.messaging().requestPermission();
                return enabled;
            } catch (error) {
                console.log(error)
            }
        }
        return enabled;
    }

    _handleAppStateChange(nextAppState){
        if (nextAppState === 'active') {
            eventApp.emit("app-foreground");
        }
        if (nextAppState === 'background') {
            eventApp.emit("app-background");
        }
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this._handleOpenURL);
        AppState.removeEventListener('change', this._handleAppStateChange);
        this.removeListeners();
        //this.activeMessageListeners();
    }

    activeMessageListeners(){
        this.messageListener();
        this.notificationDisplayedListener();
        this.notificationListener();
        this.notificationOpenedListener();
    }

    _handleOpenURL(args){
        if(args.url === 'https://babyhelper.info/password/recovery'){
            return;
        }
        Actions.setSharedKid({
            url: args.url
        });
    }

    setInitialValues() {
        return new Promise((resolve, reject) => {
            //Instalamos.
            var installer = new Installer();
            installer.check().then(function(ret){
                if(ret!==true){
                    installer.start().then(()=>{
                        resolve();
                    });
                }else{
                    profileManager.get('registered').then((isRegistered)=>{
                        if(isRegistered){
                            if(netManager.checkConnection()){
                                netManager.login().then(()=>{
                                    resolve();
                                });
                            }else{
                                eventApp.addListener('netmanager-change-connection', ()=>{
                                    netManager.login();
                                });
                                resolve();
                            }
                        }else{
                            resolve();
                        }
                    });
                }
            });
        });
    }

    async init(){
        if(this.state.loaded===false){
            var url = await Linking.getInitialURL();
            if(url) {
                this.setState({
                    loaded: true
                });
                Actions.setSharedKid({
                    url
                });
            }else{
                syncro.start();
                syncroMedia.start();
                cron.start();
                setTimeout(()=>{
                    this.setState({
                        loaded: true
                    });
                }, 2200);
            }
        }
    }

    render(){
        if(this.state.loaded===false){
            return this.renderLoading();
        }
        return this.renderApp();
    }

    renderLoading(){
        var text = "Cargando...";
        var index = 1000;
        return (
          <View style={{flex:1, backgroundColor:"#fff"}} key="loading">
               <View style={{flexDirection:'column', alignItems:'center', justifyContent:'space-around', paddingTop:'40%'}}>
                   <Animatable.View duration={1000} direction="alternate" animation="fadeInDown">
                       <Image
                           style={{width: 130, height: 130}}
                           source={require("./assets/if_kid_1930420.png")}
                       />
                   </Animatable.View>
                   <View style={{ flexDirection: 'row', paddingTop:20 }}>
                      {text.split('').map((letter, index) => {
                          return <Animatable.Text key={letter+"_"+index} duration={3000} iterationCount={10} animation={myZoomOut} style={{fontSize:26, fontWeight:'bold'}}>{letter}</Animatable.Text>
                      })}
                  </View>
               </View>
          </View>
        );
    }

    renderApp() {
        return (
        <Router>
            <Lightbox>
                <Scene key="root">
                    <Scene key="home"
                        navBar={HomeNavBar}
                        component={Home}
                        title={I18n.t("title")}
                        initial
                    />
                    <Scene key="kidHome"
                        navBar={DefaultNavBar}
                        component={KidHome}
                        title=""
                        backMode="reset"
                        backTo="home"
                    />
                    <Scene
                        key="babyForm"
                        component={BabyForm}
                        title="Añadir Bebe"
                        navBar={DefaultNavBar}
                    />
                    <Scene
                        key="taskList"
                        component={TaskList}
                        title="Tipo de nota"
                        navBar={DefaultNavBar}
                    />
                    <Scene
                        key="noteList"
                        component={NoteList}
                        title={I18n.t("note_list_title")}
                        navBar={DefaultNavBar}
                    />
                    <Tabs
                        key="detailTabs"
                        hideNavBar={true}
                        showLabel={true}
                        labelStyle={{fontSize:18, marginBottom:10, fontWeight:"normal"}}
                        tabBarPosition="bottom"
                        activeBackgroundColor={this.theme.colors.primary}
                        inactiveBackgroundColor="white"
                        inactiveTintColor="#666"
                        activeTintColor="#ffffff"
                        tabBarComponent={CustomTabs}
                        lazy={true}
                        swipeEnabled={false}
                        >
                        <Scene
                            hideNavBar={false}
                            key="diary"
                            component={DiaryTab}
                            navBar={DefaultNavBar}
                            tabBarLabel="Diario"
                        />
                        <Scene
                            key="calendar"
                            component={CalendarTab}
                            navBar={DefaultNavBar}
                            hideNavBar={false}
                            tabBarLabel="Calendario"
                        />
                    </Tabs>
                    <Tabs
                        key="loggedAccountTabs"
                        swipeEnabled={false}
                        hideNavBar={false}
                        showLabel={true}
                        title="Mi cuenta"
                        navBar={DefaultNavBar}
                        labelStyle={{fontSize:18, marginBottom:10, fontWeight:"normal"}}
                        tabBarPosition="bottom"
                        activeBackgroundColor={this.theme.colors.primary}
                        inactiveBackgroundColor="white"
                        inactiveTintColor="#666"
                        activeTintColor="#ffffff"
                        lazy={true}
                        tabBarComponent={MyAccountTabs}
                        backMode="reset"
                        backTo="home"
                        >
                        <Scene
                            hideNavBar={true}
                            key="profileForm"
                            component={ProfileForm}
                            tabBarLabel="Perfil"
                            icon="face-profile"
                        />
                        <Scene
                            hideNavBar={true}
                            key="changeTheme"
                            component={ThemeManager}
                            tabBarLabel="Theme"
                            icon="palette"
                        />
                        <Scene
                            hideNavBar={true}
                            key="logout"
                            component={Logout}
                            tabBarLabel="Salir"
                            icon="exit-to-app"
                        />
                    </Tabs>
                    <Scene
                        hideNavBar={true}
                        key="secureDataForm"
                        component={SecureDataForm}
                        tabBarLabel="Acceso"
                        icon="lock"
                        lazy={true}
                    />
                    <Tabs
                        key="nonLoggedAccountTabs"
                        swipeEnabled={false}
                        hideNavBar={false}
                        showLabel={true}
                        title="Mi cuenta"
                        navBar={DefaultNavBar}
                        labelStyle={{fontSize:18, marginBottom:10, fontWeight:"normal"}}
                        tabBarPosition="bottom"
                        activeBackgroundColor={this.theme.colors.primary}
                        inactiveBackgroundColor="white"
                        inactiveTintColor="#666"
                        activeTintColor="#ffffff"
                        lazy={true}
                        tabBarComponent={MyAccountTabs}
                        backMode="reset"
                        backTo="home"
                        >
                        <Scene
                            hideNavBar={true}
                            key="lProfileForm"
                            component={ProfileForm}
                            tabBarLabel="Perfil"
                            icon="face-profile"
                        />
                        <Scene
                            hideNavBar={true}
                            key="lChangeTheme"
                            component={ThemeManager}
                            tabBarLabel="Theme"
                            icon="palette"
                        />
                    </Tabs>
                    <Scene
                        hideNavBar={false}
                        key="login"
                        component={Login}
                        navBar={DefaultNavBar}
                        title="Acceder a tu cuenta"
                    />
                    <Scene
                        hideNavBar={false}
                        key="registerForm"
                        component={RegisterForm}
                        title="Registro"
                        navBar={DefaultNavBar}
                    />
                    <Scene
                        hideNavBar={false}
                        key="mediaList"
                        component={MediaList}
                        navBar={DefaultNavBar}
                        title="Videos & Imágenes"
                        backMode="direct"
                        backTo="kidHome"
                    />
                    <Tabs
                        key="tutorTabs"
                        hideNavBar={false}
                        showLabel={true}
                        title="Perfil Bebe"
                        navBar={DefaultNavBar}
                        labelStyle={{fontSize:18, marginBottom:10, fontWeight:"normal"}}
                        tabBarPosition="bottom"
                        activeBackgroundColor={this.theme.colors.primary}
                        inactiveBackgroundColor="white"
                        inactiveTintColor="#666"
                        activeTintColor="#ffffff"
                        lazy={true}
                        tabBarComponent={BabyTabs}
                        backMode="direct"
                        backTo="kidHome"
                        swipeEnabled={false}
                        >
                        <Scene
                            hideNavBar={true}
                            key="editBabyForm"
                            component={BabyForm}
                            icon="face-profile"
                        />
                        <Scene
                            hideNavBar={true}
                            key="tutorList"
                            component={TutorList}
                            tabBarLabel="Tutores"
                            icon="share-variant"
                        />
                        <Scene
                            hideNavBar={true}
                            key="babyOptions"
                            component={BabyOptions}
                            title="Opciones del bebe"
                            tabBarLabel="Tutores"
                            icon="delete"
                        />
                    </Tabs>
                    <Scene
                        key="tutorHome"
                        component={TutorHome}
                        title="Perfil de tutor"
                        navBar={DefaultNavBar}
                    />
                    <Scene
                        key="chart"
                        component={ChartScene}
                        title="Chart"
                        navBar={DefaultNavBar}
                    />
                    <Scene
                        hideNavBar={true}
                        key="setSharedKid"
                        component={Share}
                    />
                </Scene>
                <Scene
                    key="noteFeedForm"
                    component={FoodForm}
                    title="Alimentación"
                />
                <Scene
                    key="noteWeightForm"
                    component={WeightForm}
                    title="Peso"
                />
                <Scene
                    key="noteDreamForm"
                    component={DreamForm}
                    title="Sueño"
                />
                <Scene
                    key="noteBathForm"
                    component={BathForm}
                    title="Baño"
                />
                <Scene
                    key="noteTemperatureForm"
                    component={TemperatureForm}
                    title="Temperatura"
                />
                <Scene
                    key="noteHeightForm"
                    component={HeightForm}
                    title="Altura"
                />
                <Scene
                    key="noteCleaningForm"
                    component={CleaningForm}
                    title="Cambios"
                />
                <Scene
                    key="noteMedicineForm"
                    component={MedicinesForm}
                    title="Medicinas & Vitaminas"
                />
                <Scene
                    key="notePersonalForm"
                    component={PersonalForm}
                    title="Personal"
                />
                <Scene
                    key="noteAlarmForm"
                    component={AlarmForm}
                    title="Nueva Cita"
                />
                <Scene
                    key="mediaForm"
                    component={MediaForm}
                    title="Añadir Multimedia"
                />
            </Lightbox>
        </Router>
        );
    }

    _exportStorage(){
        AsyncStorage.getAllKeys((err, keys) => {
            AsyncStorage.multiGet(keys, (err, stores) => {
                stores.map((result, i, store) => {
                });
            });
        });
    }
}
