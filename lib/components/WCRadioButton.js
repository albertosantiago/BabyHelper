import React from 'react';
import { Text, View, TouchableOpacity, Image} from 'react-native';
import BaseComponent from '../BaseComponent.js';

export default class WCRadioButton extends BaseComponent {

    constructor(props){
        super(props);
        this.state = {
            selected: this.props.selected,
            options:  this.props.options
        };
        this._toogle = this._toogle.bind(this);
    }

    componentDidMount() {
    }

    render() {
        return (
        <View>
            {this.state.options.map((opt)=>{
                return (
                    <View key={opt.key}>
                        <TouchableOpacity
                            onPress={()=>this._toogle(opt)}
                            >
                            <View style={{flexDirection:'row', height:50}}>
                                {this._renderImage(opt)}
                                <Text style={{paddingLeft:20, fontSize:21, fontWeight:'bold'}}>
                                    {opt.text}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            })}
        </View>
        );
    }

    _toogle(opt){
        this.setState({selected:opt.key});
        this.props.onChange(opt);
    }

    _renderImage(opt){
        if(opt.key === this.state.selected){
            return <Image source={require('../../assets/checked.png')} style={{width:20, height:20, marginTop:5}} />;
        }
        return <Image source={require('../../assets/unchecked.png')} style={{width:20, height:20, marginTop:5}} />;
    }

}
