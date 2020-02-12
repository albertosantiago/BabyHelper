import React from 'react';
import {
    Text, View,
    TextInput, Image, NativeModules,
    DatePickerAndroid, Alert, Picker, Slider,
    ScrollView
}
from 'react-native';

import {AsyncStorage} from 'react-native';
import { Actions } from 'react-native-router-flux';

import BaseComponent from '../../lib/BaseComponent.js';
import IconButton from '../../lib/components/IconButton';
import ModalMessage from '../../lib/components/ModalMessage';
import MyTimePicker from "../../lib/components/MyTimePicker";
import {noteManager} from '../../lib/NoteManager.js';
import KidSelector from '../../lib/components/KidSelector';
import WCCheckBox from '../../lib/components/WCCheckBox';
import BaseLightbox from '../../lib/components/BaseLightbox';


export default class CleaningForm extends BaseComponent {

    constructor(props) {
        super(props);
        var date = new Date();
        this.state = {
            date: date,
            piss: true,
            shit: true,
            modalVisible: false,
            modalText: "",
            currentKid: this.props.child,
        };
        this.save = this.save.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this._renderCheckbox  = this._renderCheckbox.bind(this);
    }

    async componentDidMount() {}

    _hideModal(){
        Actions.reset('home');
    }

    handleCheck(data){
        this.setState({[data.name]:!data.checked});
    }

    handleDateChange(date){
        this.setState(date:date);
    }

    _renderCheckbox(data){
        return (
                <View style={{width:"90%", alignItems:'center', padding:0, paddingBottom:20}}>
                    <WCCheckBox
                        onChange={()=>{this.handleCheck(data)}}
                        isChecked={data.checked}
                        text={data.text}
                    />
                </View>
        );
    }

    render() {
        let verticalPercent = 0.60;
        return (
            <BaseLightbox type="confirm" onConfirm={this.save}  horizontalPercent={0.9} verticalPercent={verticalPercent}>
                <ScrollView style={{backgroundColor:"#fff", paddingLeft:"0%"}}>
                    <ModalMessage type="success" onPress={()=> this._hideModal()} message={this.state.modalText} visible={this.state.modalVisible} />
                    <View style={{position:'absolute',top:0, right:10, width:200}}>
                        <KidSelector size='small' showImg={true} withAll={false} selected={this.state.currentKid} onChange={(kid)=> this.setState({currentKid:kid})} />
                    </View>
                    <View style={{marginTop:40,marginBottom:20, width:"100%", alignItems:'center'}}>
                        <Text style={{fontWeight: 'bold', color:"#000", fontSize:24, marginTop:0, marginBottom:0}}>
                            Cambio de pañales
                        </Text>
                    </View>
                    <View style={[this.theme.styles.form_cell, {width:"100%",flexDirection:"column"}]}>
                        <View style={{width:"100%"}}>
                            {this._renderCheckbox({name:"piss", text:"Hizo pipi", checked: this.state.piss})}
                        </View>
                        <View style={{width:"100%"}}>
                            {this._renderCheckbox({name:"shit", text:"Hizo caca", checked: this.state.shit})}
                        </View>
                    </View>
                    <View>
                        <MyTimePicker date={this.state.date} onChange={this.handleDateChange}/>
                    </View>
                </ScrollView>
            </BaseLightbox>
        );
    }

    async save(){
        try {
            let note = {
                kid_ids: [this.state.currentKid.id],
                type: "cleaning",
                piss: this.state.piss,
                shit: this.state.shit,
                date: this.state.date,
            };
            noteManager.addNote(note);

            this.setState({
                id:note.id,
                editing:false,
                modalText: "¡La nota se salvo con éxito!",
                modalVisible: true,
                modalType: "success"
            });
        }catch (error) {
            console.log(error);
            Alert.alert(
                'Error',
                'Hubo un problema guardando los datos.',
                [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: true }
            );
        }
    }

}
