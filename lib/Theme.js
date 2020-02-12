import {eventApp} from "./EventApp.js";
import * as blueTheme from "./themes/blue.js";
import * as pinkTheme from "./themes/pink.js";
import * as orangeTheme from "./themes/orange.js";
import * as purpleTheme from "./themes/purple.js";

import {config} from "./Config.js";

var gStyles = blueTheme.styles;
var gColors = blueTheme.colors;

class Theme{

    constructor(){
        config.getConfig('theme').then((theme) => {
            this.setTheme(theme);
        });
    }

    getStyles(){
        return gStyles;
    }

    getColors(){
        return gColors;
    }

    setTheme(theme){
        this.theme = theme;
        if(theme === "pink"){
            gColors = pinkTheme.colors;
            gStyles = pinkTheme.styles;
        }
        if(theme === "blue"){
            gColors = blueTheme.colors;
            gStyles = blueTheme.styles;
        }
        if(theme === "orange"){
            gColors = orangeTheme.colors;
            gStyles = orangeTheme.styles;
        }
        if(theme === "purple"){
            gColors = purpleTheme.colors;
            gStyles = purpleTheme.styles;
        }
        eventApp.emit("theme-change");
    }

    getCurrentTheme(){
        return this.theme;
    }

}

export let theme = new Theme();
