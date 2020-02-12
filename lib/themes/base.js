var React = require('react-native');
import {Dimensions, Platform} from 'react-native';

var {
  StyleSheet,
} = React;

var { height } = Dimensions.get('window');

var box_count = 3;
var box_height = height / box_count;

var exports = module.exports = {};

exports.generateStyles = function(colors){

    var styles = {
        //Estilos globales
        global_fltListItem: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: colors.white,
            alignItems: 'flex-start',
        },
        global_fltImgBox: {
            flexDirection: 'row'
        },
        global_fltDesc: {
            flexDirection: 'column'
        },
        global_primary_button:{
            padding:10,
            paddingLeft:20,
            paddingRight:20,
            margin:20,
            height:50,
            overflow:'hidden',
            borderRadius:10,
            backgroundColor: colors.primary,
        },
        global_primary_button_text:{
            fontSize: 20,
            color: "#fff",
            textAlign:"center",
            fontWeight:"bold"
        },
        global_default_button:{
            padding:10,
            paddingLeft:20,
            paddingRight:20,
            margin:20,
            height:50,
            overflow:'hidden',
            backgroundColor: "#e0e1e2",
            borderRadius:10
        },
        global_default_button_text:{
            fontSize: 16,
            color: "rgba(0,0,0,.6)",
            textAlign:"center",
            fontWeight:"bold"
        },
        global_success_button:{
            padding:10,
            paddingLeft:20,
            paddingRight:20,
            margin:20,
            height:50,
            overflow:'hidden',
            backgroundColor: "#16ab39",
            borderRadius:10
        },
        global_success_button_text:{
            fontSize: 20,
            color: "#fff",
            textAlign:"center",
            fontWeight:"bold"
        },
        global_danger_button:{
            padding:10,
            paddingLeft:20,
            paddingRight:20,
            margin:20,
            height:50,
            overflow:'hidden',
            backgroundColor: "#D01919",
            borderRadius:10
        },
        global_danger_button_text:{
            fontSize: 20,
            color: "#fff",
            textAlign:"center",
            fontWeight:"bold"
        },
        global_default_navbar:{
            backgroundColor: colors.primary,
            color: colors.white
        },
        global_default_navbar_text:{
            color: colors.white,
            tintColor: colors.white
        },
        //Modal Menu
        modal_menu_item:{
            padding:12,
            paddingLeft:20,
            paddingRight:20,
            margin:0,
            overflow:'hidden',
            backgroundColor: "#fff",
            borderRadius:0,
            borderTopWidth:1,
            borderColor: "#ddd"
        },
        modal_menu_item_text:{
            fontSize: 20,
            color: "rgba(0,0,0,.6)",
            textAlign:"center",
        },
        //NavBar
        nav_bar_root : {
            height: (Platform.OS === 'ios') ? 92 : 55,
            flexDirection: 'column',
        },
        nav_bar_container: {
            height: (Platform.OS === 'ios') ? 72 : 55,
            flexDirection: 'row',
            marginTop:0,
            paddingTop:0,
            backgroundColor: colors.primary
        },
        nav_bar_item: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start'
        },
        nav_bar_image_container:{
            borderWidth:3,
            borderColor:colors.white,
            alignItems:'center',
            justifyContent:'center',
            width:60,
            height:60,
            backgroundColor:colors.white,
            borderRadius: 35,
            margin: 10,
            marginBottom: 0
        },
        nav_bar_image:{
            width: 55,
            height: 55,
            marginLeft:0
        },
        nav_bar_title: {
            fontSize:37,
            color:colors.white,
            marginTop:16,
            marginLeft:10,
        },
        nav_bar_button: {
            padding: 12,
            margin: 20,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
            borderColor: 'rgba(0, 0, 0, 0.5)'
        },
        nav_bar_button_container:{
            position:"absolute",
            bottom:10,
            left:70
        },
        //NAVBAR HOME
        home_nav_bar_root : {
            height: (Platform.OS === 'ios') ? 92 : 82,
            flexDirection: 'column',
        },
        home_nav_bar_container: {
            height: (Platform.OS === 'ios') ? 72 : 82,
            flexDirection: 'row',
            marginTop:0,
            paddingTop:0,
            backgroundColor: colors.primary
        },
        home_nav_bar_item: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start'
        },
        home_nav_bar_image_container:{
            borderWidth:3,
            borderColor:colors.white,
            alignItems:'center',
            justifyContent:'center',
            width:60,
            height:60,
            backgroundColor:colors.white,
            borderRadius: 35,
            margin: 10,
            marginBottom: 0
        },
        home_nav_bar_image:{
            width: 55,
            height: 55,
            marginLeft:0
        },
        home_nav_bar_title: {
            fontSize:32,
            color:colors.white,
            marginTop:16,
            marginLeft:10,
        },
        home_nav_bar_button: {
            padding: 12,
            margin: 20,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
            borderColor: 'rgba(0, 0, 0, 0.5)'
        },
        home_nav_bar_button_container:{
            position:"absolute",
            bottom:10,
            left:70
        },
        home_sidebar_container:{
            marginLeft:0,
            flex:0,
            width:250,
            marginTop:0,
            marginBottom:0,
            padding:0,
            position: "absolute",
            top:0,
            left:0,
        },
        home_sidebar:{
            backgroundColor: colors.white,
            padding: 0,
            margin: 0,
            flexDirection: 'column',
            borderRadius: 0,
            borderColor: 'rgba(0, 0, 0, 1)',
            height:Dimensions.get('window').height
        },
        home_sidebar_picture:{
            margin:0,
            marginTop:0,
            width: 120,
            height: 120,
            borderRadius: 75,
            borderWidth: 5,
        },
        home_sidebar_picture_wrapper: {
            borderWidth:5,
            borderColor:colors.primary,
            alignItems:'center',
            justifyContent:'center',
            width:150,
            height:150,
            borderRadius:75,
            backgroundColor:colors.white,
        },
        home_sidebar_picture_container:{
            alignItems:'center',
            backgroundColor: colors.primary,
            paddingTop:10,
            paddingBottom:10,
        },

        home_sidebar_button:{
            fontSize: 18,
            color: "#666",
            padding:12,
            backgroundColor: colors.white,
            borderTopWidth:1,
            borderColor: "#DDD",
            borderRightWidth:1,
        },
        //HOME
        home_container: {
            flex: 1,
            backgroundColor: colors.white,
            alignItems: 'center',
        },
        home_title:{
            margin:8,
            marginTop:0,
            fontSize:24,
            fontWeight: 'bold',
            color: "#333"
        },
        home_image:{
            width: 140,
            height: 140,
            borderRadius:70,

        },
        home_image_container:{
            borderWidth:0,
            borderColor:"#e0e1e2",
            alignItems:'center',
            justifyContent:'center',
            width:150,
            height:150,
            backgroundColor:colors.white,
            borderRadius: 75,
            margin: 10,
            marginTop:20,
            marginBottom: 0,
            borderWidth:10,
            borderColor:"#eee"
        },
        home_flatListItem: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: colors.white,
            alignItems: 'flex-start',
        },
        home_fltImgBox: {
            flexDirection: 'row'
        },
        home_fltDesc: {
            flexDirection: 'column'
        },
        home_fltButtons: {
            flexDirection: 'row'
        },
        home_buttonsContainer: {
            marginTop: 0,
            alignItems: 'center',
            flexDirection: "row",
            justifyContent: 'space-between'
        },
        //TaskList
        task_list_cell: {
            padding: 10,
            marginBottom: 0,
            marginTop: 5,
            marginHorizontal: 10,
            flexDirection: 'row',
            backgroundColor:"#fff",
            borderColor: "#ddd",
            borderWidth: 0,
            borderBottomWidth: 1,
        },
        task_list_name: {
            color: "#333",
            fontSize: 18,
            textAlign: 'center',
            margin: 10,
        },
        task_list_container: {
            paddingTop:15,
            backgroundColor: colors.white,
            height:"100%"
        },
        //ProfileForm
        /**
            NADA
        **/
        //Componente Note List
        note_list_container:{
            paddingTop:30,
            backgroundColor: colors.white,
            height:"100%"
        },
        note_list_cell: {
            padding: 10,
            margin: 10,
            borderRadius:10,
            flexDirection: 'row',
            backgroundColor:"#fff",
            borderColor: "#ddd",
            borderWidth: 0,
            borderBottomWidth: 1,
        },
        note_list_modal_content: {
            backgroundColor: colors.white,
            padding: 22,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
            borderColor: 'rgba(0, 0, 0, 0.1)',
        },
        note_list_empty_container: {
            alignItems:"center",
            justifyContent:"center"
        },
        note_list_empty_text_container: {
            backgroundColor:"#fff",
            width:"80%",
            flexDirection:"column",
            alignItems:"center",
            padding:20,
            marginTop:60
        },
        note_list_empty_text: {
            fontSize:18
        },
        //Medicines Form.
        medicine_form_options: {
            backgroundColor: colors.white,
            padding: 0,
            overflow: "hidden",
            borderRadius: 15,
            borderColor: 'rgba(0, 0, 0, 0.1)',
        }
    };
    var formStyles = generateFormStyles(colors);
    styles = Object.assign(styles, formStyles);
    return StyleSheet.create(styles);
}

