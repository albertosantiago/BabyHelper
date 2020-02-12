import React from 'react';
import { Text, View, ScrollView, Alert, Picker } from 'react-native';
import { Actions } from 'react-native-router-flux';

import BaseComponent from '../lib/BaseComponent.js';
import ModalMessage from '../lib/components/ModalMessage';
import IconButton from '../lib/components/IconButton';
import MyImgPicker from '../lib/components/MyImgPicker';
import WCErrors from '../lib/components/WCErrors';
import WCInput from '../lib/components/WCInput';
import WCDatePicker from '../lib/components/WCDatePicker';
import validator from 'validator';
import {kidManager} from '../lib/KidManager.js';
import {profileManager} from '../lib/ProfileManager.js';
import {syncro} from '../lib/Syncro.js';

var RNFS = require('react-native-fs');


export default class BabyForm extends BaseComponent {

    constructor(props) {
        super(props);
        if(props.child===undefined){
            this.state = {
                sex: "femenino",
                name: "",
                id: null,
                picture: null,
                birthdate: new Date(),
                modalVisible: false,
                modalContent: '',
                modalType: '',
                editing: false,
                imageOptionsVisible: false,
                errors: {}
            }
        }else{
            var birthdate = new Date();
            if(props.child.birthdate!==null){
                birthdate = new Date(props.child.birthdate);
            }
            this.state = {
                id: props.child.id,
                name: props.child.name,
                sex: props.child.sex,
                picture: props.child.picture,
                birthdate: birthdate,
                editing: true,
                modalVisible: false,
                modalContent: '',
                imageOptionsVisible: false,
                errors:{}
            };
        }
        this.save  = this.save.bind(this);
        this._hideModal = this._hideModal.bind(this);
    }

    componentDidMount() {
        if(this.state.editing){
            Actions.refresh({title: 'Editando perfil de '+this.state.name});
        }
    }

    render() {

        return (
            <ScrollView
                style={{flex:1, backgroundColor:"#fff", flexDirection: 'column'}}
                contentContainerStyle={{justifyContent:'center', alignItems:'center'}}
            >
                <ModalMessage type="success" onPress={()=> this._hideModal()} message={this.state.modalText} visible={this.state.modalVisible} />
                <View style={this.theme.styles.form_container}>
                    <View style={this.theme.styles.form_cell}>
                        <MyImgPicker type="kid" picture={this.state.picture} onChange={(picturePicked)=> this.setState({picture:picturePicked})}/>
                    </View>
                    <View>
                        <WCErrors errors={this.state.errors} />
                    </View>
                    <View>
                        <WCInput
                            label="Nombre del bebe"
                            error={this.state.errors.name}
                            style={this.theme.styles.form_input}
                            onChangeText={(name) => this.setState({name})}
                            maxLength = {40}
                            value={this.state.name}
                            placeholder="Nombre del bebe"
                            underlineColorAndroid='rgba(0,0,0,0)'
                            />
                    </View>
                    <View style={this.theme.styles.form_cell}>
                        <Text style={this.theme.styles.form_label}>
                            Sexo
                        </Text>
                        <View
                            style={this.theme.styles.form_picker_container}
                        >
                            <Picker
                              style={this.theme.styles.form_picker}
                              selectedValue={this.state.sex}
                              onValueChange={(itemValue, itemIndex) => this.setState({sex: itemValue})}>
                              <Picker.Item label="Femenino" value="female" />
                              <Picker.Item label="Masculino" value="male" />
                            </Picker>
                        </View>
                    </View>
                    <View>
                        <WCDatePicker
                            onChange={(birthdate)=> this.setState({birthdate})}
                            error={this.state.errors.birthdate}
                            label="Fecha de nacimiento"
                            date={this.state.birthdate}
                        />
                    </View>
                    <View>
                        <IconButton icon="md-checkmark-circle" onPress={this.save}  />
                    </View>
                </View>
            </ScrollView>
        );
    }

    _hideModal(){
        this.setState({modalVisible:false});
        Actions.reset('home');
    }

    validate(){
        let errors = {};
        let name = this.state.name;
        let birthdate = this.state.birthdate;

        if(name!==null){
            name = name.toString().replace(/\s\s+/g,' ');
            if(!validator.isLength(name, { min:2, max:25 })){
                errors.name = "El nombre tiene que tener un número de caracteres entre 2 y 15";
            }
            name = name.toString().replace(/\s+/g,'');
            if(!validator.isAlphanumeric(name,['es-ES'])){
                errors.name = "El nombre solo puede contener caracteres alfanuméricos";
            }
        }else{
            errors.name = "El nombre es obligatorio";
        }
        if(birthdate!==null){
            birthdate = birthdate.toString();
            if(validator.toDate(birthdate)===null){
                errors.birthdate = "La fecha de nacimiento no es correta.";
            }
        }else{
            errors.birthdate = "La fecha de nacimiento es obligatoria";
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
            let profile = await profileManager.getProfile();
            var child  = {
                name:       this.state.name,
                birthdate:  this.state.birthdate,
                picture:    this.state.picture,
                sex:        this.state.sex,
                updatedServer: false,
                user_id: profile.id
            };
            if((!!this.props.child)&&
                (!!this.props.child.picture)){
                RNFS.unlink(this.props.child.picture.path);
            }
            if(this.state.id!==null){
                child.id = this.state.id;
            }
            child = {...this.props.child, ...child};
            var id = await kidManager.saveChild(child);
            syncro.tryExec({
                func:'_postKid',
                args: [
                    child
                ]
            });
            this.setState({
                id:id,
                modalText: "¡La ficha del bebe se salvo con éxito!",
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

}
