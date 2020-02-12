import React from 'react';
import {Text, View, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import BaseComponent from '../../lib/BaseComponent.js';
import IconButton from '../../lib/components/IconButton';
import ModalMessage from '../../lib/components/ModalMessage';
import MyTimePicker from "../../lib/components/MyTimePicker";
import WCErrors from '../../lib/components/WCErrors';
import WCInput from '../../lib/components/WCInput';
import validator from 'validator';
import {noteManager} from '../../lib/NoteManager.js';
import KidSelector from '../../lib/components/KidSelector';
import BaseLightbox from '../../lib/components/BaseLightbox';


export default class PersonalForm extends BaseComponent {

    constructor(props) {
        super(props);
        var date = new Date();
        this.state = {
            date: date,
            text: "",
            title: "",
            errors:{},
            currentKid: this.props.child
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
            <BaseLightbox type="confirm" onConfirm={this.save}  horizontalPercent={0.9} verticalPercent={0.83}>
                <KeyboardAwareScrollView style={{backgroundColor:"#fff", paddingTop:"0%"}}>
                    <View style={this.theme.styles.form_container}>
                        <ModalMessage type="success" onPress={()=> this._hideModal()} message={this.state.modalText} visible={this.state.modalVisible} />
                        <View style={{position:'absolute',top:0, right:0, width:200, alignItems:'flex-end', justifyContent:'flex-end'}}>
                            <KidSelector size='small' showImg={true} withAll={false} selected={this.state.currentKid} onChange={(kid)=> this.setState({currentKid:kid})} />
                        </View>
                        <View style={{marginTop:40,marginBottom:20, width:"100%", alignItems:'center'}}>
                            <Text style={{fontWeight: 'bold', color:"#000", fontSize:24, marginTop:0, marginBottom:0}}>
                                Nota Personal
                            </Text>
                        </View>
                        <View style={{width:"100%", marginBottom:10, alignItems:'center'}}>
                            <WCInput
                                containerStyle={{width:"100%"}}
                                underlineColorAndroid='rgba(0,0,0,0)'
                                error={this.state.errors.text}
                                multiline={true}
                                maxLength={400}
                                numberOfLines={12}
                                value={this.state.text}
                                onChangeText={(text)=> this.setState({text})}
                                style={{width:250, height: 200, flexWrap: "wrap", backgroundColor: '#fff', fontSize:18, borderColor:"#ddd", borderWidth:1, textAlignVertical: "top", borderRadius:10 }} />
                        </View>
                        <View style={{width:'100%', alignItems:'center', justifyContent:'center', marginTop:20}}>
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

    validate(){
        let errors = {};
        let title = this.state.title;
        let text  = this.state.text;

        if(text !==null){
            text = text.toString();
            if(!validator.isLength(text, { min:2, max:250 })){
                errors.text = "El texto tiene que tener un número de caracteres entre 2 y 250";
            }
        }else{
            errors.text = "Tienes que anotar algo";
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
                type:  "personal",
                text:  this.state.text,
                date:  this.state.date,
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
