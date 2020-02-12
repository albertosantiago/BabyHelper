import Model from './Model';

export default class Child extends Model{

    constructor(props){
        super(props);
    }

    isOwner(user){
        if(this.user_id===user.id){
            return true;
        }else{
            return false;
        }
    }

}
