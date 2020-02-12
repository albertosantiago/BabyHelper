var React = require('react-native');
import {generateStyles} from './base.js';

export const colors = {
    white: "#fff",
    black: "#333",
    primary: "#EC008C",
    primary_light: "#F05CB3",
    primary_dark: "#AC0065",
    secondary: "#000",
    error: "#D01919",
    form:{
        checkBox: "#2296F3"
    }
};

export const styles = generateStyles(colors);
