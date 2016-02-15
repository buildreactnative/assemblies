import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import {TECHNOLOGIES} from '../utilities/fixtures';
import {
  overlayStyles,
  optionTextStyles,
  optionStyles,
  selectStyles,
} from '../utilities/style_utilities'
import DropDown, {
  Select,
  Option,
  OptionList,
} from '../select/index';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
  TabBarIOS,
  AsyncStorage,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeModules,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

var UIImagePickerManager = require('NativeModules').UIImagePickerManager;

var options = {
  title: 'Select Avatar', // specify null or empty string to remove the title
  cancelButtonTitle: 'Cancel',
  takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
  chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
  cameraType: 'back', // 'front' or 'back'
  mediaType: 'photo', // 'photo' or 'video'
  videoQuality: 'high', // 'low', 'medium', or 'high'
  maxWidth: 100, // photos only
  maxHeight: 100, // photos only
  aspectX: 2, // aspectX:aspectY, the cropping image's ratio of width to height
  aspectY: 1, // aspectX:aspectY, the cropping image's ratio of width to height
  quality: 0.2, // photos only
  angle: 0, // photos only
  allowsEditing: false, // Built in functionality to resize/reposition the image
  noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
  storageOptions: { // if this key is provided, the image will get saved in the documents/pictures directory (rather than a temporary directory)
    skipBackup: true, // image will NOT be backed up to icloud
    path: 'images' // will save image at /Documents/images rather than the root
  }
};





const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class RegisterConfirm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      technologies: [],
      avatarSource: 'https://confluence.slac.stanford.edu/s/en_GB/5996/4a6343ec7ed8542179d6c78fa7f87c01f81da016.20/_/images/icons/profilepics/default.png',
      summary: '',
    }
  }
  _getOptionList(){
    return this.refs['OPTIONLIST']
  }
  _technologies(tech){
    this.setState({
      technologies: this.state.technologies.concat(tech)
    })
  }
  _renderBackButton(){
    return (
      <TouchableOpacity style={styles.backButton} onPress={()=>{
        this.props.navigator.pop();
      }}>
        <Icon name="ios-arrow-back" size={25} color="#ccc" />
      </TouchableOpacity>
    )
  }
  _renderTechnologies(){
    return (
      <Text style={styles.technologyList}>{this.state.technologies.join(', ')}</Text>
    )
  }
  showImagePicker(){
    UIImagePickerManager.showImagePicker(options, (response) => {
    console.log('Response = ', response);

    if (response.didCancel) {
      console.log('User cancelled image picker');
    }
    else if (response.error) {
      console.log('UIImagePickerManager Error: ', response.error);
    }
    else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    }
    else {
      // You can display the image using either data:
      // const source = 'data:image/jpeg;base64,' + response.data;

      // uri (on iOS)
      // const source = {uri: response.uri.replace('file://', ''), isStatic: true};
      // uri (on android)
      const source = response.uri;

      this.setState({
        avatarSource: source
      });
    }
  });
  }
  render(){
    let {technologies} = this.state;
    let titleConfig = {title: 'Create Account', tintColor: 'white'}
    let leftButtonConfig = this._renderBackButton();
    let techAreas = technologies.length ? this._renderTechnologies() : null;
    return (
      <View style={styles.container}>
        <NavigationBar
          title={titleConfig}
          tintColor={Colors.brandPrimary}
          leftButton={leftButtonConfig}
        />
        <ScrollView style={styles.formContainer}>
          <Text style={styles.h4}>{"My technologies"}</Text>
          {techAreas}
          <Select
            width={deviceWidth}
            height={55}
            ref="SELECT1"
            styleText={optionTextStyles}
            style={selectStyles}
            optionListRef={this._getOptionList.bind(this)}
            defaultValue="Add a technology"
            onSelect={this._technologies.bind(this)}>
            {TECHNOLOGIES.map((tech, idx) => {
              return <Option style={optionStyles} styleText={optionTextStyles} key={idx}>{tech}</Option>
            })}
          </Select>

          <OptionList ref="OPTIONLIST" overlayStyles={overlayStyles}/>

          <Text style={styles.h4}>{"Tell us a little about yourself"}</Text>
          <TextInput
            placeholderTextColor='#bbb'
            style={styles.largeInput}
            multiline={true}
            onChangeText={(text)=> this.setState({summary: text})}
            placeholder="Short personal summary..."/>

          <TouchableOpacity style={styles.addPhotoContainer} onPress={this.showImagePicker.bind(this)}>
            <Icon name="camera" size={30} color={Colors.brandPrimary}/>
            <Text style={styles.photoText}>Add a Profile Photo</Text>
          </TouchableOpacity>
          <View style={{height: 120, alignItems: 'center'}}>
            <Image source={{uri: this.state.avatarSource}} style={styles.avatar}/>
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.submitButton} onPress={()=> {
          let {avatarSource, technologies, summary,} = this.state;
          let {firstName, lastName, email, password, location,} = this.props;
          let user = {
            location: location,
            firstName: firstName,
            lastName: lastName,
            username: email,
            avatarUrl: avatarSource,
            technologies: technologies,
            password: password,
            groupIds: [],
            eventIds: [],
            messageIds: [],
            suggestedEventIds: [],
            summary: summary,
          }
          console.log('USER PARAMS', user);
          fetch("http://localhost:2403/users", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
          })
          .then((response) => response.json())
          .then((data) => {
              if (data.errors) {
                console.log(data.errors);
              }
              else {
                console.log('DATA', data);
                let user = {username: email, password: password};
                fetch("http://localhost:2403/users/login", {
                  method: "POST",
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(user)
                })
                .then((response) => response.json())
                .then((data) => {
                  if (data.errors || data.status == 401) {
                    console.log(data.errors);
                    errors = 'Login failed'
                  }
                  else {
                    console.log('DATA', data);
                    AsyncStorage.setItem('sid', data.id)
                    this.props.navigator.push({
                      name: 'Dashboard'
                    })
                  }
                })
                .catch((error) => console.log(error))
                .done();
              }
          })
          .catch((error) => console.log(error))
          .done();

        }}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

let styles = {
  container: {
    flex: 1,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 20,
  },
  technologyList:{
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.brandPrimary,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  backButton: {
    paddingLeft: 20,
    backgroundColor: 'transparent',
    paddingBottom: 10,
  },
  formContainer: {
    backgroundColor: Colors.inactive,
    flex: 1,
    paddingTop: 15,
  },
  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brandPrimary,
    height: 80,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: '400'
  },
  h4: {
    fontSize: 20,
    fontWeight: '300',
    marginTop: 15,
    color: 'black',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  formField: {
    backgroundColor: 'white',
    height: 50,
    paddingTop: 5,
    marginBottom: 10,
  },
  largeFormField: {
    backgroundColor: 'white',
    height: 100,
  },
  addPhotoContainer: {
    backgroundColor: 'white',
    marginVertical: 15,
    marginHorizontal: (deviceWidth - 250) / 2,
    width: 250,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    fontSize: 18,
    paddingHorizontal: 10,
    color: Colors.brandPrimary
  },
  input: {
    color: '#ccc',
    fontSize: 18,
    fontWeight: '300',
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  largeInput: {
    color: '#777',
    fontSize: 18,
    backgroundColor: 'white',
    fontWeight: '300',
    height: 100,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  formField:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: 'white',
    marginVertical: 25,
  },
  formName:{
    fontWeight: '300',
    fontSize: 20,
  },
}

module.exports = RegisterConfirm
