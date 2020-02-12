import React from 'react';
import {
    Text, View, TextInput, Alert,
    Slider, StyleSheet, TouchableOpacity,
    ScrollView
} from 'react-native';

import { AsyncStorage} from 'react-native';
import { Actions } from 'react-native-router-flux';
import BaseComponent from '../../lib/BaseComponent.js';
import IconButton from '../../lib/components/IconButton';
import MyTimePicker from "../../lib/components/MyTimePicker";
import ModalMessage from '../../lib/components/ModalMessage';
import WCSegmentedControls from '../../lib/components/WCSegmentedControls';
import {noteManager} from '../../lib/NoteManager.js';

import WCErrors from '../../lib/components/WCErrors';
import WCInput from '../../lib/components/WCInput';
import validator from 'validator';
import KidSelector from '../../lib/components/KidSelector';
import BaseLightbox from '../../lib/components/BaseLightbox';

var dateFormat = require('dateformat');

const md5 = require('js-md5');

const options = [
    { label:'Pecho', value: 'breast' },
    { label:'Biberón', value: 'bottle'},
    { label:'Papillas', value: 'pap' },
];

const breastOptions = [
    { label:'Izquierdo', value: 'left' },
    { label:'Derecho', value: 'right'}
];

const styles = StyleSheet.create({
  autocompleteContainer: {
    zIndex: 1,
    width:"100%",
    alignItems:"center",
    justifyContent:'center',
    position:"absolute",
    top:50,
  }
});

import Autocomplete from 'react-native-autocomplete-input';


export default class FoodForm extends BaseComponent {

    constructor(props) {
        super(props);
        var date = new Date();
        this.state = {
            feedType : 'breast',
            breast: 'right',
            indexType: 0,
            indexBreast: 0,
            date: date,
            feedTime:10,
            feedAmount:10,
            paps: [],
            query: '',
            errors:{},
            currentKid: this.props.child,
        };
        this.save = this.save.bind(this);
        this.setType = this.setType.bind(this);
        this.setBreastSide = this.setBreastSide.bind(this);
    }

    async componentDidMount() {
        var self = this;
        var lastNotes = await noteManager.getNotes([{
            key: 'type',
            val:'feed'
        },{
            key: 'feedType',
            val:'pap'
        }],{
            size: 3
        });
        this.setState({
            lastNotes: lastNotes
        });
        AsyncStorage.getItem("@BabyHelper:paps").then((value) => {
            var paps = JSON.parse(value);
            if(paps!==null){
                self.setState({
                    paps:paps,
                    currentPap:undefined,
                    currentPapId:undefined,
                });
            }
        }).done();
    }

    setType(op){
      let indexType = (op.value==='breast') ? 0: (op.value==='bottle') ? 1 : 2;
      this.setState({
         feedType: op.value,
         indexType: indexType
      });
    }