function generateFormStyles(colors){
    var styles = {
        form_modal_content: {
            backgroundColor: colors.white,
            padding: 22,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4,
            borderColor: 'rgba(0, 0, 0, 0.1)',
        },
        form_container: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent:'center',
            backgroundColor: colors.white
        },
        form_cell:{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent:'center',
            padding:7
        },
        form_checkbox:{
            paddingLeft: "25%",
            marginTop:20,
            marginBottom:20
        },
        form_checkbox_text:{
            fontSize:24,
            fontWeight:"normal",
            color:colors.black
        },
        form_comic_picture:{
            width: 110,
            height: 110,
        },
        form_picture:{
            width: 150,
            height: 150,
            borderRadius:75,
        },
        form_picture_container:{
            borderWidth:5,
            borderColor:colors.primary,
            alignItems:'center',
            justifyContent:'center',
            width:150,
            height:150,
            backgroundColor:colors.white,
            borderRadius: 75,
            margin: 10,
            marginTop:20,
            marginBottom: 0
        },
        form_picture_button:{
            margin:0,
            marginBottom:5,
            marginRight:6,
            paddingTop:7,
            paddingLeft:10,
            backgroundColor:colors.primary,
            width:56,
            height:56,
            borderRadius:28
        },
        form_label:{
            fontWeight: 'bold',
            color:colors.black,
            fontSize:18,
            marginTop:5
        },
        form_input:{
            width: 250,
            height:50,
            backgroundColor:colors.white,
            margin:5,
            padding:5,
            fontSize:16,
            borderWidth:1,
            borderColor:"#DDD",
            borderRadius: 10,
        },
        form_picker_container:{
            width:200,
            height:50,
            borderWidth:1,
            borderColor:"#ddd",
            backgroundColor:colors.white,
            borderRadius: 10,
            margin:5,
            padding:5
        },
        form_picker:{
            width:"90%",
            height:35,
            borderWidth:0,
            borderColor:colors.black,
            backgroundColor:colors.white
        },
        form_dateText: {
            width:140,
            textAlign: "center",
            fontWeight:'bold',
            color:colors.black,
            backgroundColor: colors.white,
            fontSize:16,
            marginTop:5,
            padding:7,
            paddingTop:10,
            paddingLeft:15,
            paddingRight:15,
            paddingBottom:5,
            borderWidth:1,
            borderColor:"#DDD",
            borderRadius: 10,
        },
    };
    return styles;
}
