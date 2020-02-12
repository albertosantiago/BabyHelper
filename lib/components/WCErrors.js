import React from 'react';
import {Text, View} from 'react-native';
import BaseComponent from '../BaseComponent.js';

export default class WCErrors extends BaseComponent {

    constructor(){
        super();
    }

    componentDidMount() {}

    componentWillReceiveProps(nextProps){
        if(nextProps.errors !== this.props.errors) {
            this.setState({
                errors: nextProps.errors,
            });
        }
    }

    render() {
        let keys = Object.keys(this.props.errors);
        return (
            <View>
                {(keys.length===0)
                    ?
                    <View></View>
                    :
                    <View style={{borderColor:"#ff0000"}}>
                        {this._renderErrors(keys)}
                    </View>
                }
            </View>
        );
    }

    _renderErrors(keys){
        return (
            <View>
                {keys.map((key)=>{
                    return(
                        <View key={key}>
                            <Text style={{margin:10, textAlign:'center',color:this.theme.colors.error, fontSize:16, fontWeight:'bold'}}>{this.props.errors[key]}</Text>
                        </View>
                        );
                    }
                )}
            </View>
        );
    }

}
