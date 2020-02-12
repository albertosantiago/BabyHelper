import Autocomplete from 'react-native-autocomplete-input';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from 'react-native';

import { AsyncStorage} from 'react-native';
import { Actions } from 'react-native-router-flux';

import BaseComponent from '../../lib/BaseComponent.js';
import IconButton from '../../lib/components/IconButton';
import MyTimePicker from "../../lib/components/MyTimePicker";
import ModalMessage from '../../lib/components/ModalMessage';
import {noteManager} from '../../lib/NoteManager.js';
import KidSelector from '../../lib/components/KidSelector';
import BaseLightbox from '../../lib/components/BaseLightbox';

import WCErrors from '../../lib/components/WCErrors';
import WCInput from '../../lib/components/WCInput';
import validator from 'validator';

var dateFormat = require('dateformat');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

var dateFormat = require('dateformat');
const md5 = require('js-md5');

const styles = StyleSheet.create({
  autocompleteContainer: {
    zIndex: 1,
    width:"100%",
    alignItems:"center",
    justifyContent:'center',
    position:"absolute",
    top:20,
  }
});

export default class MedicinesForm extends BaseComponent{

    constructor(props) {
        super(props);
        var date = new Date();
        this.state = {
            query: '',
            medicines:[],
            location:1,
            date: date,
            currentMedicine: "Sin Medicinas",
            lastNotes: [],
            errors:{},
            currentKid: this.props.child
        };
        this.save         = this.save.bind(this);
        this._hideModal   = this._hideModal.bind(this);
        this.addMedicine  = this.addMedicine.bind(this);
        this.setMedicine  = this.setMedicine.bind(this);
    }

    async componentDidMount() {
        var self = this;
        var lastNotes = await noteManager.getNotes({
            key: 'type',
            val:'medicine'
        },{
            size: 3
        });
        this.setState({
            lastNotes: lastNotes
        });
        AsyncStorage.getItem("@BabyHelper:medicines").then((value) => {
            var medicines = JSON.parse(value);
            if(medicines!==null){
                self.setState({
                    medicines:medicines,
                    currentMedicine:undefined,
                    currentMedicineId:undefined,
                });
            }
        }).done();
    }

    findMedicine(query) {
        if (query === '') {
            return [];
        }
        const { medicines } = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return medicines.filter(medicine => medicine.name.search(regex) >= 0);
    }

