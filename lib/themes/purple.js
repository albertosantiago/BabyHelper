var React = require('react-native');
import {generateStyles} from './base.js';

export const colors = {
    white: "#fff",
    black: "#333",
    primary: "#6B0073",
    primary_light: "#AD00B9",
    primary_dark: "#300033",
    secondary: "#000",
    error: "#D01919",
    form:{
        checkBox: "#6B0073"
    }
};

export const styles = generateStyles(colors);
