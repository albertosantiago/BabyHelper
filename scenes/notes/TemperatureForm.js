import React from 'react';
import { Text, View, TextInput, Alert, Slider, ScrollView} from 'react-native';
import { Actions } from 'react-native-router-flux';
import BaseComponent from '../../lib/BaseComponent.js';
import IconButton from '../../lib/components/IconButton';
import MyTimePicker from "../../lib/components/MyTimePicker";
import {noteManager} from '../../lib/NoteManager.js';
import ModalMessage from '../../lib/components/ModalMessage';
import KidSelector from '../../lib/components/KidSelector';
import BaseLightbox from '../../lib/components/BaseLightbox';

var dateFormat = require('dateformat');

export default class TemperatureForm extends BaseComponent {

    constructor(props) {
        super(props);
        var date = new Date();
        this.state = {
            temp: 370,
            date: date,
            currentKid: this.props.child
        };
        this.save = this.save.bind(this);
        this.setTemp = this.setTemp.bind(this);
        this.setLastTemp = this.setLastTemp.bind(this);
    }

    async componentDidMount(){
        if(this.state.currentKid!==undefined){
            this.setLastTemp(this.state.currentKid);
        }
    }

    setCurrentKid(kid){
        this.setState({
            currentKid: kid
        });
        this.setLastTemp(kid);
    }

    async setLastTemp(kid){
        var lastNote = noteManager.getLastNote({
            kidId: kid.id,
            type:  'temperature'
        });
        if(lastNote!==null){
            this.setTemp(lastNote.temp);
        }
    }

    setTemp(temp) {
        this.setState({
            temp
        });
    }

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
            <BaseLightbox type="confirm" onConfirm={this.save}  horizontalPercent={0.9} verticalPercent={0.62}>
                <ScrollView style={{backgroundColor:"#fff", paddingLeft:"0%"}}>
                    <ModalMessage type="success" onPress={()=> this._hideModal()} message={this.state.modalText} visible={this.state.modalVisible} />
                    <View style={{position:'absolute',top:0, right:10, width:200}}>
                        <KidSelector size='small' showImg={true} withAll={false} selected={this.state.currentKid} onChange={(kid)=> this.setCurrentKid(kid)} />
                    </View>
                    <View style={{marginTop:40, marginBottom:0, width:"100%", alignItems:'center'}}>
                        <Text style={{fontWeight: 'bold', color:"#000", fontSize:24, marginTop:5, marginBottom:5}}>
                            Temperatura
                        </Text>
                        <TextInput
                            editable = {false}
                            style={[this.theme.styles.form_input,{color:"#000", width:100, textAlign:"center", fontSize:21, fontWeight:"bold"}]}
                            value={(this.state.temp/10)+" º"}
                            underlineColorAndroid='rgba(0,0,0,0)'
                          />
                    </View>
                    <View style={{flexDirection:"row", paddingTop:20, paddingBottom:40, alignItems:"center", width:'100%'}}>
                        <View style={{alignItems:"center", width:'100%'}}>
                            <Slider
                             minimumTrackTintColor={this.theme.colors.black}
                             thumbTintColor={this.theme.colors.black}
                             thumbImage={require("../../assets/if_kid_1930420.png")}
                             style={{ width: 280}}
                             step={5}
                             minimumValue={350}
                             maximumValue={400}
                             value={this.state.temp}
                             onValueChange={val => this.setTemp(val)}
                            />
                        </View>
                    </View>
                    <View>
                        <MyTimePicker date={this.state.date} onChange={this.handleDateChange}/>
                    </View>
                </ScrollView>
            </BaseLightbox>);
    }

    async save(){
        try {
            let note = {
                kid_ids: [this.state.currentKid.id],
                type: "temperature",
                temp: this.state.temp,
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
