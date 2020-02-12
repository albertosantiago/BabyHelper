import React from 'react';
import { Text, View, TouchableOpacity, Image} from 'react-native';
import BaseComponent from '../BaseComponent.js';

export default class WCSegmentedControls extends BaseComponent {

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
        let percentWidth = Math.round(100/(this.state.options.length))+"%";
        return (
            <View style={{flexDirection:'row', width:'100%'}}>
                {this.state.options.map((opt)=>{
                    let containerStyle = {marginBottom:6, width:percentWidth};
                    if(opt.value===this.state.selected){
                        containerStyle = {marginBottom:0, paddingBottom:3, borderBottomWidth:1, borderColor:"#ccc", width:percentWidth}
                    }
                    return (
                        <View key={opt.value} style={containerStyle}>
                            <TouchableOpacity
                                onPress={()=>this._toogle(opt)}
                                >
                                <View style={{flexDirection:'row'}}>
                                    <Text style={{paddingLeft:0,paddingRight:0, fontSize:21,  width:'100%', textAlign:'center'}}>
                                        {opt.label}
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
        this.setState({selected:opt.value});
        this.props.onChange(opt);
    }

}
