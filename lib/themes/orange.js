var React = require('react-native');
import {generateStyles} from './base.js';

export const colors = {
    white: "#fff",
    black: "#333",
    primary: "#F3621D",
    primary_light: "#ffa173",
    primary_dark: "#c64507",
    secondary: "#000",
    error: "#D01919",
    form:{
        checkBox: "#F3621D"
    }
};

export const styles = generateStyles(colors);
