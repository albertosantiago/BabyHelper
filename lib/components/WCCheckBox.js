import React from 'react';
import { Text, View, TouchableOpacity, Image} from 'react-native';
import BaseComponent from '../BaseComponent.js';

export default class WCCheckBox extends BaseComponent {

    constructor(props){
        super(props);
        this.state = {
            checked: this.props.isChecked
        };
        this._toogle = this._toogle.bind(this);
    }

    componentDidMount() {}

    render() {
        return (
        <TouchableOpacity
            onPress={()=>this._toogle()}
            >
            <View style={{flexDirection:'row'}}>
                {this._renderImage()}
                <Text style={{paddingLeft:20, fontSize:21}}>
                    {this.props.text}
                </Text>
            </View>

        </TouchableOpacity>);
    }

    _toogle(){
        let checked = !this.state.checked;
        this.setState({
            checked
        });
        this.props.onChange();
    }

    _renderImage(){
        if(this.state.checked){
            return <Image source={require('../../assets/checked.png')} style={{width:20, height:20, marginTop:5}} />;
        }
        return <Image source={require('../../assets/unchecked.png')} style={{width:20, height:20, marginTop:5}} />;
    }

}
