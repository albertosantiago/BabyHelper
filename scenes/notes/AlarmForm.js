import React from 'react';
import { Text, View, Alert, KeyboardAvoidingView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import BaseComponent from '../../lib/BaseComponent.js';
import IconButton from '../../lib/components/IconButton';
import ModalMessage from '../../lib/components/ModalMessage';
import MyTimePicker from "../../lib/components/MyTimePicker";
import {noteManager} from '../../lib/NoteManager.js';
import WCErrors from '../../lib/components/WCErrors';
import WCInput from '../../lib/components/WCInput';
import KidSelector from '../../lib/components/KidSelector';
import validator from 'validator';
import BaseLightbox from '../../lib/components/BaseLightbox';


export default class AlarmForm extends BaseComponent {

    constructor(props) {
        super(props);
        var date = new Date();
        this.state = {
            eventDate: new Date(),
            alarmDate: new Date(),
            text: "",
            title: "",
            currentKid: this.props.child,
            errors:{}
        };
        this.save = this.save.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    componentDidMount() {
    }

    handleCheck(data){
        this.setState({[data.name]:!data.checked});
    }

    handleDateChange(date){
        this.setState({date});
    }

    render() {
        return (
            <BaseLightbox type="confirm" onConfirm={this.save}  horizontalPercent={0.9} verticalPercent={0.88}>
                <KeyboardAwareScrollView style={{backgroundColor:"#fff", paddingTop:"0%"}}>
                        <ModalMessage type="success" onPress={()=> this._hideModal()} message={this.state.modalText} title={this.state.modalTitle} visible={this.state.modalVisible} />
                        <View style={{position:'absolute',top:0, right:10, width:200}}>
                            <KidSelector size='small' showImg={true} withAll={false} selected={this.state.currentKid} onChange={(kid)=> this.setState({currentKid:kid})} />
                        </View>
                        <View style={{marginTop:40,marginBottom:20, width:"90%", alignItems:'center'}}>
                            <Text style={{fontWeight: 'bold', color:"#000", fontSize:24, marginTop:0, marginBottom:0}}>
                                Agenda
                            </Text>
                        </View>
                        <View style={{width:"100%"}}>
                            <WCInput
                                label="Nombre de Evento"
                                containerStyle={{width:"100%"}}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                error={this.state.errors.title}
                                maxLength={100}
                                numberOfLines={1}
                                value={this.state.title}
                                onChangeText={(title)=> this.setState({title})}
                                style={{width:"98%", backgroundColor: '#fff', fontSize:18, borderColor:"#ddd", borderWidth:1, textAlignVertical: "top", borderRadius:10 }} />
                        </View>
                        <View style={{width:"100%"}}>
                            <WCInput
                                label="Detalle (opcional)"
                                containerStyle={{width:"100%"}}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                error={this.state.errors.text}
                                multiline={true}
                                maxLength={400}
                                numberOfLines={7}
                                value={this.state.text}
                                onChangeText={(text)=> this.setState({text})}
                                style={{width:"98%", height: 150,  backgroundColor: '#fff', fontSize:18, borderColor:"#ddd", borderWidth:1, textAlignVertical: "top", borderRadius:10 }} />
                        </View>
                        <View style={{width:'100%', alignItems:'center', justifyContent:'center', marginTop:20}}>
                            <MyTimePicker date={this.state.eventDate} onChange={this.handleEventDateChange} timeText="xx:xx" dateText="Dia" />
                        </View>
                        <View>
                            <WCErrors errors={this.state.errors} />
                        </View>
                </KeyboardAwareScrollView>
            </BaseLightbox>
        );
    }
    /**
    ALARM PICKER
    <View style={{flexDirection:'column', alignItems:'flex-start', padding:20}}>
        <Text style={{textAlign:'left', width:'100%', fontWeight:'bold', color:"#000", fontSize:18}}>Alarma</Text>
        <MyTimePicker date={this.state.alarmDate } onChange={this.handleAlarmDateChange}/>
    </View>
    **/

    handleEventDateChange(eventDate){
        this.setState({eventDate});
    }

    handleAlarmDateChange(alarmDate){
        this.setState({alarmDate});
    }

    validate(){
        let errors = {};
        let title = this.state.title;

        if(title!==null){
            title = title.toString();
            if(!validator.isLength(title, { min:5, max:100 })){
                errors.title = "El título tiene que tener entre 5 y 100 caracteres";
            }
        }else{
            errors.title = "La nota tiene que tener un título";
        }
        this.setState({errors});
        let keys = Object.keys(errors);
        for(let key of keys){
            if(errors[key]!==null){
                return false;
            }
        }
        return true;
    }

    async save(){
        if(!this.validate()){
            return;
        }
        try {
            let note = {
                kid_ids: [this.state.currentKid.id],
                type:  "alarm",
                text:  this.state.text,
                title: this.state.title,
                date:  new Date(),
                eventDate:  this.state.eventDate,
                alarmDate:  this.state.alarmDate,
            };

            noteManager.addNote(note);

            this.setState({
                id:note.id,
                editing:false,
                modalTitle: "Evento Salvado",
                modalText: "El evento se salvo con éxito",
                modalVisible: true,
                modalType: "success",
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
