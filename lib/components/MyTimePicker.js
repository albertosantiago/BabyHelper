import React from 'react';
import { Text, View,TouchableOpacity} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import BaseComponent from '../BaseComponent.js';
import I18n from '../I18N.js';
import Icon from 'react-native-vector-icons/Ionicons';

var dateFormat = require('dateformat');
dateFormat.i18n = I18n.t("dateFormat");

export default class MyTimePicker extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            date: props.date,
            isDateTimePickerVisible: false,
            isTimePickerVisible: false,
            changed: false,
        };
        this.onChange = props.onChange;
    }

    componentDidMount() {}

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        var currentDate = this.state.date;
        currentDate.setMonth(date.getMonth());
        currentDate.setYear(date.getFullYear());
        currentDate.setDate(date.getDate());
        this.setState({
            date: currentDate,
            changedDate: true
        });
        this._hideDateTimePicker();
        this.onChange(date);
    };

    _showTimePicker = () => this.setState({ isTimePickerVisible: true });

    _hideTimePicker = () => this.setState({ isTimePickerVisible: false });

    _handleTimePicked = (date) => {
        var currentDate = this.state.date;
        currentDate.setHours(date.getHours());
        currentDate.setMinutes(date.getMinutes());
        this.setState({date:currentDate, changedTime: true});
        this._hideTimePicker();
        this.onChange(date);
    };

    componentWillReceiveProps(nextProps){
        if(nextProps.date !== this.props.date) {
            this.setState({
                date: nextProps.date,
            });
        }
    }

    render(){
        if(this.state.type==='buttons'){
            return this.renderButtons();
        }
        return this.renderText();
    }

    renderText() {
        var auxDate = new Date();
        var dateFormatted = dateFormat(this.state.date, "d mmmm");
        var timeFormatted = dateFormat(this.state.date, "HH:MM");

        let dateStyle = {borderColor:"#000", fontWeight:'bold', borderBottomWidth:1, fontSize:18, color:"#000"};

        if(this.state.date.toDateString() == auxDate.toDateString()){
            dateFormatted = "Hoy";
        }
        if(this.props.timeText!==undefined){
            if(!this.state.changedTime){
                timeFormatted = this.props.timeText;
            }
        }
        if(this.props.dateText!==undefined){
            if(!this.state.changedDate){
                dateFormatted = this.props.dateText;
            }
        }

        return (
            <View style={{marginTop:0,marginBottom:0, width:"100%",flexDirection:"row",alignItems:'center', alignSelf:"center", justifyContent:'center'}}>
                <View style={{paddingRight:10}}>
                    <Icon name="ios-clock-outline" size={35} color="#000" />
                </View>
                <View>
                    <TouchableOpacity onPress={this._showDateTimePicker} style={{marginTop:0, padding:10}}>
                        <Text style={dateStyle}>{dateFormatted}</Text>
                    </TouchableOpacity>
                    <DateTimePicker
                      date={this.state.date}
                      isVisible={this.state.isDateTimePickerVisible}
                      onConfirm={this._handleDatePicked}
                      onCancel={this._hideDateTimePicker}
                    />
                </View>
                <View>
                    <Text style={{fontSize:18}}> a las </Text>
                </View>
                <View>
                    <TouchableOpacity onPress={this._showTimePicker}  style={{borderColor:"#000", marginTop:0, padding:10}}>
                        <Text style={dateStyle}>{timeFormatted}</Text>
                    </TouchableOpacity>
                    <DateTimePicker
                      date={this.state.date}
                      mode="time"
                      isVisible={this.state.isTimePickerVisible}
                      onConfirm={this._handleTimePicked}
                      onCancel={this._hideTimePicker}
                    />
                </View>
            </View>);
    }

    renderButtons() {
        var auxDate = new Date();
        var dateFormatted = dateFormat(this.state.date, "d mmmm");
        var timeFormatted = dateFormat(this.state.date, "HH:MM");

        let dateStyle = this.theme.styles.global_default_button_text;
        if(this.state.date.toDateString() == auxDate.toDateString()){
            dateFormatted = "HOY";
        }
        if(this.props.timeText!==undefined){
            if(!this.state.changedTime){
                timeFormatted = this.props.timeText;
            }
        }
        if(this.props.dateText!==undefined){
            if(!this.state.changedDate){
                dateFormatted = this.props.dateText;
            }
        }

        return (
            <View style={{marginTop:0,marginBottom:0, width:"100%",flexDirection:"row",alignItems:'center', alignSelf:"center"}}>
                <View style={{width:'50%'}}>
                    <TouchableOpacity onPress={this._showDateTimePicker} style={[this.theme.styles.global_default_button, {justifyContent:'center', marginTop:0}]}>
                        <Text style={dateStyle}>{dateFormatted}</Text>
                    </TouchableOpacity>
                    <DateTimePicker
                      date={this.state.date}
                      isVisible={this.state.isDateTimePickerVisible}
                      onConfirm={this._handleDatePicked}
                      onCancel={this._hideDateTimePicker}
                    />
                </View>
                <View style={{width:'50%'}}>
                    <TouchableOpacity onPress={this._showTimePicker}  style={[this.theme.styles.global_default_button,  {justifyContent:'center', marginTop:0}]}>
                        <Text style={this.theme.styles.global_default_button_text}>{timeFormatted}</Text>
                    </TouchableOpacity>
                    <DateTimePicker
                      date={this.state.date}
                      mode="time"
                      isVisible={this.state.isTimePickerVisible}
                      onConfirm={this._handleTimePicked}
                      onCancel={this._hideTimePicker}
                    />
                </View>
            </View>);
    }
}
