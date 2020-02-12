var React = require('react-native');
import {generateStyles} from './base.js';

export const colors = {
    white: "#fff",
    black: "#333",
    primary: "#2296F3",
    primary_light: "#81BBEB",
    primary_dark: "#0465B5",
    secondary: "#000",
    error: "#D01919",
    form:{
        checkBox: "#2296F3"
    }
};

export const styles = generateStyles(colors);