    setBreastSide(op){
      let indexBreast = (op.value==='left') ? 0: 1;
      this.setState({
         breast: op.value,
         indexBreast: indexBreast
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
            <BaseLightbox type="confirm" onConfirm={this.save}  horizontalPercent={0.94} verticalPercent={0.95}>
                <ScrollView style={{backgroundColor:"#fff", paddingLeft:"2%", paddingRight:"2%", width:'96%'}}>
                    <ModalMessage type="success" onPress={()=> this._hideModal()} message={this.state.modalText} visible={this.state.modalVisible} />
                    <View style={{position:'absolute',top:0, right:10, width:200}}>
                        <KidSelector size='small' showImg={true} withAll={false} selected={this.state.currentKid} onChange={(kid)=> this.setState({currentKid:kid})} />
                    </View>
                    <View style={{marginTop:40,marginBottom:20, width:"100%", alignItems:'center'}}>
                        <Text style={{fontWeight: 'bold', color:"#000", fontSize:24, marginTop:0, marginBottom:0}}>
                            Alimentación
                        </Text>
                    </View>
                    <View style={{paddingTop:0, marginTop:10,marginBottom:15, width:"100%"}}>
                        <WCSegmentedControls
                            options={ options }
                            onChange={this.setType.bind(this)}
                            selected={ this.state.feedType }
                        />
                    </View>
                    {(this.state.feedType === 'breast') &&
                        this.renderFeedOptions()
                    }
                    {(this.state.feedType === 'bottle') &&
                        this.renderBottleOptions()
                    }
                    {(this.state.feedType === 'pap') &&
                        this.renderPapOptions()
                    }
                    <View style={{width:'100%', alignItems:'center', justifyContent:'center', marginTop:20}}>
                        <MyTimePicker date={this.state.date} onChange={this.handleDateChange}/>
                    </View>
                    <View>
                        <WCErrors errors={this.state.errors} />
                    </View>
                </ScrollView>
            </BaseLightbox>
        );
    }

    findPap(query) {
        if (query === '') {
            return [];
        }
        const { paps } = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return paps.filter(pap => pap.name.search(regex) >= 0);
    }


    setPap(note){
        this.setState({
            query: this.ucwords(note.papName),
            currentPap: this.ucwords(note.papName),
            currentPapId: note.papId
        });
    }


    renderPapOptions(){
        const { query } = this.state;
        const paps = this.findPap(query);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        const self = this;

        var autocompeteBorderColor = (this.state.errors.papName)? this.theme.colors.error: "#DDD";

        return (
        <View style={{width:"95%"}}>
            <View style={[{
                    width:"100%",
                    paddingTop:0,
                    alignItems:"center"
                }]}>
                <Text style={{fontWeight: 'normal', color:this.theme.colors.black, fontSize:18, marginTop:15, marginBottom:0}}>
                    Nombre de la papilla
                </Text>
                <Autocomplete
                  autoCapitalize="none"
                  autoCorrect={false}
                  containerStyle={styles.autocompleteContainer}
                  inputContainerStyle={{width: 250, height:50, backgroundColor:this.theme.colors.white,margin:5, marginTop:0, padding:5,borderWidth:1,borderColor:autocompeteBorderColor,borderRadius: 10,width:"90%", height:60}}
                  data={paps.length === 1 && comp(query, paps[0].name) ? [] : paps}
                  defaultValue={query}
                  listStyle={{borderRadius:10, padding:10, marginTop:8, borderTopWidth:1}}
                  listContainerStyle={{width:300}}
                  onChangeText={text => this.setState({ query: text })}
                  placeholder="Pera, Cereales, Plátano, etc."
                  renderItem={(pap) => {
                      return (
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                 query: this.ucwords(pap.name),
                                 currentPap: this.ucwords(pap.name),
                                 currentPapId: pap.id
                            });
                        }}>
                          <Text style={{fontSize:20, marginBottom:6, marginTop:6}}>
                             {this.ucwords(pap.name)}
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
            <View style={{alignItems:"center", marginBottom:20}} >
                <View style={{width:"100%", padding:15, paddingTop:20, marginTop:70}}>
                    <Text style={{fontSize:20, fontWeight:"bold", paddingBottom:10}}>Últimas Tomas</Text>
                    <View>
                        {((this.state.lastNotes !== undefined) && (this.state.lastNotes.length>0)) ? this.state.lastNotes.map(
                             (note) => {
                                 return (
                                    <View style={{flexDirection:"row", width:"100%",height:50}} key={note.id}>
                                        <Text style={{padding:10, paddingTop:18, paddingBottom:8, fontSize:16, width:'80%'}} >{this.ucwords(note.papName)}</Text>
                                        <View style={{width:'20%'}}>
                                            <IconButton icon="ios-redo" size={30} style={{marginLeft:20, width:30, height:30}} onPress={()=>this.setPap(note)}  />
                                        </View>
                                    </View>
                                );
                             },
                         ):<Text>Aún no ha tomado ninguna papilla</Text>}
                    </View>
                </View>
            </View>
        </View>
        );
    }

    renderBottleOptions(){
        return (
            <View style={{width:"100%", alignItems:"center"}}>
                {this.renderFeedAmount()}
            </View>
        );
    }

    renderFeedOptions(){
        return(
            <View style={{width:"100%", alignItems:"center"}}>
                <View style={{marginTop:5, marginBottom:0, width:"100%"}}>
                    <WCSegmentedControls
                        options={ breastOptions }
                        onChange={this.setBreastSide.bind(this)}
                        selected={ this.state.breast }
                    />
                </View>
                {this.renderFeedTime()}
        </View>);
    }

