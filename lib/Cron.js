import {eventApp} from "./EventApp.js";

class Cron{

    constructor(){
        this.paused     = false;
        this.timerId    = null;
        this.iterations = 1;
        this.stack = [];
    }

    pause(){
        clearTimeout(this.timerId);
        this.paused = true;
    }

    resume(){
        this.paused  = false;
        this.started = false;
        this.exec();
    }

    async start(){
        eventApp.addListener('app-foreground', ()=>{
            this.resume();
        });
        eventApp.addListener('app-background', ()=>{
            this.pause();
        });
        this.exec();
    }

    async exec(){
        if(this.started){
            return;
        }
        this.started = true;
        for(let item of this.stack){
            try{
                if((this.iterations%item.iterations)===0){
                    item.func();
                }
            }catch(e){
                console.log("CRON EXEC ERROR");
                console.log(e);
                continue;
            }
        }
        this.iterations++;
        if(this.paused){
            return;
        }
        this.started = false;
        this.timerId = setTimeout(() => {
            this.exec();
        }, 1000);
    }

    register(func, iterations, key){
        let aux = [];
        for(let item of this.stack){
            if(item.key!==key){
                aux.push(item);
            }
        }
        aux.push({
            func, iterations, key
        });
        this.stack = aux;
    }

    unregister(key){
        let aux = [];
        for(let item of this.stack){
            if(item.key!==key){
                aux.push(item);
            }
        }
        this.stack = aux;
    }
}

export let cron = new Cron();
