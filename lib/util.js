"use strict";
var dateFormat = require('dateformat');

var exports = module.exports = {};

var dayNames = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo"
];

exports.getWeek = function (d){
  var target  = new Date(d.valueOf());
  var dayNr   = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  var jan4    = new Date(target.getFullYear(), 0, 4);
  var dayDiff = (target - jan4) / 86400000;
  var weekNr = 1 + Math.ceil(dayDiff / 7);
  return weekNr;
}

exports.getDateTimeForHumans = function(date){
    let day  = this.getDayForHumans(date);
    let hour = this.getHourForHumans(date);
    return day + " / " + hour;
}

exports.getDayForHumans = function(date){
    var day = "";
    var now = new Date();
    var auxDate   = (date.getDate()>9) ? date.getDate(): "0"+date.getDate();
    var auxMonth = (date.getMonth()>8) ? (date.getMonth()+1): "0"+(date.getMonth()+1);
    if(date.getFullYear()===now.getFullYear()){
        day = auxDate+"/"+auxMonth;
    }else{
        day = auxDate+"/"+auxMonth+"/".date.getFullYear();
    }
    return day;
}

exports.getHourForHumans = function(date){
    return dateFormat(date, "HH:MM");
}
