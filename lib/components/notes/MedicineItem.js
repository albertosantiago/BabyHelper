import React from 'react';
import { Text, View, Image,TouchableHighlight} from 'react-native';
import BaseComponent from '../../BaseComponent.js';
import BaseItem from './BaseItem';

export default class MedicineItem extends BaseComponent {

    static defaultProps = {
        withIcon: true
    }

    constructor(){
        super();
    }

    componentDidMount() {}

    render() {
        let note     = this.props.note;
        let medicine = this.ucwords(note.medicineName);

        return (
                <BaseItem note={note}  onPressDelete={this.props.onPressDelete}>
                    <View style={{flexDirection:'row', paddingBottom:5}}>
                        {(this.props.withIcon) &&
                            <View>
                                <Image
                                    style={{ margin:0, width:40, height:40}}
                                    source={require("../../../assets/medicinas.png")}
                                />
                            </View>
                        }
                        <View style={{flexDirection:"column", padding:10, flex:1}}>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{fontWeight:"normal", fontSize:16}}>Recibió </Text>
                                <Text style={{fontWeight:"normal", fontSize:16}}>{medicine}</Text>
                            </View>
                            <Text style={{flexWrap: 'wrap'}} >{note.text}</Text>
                        </View>
                    </View>
                </BaseItem>
        );
    }

    ucwords(str) {
      return (str + '')
        .replace(/^(.)|\s+(.)/g, function ($1) {
          return $1.toUpperCase()
        })
    }
}
