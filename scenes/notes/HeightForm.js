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

export default class HeightForm extends BaseComponent {

    constructor(props) {
        super(props);
        var date = new Date();
        this.state = {
            ctm: 0,
            date: date,
            currentKid: this.props.child
        };
        this.save = this.save.bind(this);
        this.setHeight = this.setHeight.bind(this);
        this.setLastHeight = this.setLastHeight.bind(this);
    }

    async componentDidMount(){
        if(this.state.currentKid!==undefined){
            this.setLastHeight(this.state.currentKid);
        }
    }

    setCurrentKid(kid){
        this.setState({
            currentKid: kid
        });
        this.setLastHeight(kid);
    }

    async setLastHeight(kid){
        var lastNote = noteManager.getLastNote({
            kidId: kid.id,
            type:  'height'
        });
        if(lastNote!==null){
            this.setHeight(lastNote.ctm);
        }
    }

    setHeight(ctm) {
        this.setState({
            ctm
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
            <BaseLightbox type="confirm" onConfirm={this.save}  horizontalPercent={0.9} verticalPercent={0.67}>
                <ScrollView style={{backgroundColor:"#fff", paddingLeft:"2%", paddingRight:"2%", width:'96%'}}>
                    <ModalMessage type="success" onPress={()=> this._hideModal()} message={this.state.modalText} visible={this.state.modalVisible} />
                    <View style={{position:'absolute',top:0, right:10, width:200}}>
                        <KidSelector size='small' showImg={true} withAll={false} selected={this.state.currentKid} onChange={(kid)=> this.setCurrentKid(kid)} />
                    </View>
                    <View style={{marginTop:40,marginBottom:0, width:"100%", alignItems:'center'}}>
                        <Text style={{fontWeight: 'bold', color:"#000", fontSize:24, marginTop:5, marginBottom:5}}>
                            Altura actual
                        </Text>
                        <TextInput
                            editable = {false}
                            style={[this.theme.styles.form_input,{color:"#000", width:100, textAlign:"center", fontSize:21, fontWeight:"bold"}]}
                            value={this.state.ctm+" ctm"}
                            underlineColorAndroid='rgba(0,0,0,0)'
                          />
                    </View>
                    <View style={{flexDirection:"row", paddingTop:40, paddingBottom:40}}>
                        <View>
                            <Text>Altura</Text>
                        </View>
                        <View>
                            <Slider
                             minimumTrackTintColor={this.theme.colors.black}
                             thumbTintColor={this.theme.colors.black}
                             thumbImage={require("../../assets/if_kid_1930420.png")}
                             style={{ width: 280}}
                             step={1}
                             minimumValue={20}
                             maximumValue={110}
                             value={this.state.ctm}
                             onValueChange={val => this.setHeight(val)}
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
                type: "height",
                date: this.state.date,
                ctm: this.state.ctm
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
