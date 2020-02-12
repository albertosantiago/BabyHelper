import React from 'react';
import NoteList from '../../scenes/NoteList';

import renderer from 'react-test-renderer';

jest.mock('react-native-google-signin', () => {});
jest.mock('react-native-fabric', () => {
    return {
        Crashlytics: {}
    };
});
jest.mock('react-native-fs',() => {});
jest.mock('../../lib/NoteManager', () => {
    return {
        noteManager:{
            getNotes: function(){
                return []
            }
        }
    }
});
jest.mock('react-native-router-flux', ()=> {
    return {
        Actions:{
            refresh: function(props){
                return true;
            }
        }
    }
});

const child = {
    "version":1,
    "id":"b39d3df17420979_daed17486e15a5f",
    "name":"Marcos",
    "sex":"male",
    "birthdate":1528442915,
    "user_id":"b39d3df17420979",
    "added":"2018-06-08",
    "picture":
        {"path":"file:////storage/emulated/0/Pictures/BabyHelper/5b1a3044355310d1528442957.jpg","mime":"image/jpeg","url":"https://storage.googleapis.com/babyhelper-fe5cb.appspot.com/img/users/5b/1a/5b1a3044355310d1528442957.jpg"},
    "editors":["86f372564e50771"],
    "updatedServer":true
};

test('renders correctly', () => {
    const tree = renderer.create(<NoteList child={child} />).toJSON();
    expect(tree).toMatchSnapshot();
});
