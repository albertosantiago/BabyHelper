import React from 'react';
import {
    Text, View, TextInput,
    DatePickerAndroid, TouchableHighlight
} from 'react-native';

import BaseComponent from '../BaseComponent.js';

export default class WCInput extends BaseComponent {

    constructor(props){
        super();
        this.state = {
            date: props.date
        };
        this._pickDate    = this._pickDate.bind(this);
    }

    componentDidMount() {}

    render() {
        var dateText = "__ / __ / __";
        if(this.state.date !== null){
            var normalizedMonth = (this.state.date.getMonth()+1);
            var day   = (this.state.date.getDate() > 9 ) ? this.state.date.getDate(): "0"+this.state.date.getDate();
            var month = (normalizedMonth > 9 ) ? normalizedMonth: "0"+normalizedMonth;
            dateText  = day + " / "+month+" / "+this.state.date.getFullYear();
        }

        let inputErrorStyle = (this.props.error) ? {borderColor: this.theme.colors.error, color: this.theme.colors.error}: {};
        let labelErrorStyle = (this.props.error) ? {color: this.theme.colors.error}: {};

        return (
            <View style={this.theme.styles.form_cell}>
                <Text style={[this.theme.styles.form_label, labelErrorStyle]}>
                    {this.props.label}
                </Text>
                <TouchableHighlight onPress={this._pickDate}>
                    <Text style={[this.theme.styles.form_dateText, inputErrorStyle]}>
                        {dateText}
                    </Text>
                </TouchableHighlight>
            </View>
        );
    }

    async _pickDate(){
        try {
          const {action, year, month, day} = await DatePickerAndroid.open({
              date: new Date()
          });
          if (action !== DatePickerAndroid.dismissedAction) {
              var date = new Date();
              date.setDate(day);
              date.setMonth(month);
              date.setFullYear(year);
              this.setState({date});
              this.props.onChange(date);
          }
        } catch ({code, message}) {
          console.warn('Cannot open date picker', message);
        }
    }

}
