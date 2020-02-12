import React from 'react';
import { Text, View, Image, TouchableHighlight} from 'react-native';
import { Actions } from 'react-native-router-flux';
import BaseComponent from '../../BaseComponent.js';
import BaseItem from './BaseItem';

export default class FeedItem extends BaseComponent {

    static defaultProps = {
        withIcon: true
    }

    constructor(){
        super();
    }

    componentDidMount() {}

    render() {
        var note = this.props.note;
        var title = '';
        var feedType = '';

        if(note.feedType==='pap'){
            title = "Tomó "+note.papName;
        }else{
            if(note.feedType==='bottle'){
                feedType = "Biberón";
                title = "Toma de "+note.feedAmount+" ml";
            }else{
                feedType = "Pecho ";
                if(note.breast==="left"){
                    feedType += "izquierdo";
                }else{
                    feedType += "derecho";
                }
                title = "Toma de "+note.feedTime+" minutos";
            }
        }


        return (
                <BaseItem note={note}  onPressDelete={this.props.onPressDelete}>
                    <View style={{flexDirection:'row', paddingBottom:5}}>
                        {(this.props.withIcon) &&
                            <View>
                                <Image
                                    style={{ margin:0, width:40, height:40}}
                                    source={require("../../../assets/biberon.png")}
                                />
                            </View>
                        }
                        <View key={note.id} style={{flexDirection:"column", padding:10}}>
                            <Text style={{fontWeight:"normal", fontSize:16}}>{title}</Text>
                            <Text style={{flexWrap: 'wrap'}} >{feedType}</Text>
                        </View>
                    </View>
                </BaseItem>
        );
    }
}
