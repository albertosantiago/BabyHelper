import React from 'react';
import { Text, View,TextInput, Alert} from 'react-native';
import { Actions } from 'react-native-router-flux';
import BaseComponent from '../lib/BaseComponent.js';
import ModalMessage from '../lib/components/ModalMessage';
import IconButton from '../lib/components/IconButton';
import MyImgPicker from '../lib/components/MyImgPicker';
import {profileManager} from '../lib/ProfileManager.js';
import validator from 'validator';
import WCErrors from '../lib/components/WCErrors';
import WCInput from '../lib/components/WCInput';

export default class ProfileForm extends BaseComponent{

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            picture: '',
            modalVisible: false,
            modalContent: '',
            modalType: '',
            profile: undefined,
            errors:{}
        }
        this._hideModal = this._hideModal.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount(){
        profileManager.getProfile().then((profile) => {
           this.setState({
             name: profile.name,
             picture: profile.picture,
             profile: profile
           });
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ModalMessage type="success" onPress={()=> this._hideModal()} message={this.state.modalText} visible={this.state.modalVisible} />
                <View style={this.theme.styles.form_container}>
                    <View style={this.theme.styles.form_cell}>
                        <MyImgPicker picture={this.state.picture} onChange={(picturePicked)=> this.setState({picture:picturePicked})}/>
                    </View>
                    <View>
                        <WCInput
                            label="Nombre"
                            error={this.state.errors.name}
                            style={this.theme.styles.form_input}
                            onChangeText={(name) => this.setState({name:name})}
                            maxLength = {40}
                            value={this.state.name}
                            placeholder="Mi nombre"
                            underlineColorAndroid='rgba(0,0,0,0)'
                            />
                    </View>
                    <View>
                        <WCErrors errors={this.state.errors} />
                    </View>
                    <View style={this.theme.styles.form_cell}>
                        <IconButton icon="md-checkmark-circle" onPress={this.save}  />
                    </View>
                </View>
            </View>
        );
    }

    _hideModal(){
        this.setState({modalVisible:false});
        Actions.home();
    }

    validate(){
        let errors = {};
        let name = this.state.name;
        if(name!==null){
            name = name.toString().replace(/\s\s+/g,' ');
            if(!validator.isLength(name, { min:2, max:25 })){
                errors.name = "El nombre tiene que tener un número de caracteres entre 2 y 15";
            }
            name = name.toString().replace(/\s+/g,'');
            if(!validator.isAlphanumeric(name)){
                errors.name = "El nombre solo puede contener caracteres alfanuméricos";
            }
        }else{
            errors.name = "El nombre es obligatorio";
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
            let profileChanges = {
                name:  this.state.name.trim(),
                picture:  this.state.picture,
                updatedServer: false
            };
            profileManager.set(profileChanges);
            this.setState({
                modalText: "¡Tu perfil se salvo con éxito!",
                modalType: "success",
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
