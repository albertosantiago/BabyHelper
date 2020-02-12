import {Image, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import BaseComponent from '../BaseComponent.js';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux'
import {profileManager} from '../ProfileManager';

export default class CustomNavBar extends BaseComponent {

    constructor(){
        super();
        this.state = {
            fontLoaded: false,
            isMenuVisible: false,
            profile: null
        };
        this.showMenu = this.showMenu.bind(this);
        this.hideMenu = this.hideMenu.bind(this);
        this.goAddBaby = this.goAddBaby.bind(this);
        this.goProfile = this.goProfile.bind(this);
    }

    async componentDidMount() {
        var profile = await profileManager.getProfile();
        this.setState({profile: profile});
    }

  _renderLeft() {
    return (
      <View style={this.theme.styles.home_nav_bar_item}>
        <View style={this.theme.styles.home_nav_bar_image_container}>
            <Image
                style={this.theme.styles.home_nav_bar_image}
                resizeMode="contain"
                source={require("../../assets/if_kid_1930420.png")}></Image>
        </View>
        <Text style={[this.theme.styles.home_nav_bar_title,{ fontFamily:'Chewy-Regular'}]}>
            { this.props.title }
        </Text>
      </View>
    )
  }

  _renderSidebar(){

      var picture = <Image
          style={this.theme.styles.home_sidebar_picture}
          resizeMode="contain"
          source={require("../../assets/if_Face_blonde_2099205.png")}
      />;
      var profileName = '';

      if(this.state.profile!==null){
          if((this.state.profile.picture!==undefined)&&(this.state.profile.picture!==null)&&(this.state.profile.picture.path!==null)){
              picture = <Image source={{uri: this.state.profile.picture.path }} style={this.theme.styles.home_sidebar_picture} />;
          }
          if(this.state.profile.name!==null){
            profileName = this.state.profileName;
          }
      }

      return (
          <Modal
              isVisible={this.state.isMenuVisible}
              animationIn={'slideInLeft'}
              animationOut={'slideOutLeft'}
              onBackdropPress={this.hideMenu}
              style={this.theme.styles.home_sidebar_container}
              >
                <View style={this.theme.styles.home_sidebar}>
                    <View style={this.theme.styles.home_sidebar_picture_container}>
                        <View style={this.theme.styles.home_sidebar_picture_wrapper}>
                            {picture}
                        </View>
                    </View>
                    <Button
                        style={this.theme.styles.home_sidebar_button}
                        styleDisabled={{color: 'grey'}}
                        onPress={() => this.goProfile()}>
                            Mi cuenta
                    </Button>
                    <Button
                          style={[this.theme.styles.home_sidebar_button]}
                          styleDisabled={{color: 'grey'}}
                          onPress={() => this.goAddBaby()}>
                            Añadir Bebe
                    </Button>
                    {((this.state.profile=== null)||(!this.state.profile.confirmed))
                        &&
                        <Button
                            style={[this.theme.styles.home_sidebar_button, {borderBottomWidth:1}]}
                            styleDisabled={{color: 'grey'}}
                            onPress={() => this.goLogin()}>
                                Registro / Login
                        </Button>
                    }
                    <TouchableOpacity onPress={this.hideMenu} style={this.theme.styles.home_nav_bar_button_container}>
                      <View style={this.theme.styles.home_nav_bar_button}>
                          <Icon name="md-close-circle" size={54} color="black" />
                      </View>
                    </TouchableOpacity>
                </View>
          </Modal>
      );
  }

  _renderRight() {
    return (
      <View style={[this.theme.styles.home_nav_bar_item, { flexDirection: 'row', justifyContent: 'flex-end' }]}>
        <TouchableOpacity
          onPress={() => this.showMenu()}
          style={{ paddingRight: 10, paddingTop:10}}>
              <Icon name="md-menu" size={41} color="white" />
        </TouchableOpacity>
      </View>

    )
  }

  render() {
      return (
        <View style={[this.theme.styles.home_nav_bar_root]}>
            <View style={this.theme.styles.home_nav_bar_container}>
            { this._renderLeft() }
            { this._renderRight() }
            {this._renderSidebar()}
            </View>
        </View>
    )
  }

  showMenu(){
      this.setState({isMenuVisible: true});
  }

  hideMenu(){
      this.setState({isMenuVisible: false});
  }

  goAddBaby(){
      Actions.babyForm();
      this.hideMenu();
  }

  goSecureData(){
      Actions.secureDataForm();
      this.hideMenu();
  }

  goProfile(){
      if(profileManager.isLogged()){
          Actions.loggedAccountTabs();
      }else{
          Actions.nonLoggedAccountTabs();
      }
      this.hideMenu();
  }

  goLogin(){
      Actions.login();
      this.hideMenu();
  }

}
