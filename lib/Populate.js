import {profileManager} from './ProfileManager';
import {kidManager} from './ProfileManager';
import {noteManager} from './NoteManager';


class Populate{

    constructor(){
        this.cont = 0;
    }

    start(){
        console.log("START POPULATE");
        let notes = noteManager.getNotes();
        console.log(notes);
        console.log("CONT", this.cont);
        while(this.cont<30){
            console.log("WHILE");
            for(let note of notes){
                console.log("FOR NOTE");
                console.log(note);
                let date = new Date();
                let month = Math.floor(Math.random()*4);
                let day   = Math.floor(Math.random()*27);
                date.setDate(day);
                date.setMonth(month);
                note.date = date;
                note.id = undefined;
                note.user_id = undefined;
                console.log(note);
                noteManager.addNote(note);
                this.cont++;
                console.log("ADDING NOTE: "+this.cont);
                if(this.cont>29){
                    break;
                }
            }
        }
    }
}

export let populate = new Populate();