    renderFeedTime(){
        return (
            <View style={{width:"100%", alignItems:"center"}}>
                <View style={{marginTop:30,marginBottom:0, width:"90%", alignItems:'center'}}>
                    <Text style={{fontWeight: 'normal', color:this.theme.colors.black, fontSize:18, marginTop:5, marginBottom:5}}>
                        Tiempo de toma
                    </Text>
                    <TextInput
                        editable = {false}
                        style={[this.theme.styles.form_input,{color:"#000", width:150, textAlign:"center", fontSize:18}]}
                        onChangeText={(text) => this.setState({text})}
                        value={this.state.feedTime.toString()+" minutos"}
                        keyboardType="numeric"
                        underlineColorAndroid='rgba(0,0,0,0)'
                      />
                </View>
                <View>
                    <Slider
                     minimumTrackTintColor={this.theme.colors.black}
                     thumbTintColor={this.theme.colors.black}
                     thumbImage={require("../../assets/if_kid_1930420.png")}
                     style={{ width: 300, height:70}}
                     step={1}
                     minimumValue={1}
                     maximumValue={60}
                     value={this.state.feedTime}
                     onValueChange={val => this.setState({ feedTime: val })}
                    />
                </View>
            </View>
        );
    }

    renderFeedAmount(){
        return (
            <View style={{width:"100%", alignItems:"center"}}>
                <View style={{marginTop:25,marginBottom:0, width:"90%", alignItems:'center'}}>
                    <Text style={{fontWeight: 'normal', color:this.theme.colors.black, fontSize:18, marginTop:5, marginBottom:0}}>
                        Cantidad
                    </Text>
                    <Text style={{fontWeight: 'normal', color:this.theme.colors.black, fontSize:11, marginTop:5, marginBottom:5}}>* Mililitros / centrimetros cúbicos</Text>
                    <TextInput
                        editable = {false}
                        style={[this.theme.styles.form_input,{color:"#000", width:150, textAlign:"center", fontSize:18}]}
                        onChangeText={(text) => this.setState({text})}
                        value={this.state.feedAmount.toString()+" ml"}
                        keyboardType="numeric"
                        underlineColorAndroid='rgba(0,0,0,0)'
                      />
                </View>
                <View>
                    <Slider
                     minimumTrackTintColor={this.theme.colors.black}
                     thumbTintColor={this.theme.colors.black}
                     thumbImage={require("../../assets/if_kid_1930420.png")}
                     style={{ width: 300, height:70}}
                     step={5}
                     minimumValue={10}
                     maximumValue={300}
                     value={this.state.feedAmount}
                     onValueChange={val => this.setState({ feedAmount: val })}
                    />
                </View>
            </View>
        );
    }

    ucwords(str) {
      return (str + '')
        .replace(/^(.)|\s+(.)/g, function ($1) {
          return $1.toUpperCase()
        })
    }

    async addPap(pap){
        var paps = this.state.paps;
        paps.push(pap);
        var self = this;
        AsyncStorage.setItem("@BabyHelper:paps", JSON.stringify(paps)).done(() => {
            self.setState({paps:paps});
        });
    }

    validate(){
        let errors = {};
        if(this.state.feedType==='pap'){
            let papName = this.state.query.trim();
            if(papName!==null){
                papName = papName.toString();
                if(!validator.isLength(papName, { min:2, max:250 })){
                    errors.papName = "La papilla tiene que tener un nombre con un número de caracteres entre 2 y 50";
                }
            }else{
                errors.papName = "El nombre de la papilla no puede estar vació";
            }
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
                type: "feed",
                feedType: this.state.feedType,
                breast: this.state.breast,
                date: this.state.date,
                feedTime: this.state.feedTime,
                feedAmount: this.state.feedAmount,
                papName: '',
                papId: ''
            };

            if(this.state.feedType==='pap'){
                var papName = this.state.query.trim();
                var papId   = undefined;
                if(this.state.currentPap!==undefined){
                    if(this.state.currentPap.trim()===papName){
                        papId = this.state.currentPapId;
                    }
                }
                if(papId===undefined){
                    papId = md5(papName+" "+new Date().toISOString());
                    this.addPap({
                        name: papName,
                        id: papId
                    });
                }
                note.papName = papName;
                note.papId   = papId;
            }

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
