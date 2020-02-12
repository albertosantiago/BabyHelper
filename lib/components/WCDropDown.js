import React from 'react';
import { Text, View, TextInput, TouchableHighlight, Image, ScrollView} from 'react-native';
import BaseComponent from '../BaseComponent.js';
import IconButton from './IconButton';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';

export default class WCDropDown extends BaseComponent {

    constructor(props){
        super(props);
        this.state = {
            options: this.props.options,
            selected: this.props.selected,
            visibleOptions: false
        };
        this.showOptions = this.showOptions.bind(this);
        this._renderModalContent = this._renderModalContent.bind(this);
    }

    componentDidMount() {}

    render() {
        if(this.state.options.length===0){
            return <View></View>;
        }
        let selectedOpt = (this.state.selected!==undefined) ? this.state.selected: this.state.options[0];
        let iconSize = 28;

        if(this.props.iconSize){
            iconSize = this.props.iconSize;
        }
        return (
            <View>
                {this._renderModalContent()}
                <TouchableHighlight
                    onPress={() => this.showOptions()}
                >
                    <View style={{flexDirection:'row'}}>
                        {(this.props.expanded) &&
                            <Text style={{margin:10, marginTop:0, fontSize:22, fontWeight: 'bold', color:"#333"}}>{selectedOpt.text}</Text>
                        }
                        <Icon name="md-arrow-dropdown-circle" size={iconSize} color="#000" />
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    _renderModalContent(){
        let containerStyle = {
            backgroundColor:"#fff",
            flexDirection:'column',
            borderRadius:10,
            padding:10,
            paddingTop:10,
            paddingBottom:10
        };

        return (
            <View>
                {(this.state.visibleOptions) &&
                    <Modal
                      isVisible={this.state.visibleOptions}
                      animationIn={'slideInLeft'}
                      animationOut={'slideOutRight'}
                      onBackdropPress={()=>{this._hideModal()}}
                    >
                        {(this.props.scrolled) ?
                            <ScrollView style={containerStyle}>
                                {this._renderOptions()}
                            </ScrollView>
                            :
                            <View style={containerStyle}>
                                {this._renderOptions()}
                            </View>
                        }
                    </Modal>
                }
            </View>
        );
    }

    _renderOptions(){
        return (
            <View>
                {this.props.options.map((option, index, options)=>{
                    let borderWidth = 1;
                    if((index+1)===options.length){
                        borderWidth = 0;
                    }

                    return (
                        <View key={index}>
                            <TouchableHighlight
                                onPress={()=> this.setCurrentOption(option)}
                            >
                                <View style={{padding:10, paddingTop:8, paddingBottom:8, flexDirection:'row', borderBottomWidth: borderWidth, borderColor:"#ccc"}}>
                                    <View style={{width:'70%', justifyContent: 'center'}}>
                                        <Text style={{fontSize:24, color:"#444"}}>{option.text}</Text>
                                    </View>
                                    <View style={{width:'25%', alignItems:'flex-end'}}>
                                        {(option.icon) &&
                                            <Icon name={option.icon} size={30} color="#444" />
                                        }
                                        {(option.image) &&
                                            <Image source={option.image}  resizeMode="contain" style={{width:50, height:50}}/>
                                        }
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </View>
                    );
                })}
            </View>
        )
    }

    setCurrentOption(opt){
        this.setState({
            selected: opt,
            visibleOptions: false
        });
        this.props.onChange(opt);
    }

    showOptions(){
        this.setState({visibleOptions: true});
    }

    _hideModal(){
        this.setState({visibleOptions: false});
    }
}
