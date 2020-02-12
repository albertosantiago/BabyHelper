import 'react-native';
import React from 'react';
import App from '../App';
import renderer from 'react-test-renderer';

jest.mock('react-native-google-signin', () => {});
jest.mock('react-native-firebase', () => {
    return {}
});
jest.mock('react-native-fabric', () => {
    return {
        Crashlytics: {}
    };
});
jest.mock('react-native-fs',() => {});
jest.mock('../lib/NoteManager', () => {
    return {
        noteManager:{
            getNotes: function(){
                return []
            }
        }
    }
});
jest.mock('react-native-admob',()=>{
    return {
        AdMobBanner: {},
        AdMobInterstitial: {
            simulatorId: 'simulator-testing-id',
            setAdUnitID: function(key){},
            setTestDevices: function(args){},
            requestAd: function(){
                return Promise.resolve();
            },
            showAd: function(){}
        },
        PublisherBanner: {},
        AdMobRewarded: {}
    }
});
jest.mock('react-native-autocomplete-input',()=>{});
jest.mock('react-native-orientation', ()=>{
    return {
        lockToPortrait: function(){}
    };
});

it('renders correctly', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
});