    render() {

        var medicineText = "Sin medicinas";
        if(this.state.medicines!==null){
          if(this.state.currentMedicine!==null){
              medicineText = this.state.currentMedicine;
          }else{
              if(this.state.medicines.length>0){
                  medicineText = this.state.medicines[0];
              }
          }
        }
        var auxDate = new Date();
        var dateFormatted = dateFormat(this.state.date, "dd-mm-yyyy");
        if(this.state.date.toDateString() == auxDate.toDateString()){
            dateFormatted = "HOY";
        }

        var autocompeteBorderColor = (this.state.errors.medicineName)? this.theme.colors.error: "#DDD";

        const { query } = this.state;
        const medicines = this.findMedicine(query);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        const self = this;

        return(
            <BaseLightbox type="confirm" onConfirm={this.save}  horizontalPercent={0.9} verticalPercent={0.88}>
                <KeyboardAwareScrollView style={{backgroundColor:"#fff", paddingTop:"0%"}}>
                    <ModalMessage type="success" onPress={()=> this._hideModal()} message={this.state.modalText} visible={this.state.modalVisible} />
                    <View style={{position:'absolute',top:0, right:10, width:200}}>
                        <KidSelector size='small' showImg={true} withAll={false} selected={this.state.currentKid} onChange={(kid)=> this.setState({currentKid:kid})} />
                    </View>
                    <View style={{marginTop:40,marginBottom:0, width:"100%", alignItems:'center', flexDirection:'column', paddingBottom:0}}>
                        <Text style={{fontWeight: 'bold', color:"#000", fontSize:24, marginTop:0, marginBottom:0}}>
                            Salud
                        </Text>
                        <Text style={{color:"#000", fontSize:14, marginTop:0, marginBottom:0, padding:10, paddingBottom:0}}>
                            Medicamentos, vitaminas, gotas, etc.
                        </Text>
                    </View>
                    <View style={{paddingTop:0, marginTop:0}}>
                        <View style={[{
                                width:"100%",
                                paddingTop:0,
                                alignItems:"center",
                            }]}>
                            <Autocomplete
                              autoCapitalize="none"
                              autoCorrect={false}
                              containerStyle={styles.autocompleteContainer}
                              inputContainerStyle={{ width: 240, height:50, backgroundColor:this.theme.colors.white,
                                                    margin:5, padding:5, paddingTop:0, marginTop:0, borderWidth:1,
                                                    borderColor:autocompeteBorderColor, borderRadius: 10, width:"90%"}}
                              data={medicines.length === 1 && comp(query, medicines[0].name) ? [] : medicines}
                              defaultValue={query}
                              listStyle={{borderRadius:10, padding:10, marginTop:0}}
                              listContainerStyle={{width:300}}
                              onChangeText={text => this.setState({ query: text })}
                              placeholder="Medicina, Vitamina, Gotas, etc."
                              renderItem={(medicine) => {
                                  return (
                                    <TouchableOpacity onPress={() => {
                                        this.setState({
                                             query: this.ucwords(medicine.name),
                                             currentMedicine: this.ucwords(medicine.name),
                                             currentMedicineId: medicine.id
                                        });
                                    }}>
                                      <Text style={{fontSize:20, marginBottom:8}}>
                                         {this.ucwords(medicine.name)}
                                      </Text>
                                    </TouchableOpacity>
                                );
                              }}
                              renderTextInput={props => {
                                  return (
                                      <TextInput
                                        {...props}
                                        underlineColorAndroid='rgba(0,0,0,0)'
                                        style={{fontSize:20}}
                                      />
                                  );
                              }}
                            />
                        </View>
                        <View style={{width:"100%",alignItems:'center'}} >
                            <View style={{width:"96%", padding:15, paddingTop:20, marginTop:70, paddingBottom:0}}>
                                <Text style={{fontSize:20, fontWeight:"bold", paddingBottom:10}}>Últimas Tomas</Text>
                                <View>
                                    {((this.state.lastNotes !== undefined) && (this.state.lastNotes.length>0)) ? this.state.lastNotes.map(
                                         (note) => {
                                             return (
                                                <View style={{flexDirection:"row", width:"100%",height:50}} key={note.id}>
                                                    <Text style={{padding:10, paddingTop:18, paddingBottom:8, fontSize:16, width:'80%'}} >{this.ucwords(note.medicineName)}</Text>
                                                    <View style={{width:'20%'}}>
                                                        <IconButton icon="ios-redo" size={30} style={{marginLeft:20, width:30, height:30}} onPress={()=>this.setMedicine(note)}  />
                                                    </View>
                                                </View>
                                            );
                                         },
                                     ):<Text>Aún no ha tomado ningún medicamento</Text>}
                                </View>
                            </View>
                        </View>
                        <View style={[this.theme.styles.form_cell,{marginTop:10, marginBottom:0}]}>
                            <MyTimePicker date={this.state.date} onChange={this.handleDateChange}/>
                        </View>
                        <View>
                            <WCErrors errors={this.state.errors} />
                        </View>
                  </View>
              </KeyboardAwareScrollView>
        </BaseLightbox>
        );
    }

    ucwords(str) {
      return (str + '')
        .replace(/^(.)|\s+(.)/g, function ($1) {
          return $1.toUpperCase()
        })
    }

    setMedicine(note){
        this.setState({
            query: this.ucwords(note.medicineName),
            currentMedicine: this.ucwords(note.medicineName),
            currentMedicineId: note.medicineId
        });
    }

    async addMedicine(medicine){
        var medicines = this.state.medicines;
        medicines.push(medicine);
        var self = this;
        AsyncStorage.setItem("@BabyHelper:medicines", JSON.stringify(medicines)).done(() => {
            self.setState({medicines:medicines});
        });
    }

    validate(){
        let errors = {};
        let medicineName = this.state.query.trim();

        if(medicineName!==null){
            medicineName = medicineName.toString();
            if(!validator.isLength(medicineName, { min:2, max:250 })){
                errors.medicineName = "El medicamente tiene que tener un nombre con un número de caracteres entre 2 y 50";
            }
        }else{
            errors.medicineName = "El nombre del medicamento no puede estar vació";
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
        var medicineName = this.ucwords(this.state.query.trim());
        var medicineId = undefined;
        if(this.state.currentMedicine!==undefined){
            if(this.state.currentMedicine.trim()===medicineName){
                medicineId = this.state.currentMedicineId;
            }
        }
        if(medicineId===undefined){
            medicineId = md5(medicineName+" "+new Date().toISOString());
            await this.addMedicine({
                name: medicineName,
                id: medicineId
            });
        }

        try {
            let note = {
                kid_ids: [this.state.currentKid.id],
                type: "medicine",
                medicineName: medicineName,
                medicineId: medicineId,
                date: this.state.date
            };
            noteManager.addNote(note);
            this.setState({
                modalText: "La nota se salvo con exito",
                modalVisible: true
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
