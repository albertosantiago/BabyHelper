import React from 'react';
import { Text, View, TextInput, Alert, Slider, ScrollView} from 'react-native';
import { Actions } from 'react-native-router-flux';
import BaseComponent from '../../lib/BaseComponent.js';
import IconButton from '../../lib/components/IconButton';
import MyTimePicker from "../../lib/components/MyTimePicker";
import WCRadioButton from "../../lib/components/WCRadioButton";
import {noteManager} from '../../lib/NoteManager.js';
import ModalMessage from '../../lib/components/ModalMessage';
import KidSelector from '../../lib/components/KidSelector';
import BaseLightbox from '../../lib/components/BaseLightbox';

var dateFormat = require('dateformat');


export default class DreamForm extends BaseComponent {

    constructor(props) {
        super(props);
        var date = new Date();
        this.state = {
            date: date,
            currentKid: this.props.child
        };
        this.save = this.save.bind(this);
    }

    async componentDidMount(){}

    handleDateChange(date){
        this.setState(date:date);
    }

    render() {
        var auxDate = new Date();
        var dateFormatted = dateFormat(this.state.date, "dd-mm-yyyy");
        if(this.state.date.toDateString() == auxDate.toDateString()){
            dateFormatted = "HOY";
        }
        return (
            <BaseLightbox type="confirm" onConfirm={this.save}  horizontalPercent={0.9} verticalPercent={0.42}>
                <ScrollView style={{backgroundColor:"#fff", paddingLeft:"0%"}}>
                    <ModalMessage type="success" onPress={()=> this._hideModal()} message={this.state.modalText} visible={this.state.modalVisible} />
                    <View style={{position:'absolute',top:0, right:10, width:200}}>
                        <KidSelector size='small' showImg={true} withAll={false} selected={this.state.currentKid} onChange={(kid)=> this.setState({currentKid:kid})} />
                    </View>
                    <View style={{marginTop:40,marginBottom:20, width:"100%", alignItems:'center'}}>
                        <Text style={{fontWeight: 'bold', color:"#000", fontSize:24, marginTop:0, marginBottom:0}}>
                            Anotar Baño
                        </Text>
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
                type: "bath",
                date: this.state.date
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

    _hideModal(){
        Actions.reset('home');
    }
}
