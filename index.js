import { AppRegistry } from 'react-native';
import App from './App';
//Por si hay que recoger datos de las notificaciones con mensajes "data-only de FCM"
//import notifyHandler from './lib/NotifyHandler';

AppRegistry.registerComponent('BabyHelper', () => App);
//AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => notifyHandler);
