"use strict";

var exports = module.exports = {};

const IMAGES = {
    feed:  require("../assets/biberon.png"),
    bath:  require("../assets/bath.png"),
    alarm: require("../assets/calendar.png"),
    cleaning: require("../assets/panal.png"),
    weight: require("../assets/maquina_pesar.png"),
    height: require("../assets/centimeter.png"),
    personal:    require("../assets/notas.png"),
    temperature: require("../assets/thermometer.png"),
    medicine: require("../assets/medicinas.png"),
    pictures: require("../assets/picture.png"),
    wakeup:   require("../assets/sun.png"),
    bed_down: require("../assets/moon.png"),
    videos:   require("../assets/video.png"),
    defaultKid:   require("../assets/if_kid_1930420.png"),
    defaultAdult: require("../assets/if_Face_blonde_2099205.png"),
};

exports.IMAGES = IMAGES;

exports.NOTE_TYPES = [
    {
        id:   1,
        key:  'feed',
        label: 'Alimentación',
        image: IMAGES.feed
    },
    {
        id:   2,
        key:  'cleaning',
        label: 'Cambios',
        image: IMAGES.cleaning
    },
    {
        id:   3,
        key:  'dream',
        label: 'Sueño',
        image: IMAGES.bed_down
    },
    {
        id:   4,
        key:  'bath',
        label: 'Baños',
        image: IMAGES.bath
    },
    {
        id:   5,
        key:  'weight',
        label: 'Peso',
        image: IMAGES.weight
    },
    {
        id:   6,
        key:  'height',
        label: 'Altura',
        image: IMAGES.height
    },
    {
        id:   7,
        key:  'temperature',
        label: 'Temperatura',
        image: IMAGES.temperature
    },
    {
        id:   8,
        key:  'medicine',
        label: 'Medicinas',
        image: IMAGES.medicine
    },
    {
        id:   9,
        key:  'personal',
        label: 'Personal',
        image: IMAGES.personal
    },
    {
        id:   10,
        key:  'alarm',
        label: 'Agenda',
        image: IMAGES.alarm
    },
    {
        id:   11,
        key:  'image',
        label: 'Imágenes',
        image: IMAGES.pictures
    },
    {
        id:   12,
        key:  'video',
        label: 'Videos',
        image: IMAGES.videos
    }
];
