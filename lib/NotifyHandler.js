//No esta siendo utilizado, por ahora solo mandamos notificaciones de texto sin datos.
import firebase from 'react-native-firebase';
import type { RemoteMessage } from 'react-native-firebase';
import {AsyncStorage} from 'react-native';

export default async (message: RemoteMessage) => {
    return Promise.resolve();
}
