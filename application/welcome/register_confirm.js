import Colors         from '../styles/colors';
import Globals        from '../styles/globals';
import Icon           from 'react-native-vector-icons/Ionicons';
import NavigationBar  from 'react-native-navbar';
import Progress       from 'react-native-progress';
import _              from 'underscore';
import {TECHNOLOGIES, IMAGE_OPTIONS, BASE_URL, DEV, HEADERS} from '../utilities/fixtures';

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
  AsyncStorage,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicatorIOS,
  NativeModules,
  InteractionManager,
} from 'react-native';

const DEFAULT_AVATAR = 'https://confluence.slac.stanford.edu/s/en_GB/5996/4a6343ec7ed8542179d6c78fa7f87c01f81da016.20/_/images/icons/profilepics/default.png';
const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
let UIImagePickerManager = require('NativeModules').UIImagePickerManager;

export default class RegisterConfirm extends Component{
  constructor(props){
    super(props);
    this.state = {
      technologies  : [],
      avatarSource  : DEFAULT_AVATAR,
      summary       : '',
      progress      : 0,
    }
  }
  inputFocused(refName) {
    setTimeout(() => {
      let scrollResponder = this.refs.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(this.refs[refName]), 110, true
      )
    }, 50)
  }
  _animateProgress(){
    let {progress} = this.state;
    let newProgress = progress + 0.2;
    if (newProgress > 1){
      newProgress = 1;
    }
    this.setState({progress: newProgress});
  }
  _getOptionList(){
    return this.refs['OPTIONLIST']
  }
  _technologies(tech){
    this.setState({
      technologies: this.state.technologies.concat(tech),
    });
    this.setState({progress: 0.33});
  }
  _renderBackButton(){
    return (
      <TouchableOpacity style={Globals.backButton} onPress={()=>{
        this.props.navigator.pop();
      }}>
        <Icon name="ios-arrow-back" size={25} color="#ccc" />
      </TouchableOpacity>
    )
  }
  _changeTechnologies(idx){
    this.setState({
      technologies: [
      ...this.state.technologies.slice(0, idx),
      ...this.state.technologies.slice(idx+1)]
    });
  }
  _renderTechnologies(){
    return (
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10}}>
        {this.state.technologies.map((technology, idx) => {
          return (
            <TouchableOpacity key={idx} style={styles.techContainer} onPress={this._changeTechnologies.bind(this, idx)}>
              <Text style={styles.technologyList}>{technology}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    )
  }
  showImagePicker(){
    UIImagePickerManager.showImagePicker(IMAGE_OPTIONS, (response) => {
      if (DEV) {console.log('Response = ', response);}

      if (response.didCancel) {
        if (DEV) {console.log('User cancelled image picker');}
      }
      else if (response.error) {
        if (DEV) {console.log('UIImagePickerManager Error: ', response.error);}
      }
      else if (response.customButton) {
        if (DEV) {console.log('User tapped custom button: ', response.customButton);}
      }
      else {
        const source = 'data:image/png;base64,' + response.data;
        if (DEV) {console.log('SRC', source);}
        this.setState({
          avatarSource    : source,
          progress        : 1,
        });
      }
    });
  }
  _registerUser(){
    let {avatarSource, technologies, summary,} = this.state;
    let {firstName, lastName, email, password, location,} = this.props;
    let userParams = {
      location          : location || {},
      firstName         : firstName,
      lastName          : lastName,
      username          : email,
      avatarUrl         : avatarSource,
      technologies      : technologies,
      password          : password,
      groupIds          : [],
      eventIds          : [],
      messageIds        : [],
      suggestedEventIds : [],
      summary           : summary,
      sendingData       : false,
    };
    if (DEV) {console.log('USER PARAMS', userParams);}
    fetch(`${BASE_URL}/users`, {
      method    : "POST",
      headers   : HEADERS,
      body      : JSON.stringify(userParams)
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.errors) {
        if (DEV) {console.log(data.errors);}
        this.setState({sendingData: false});
      } else {
        if (DEV) {console.log('DATA', data);}
        let user = {username: email, password: password};
        fetch(`${BASE_URL}/users/login`, {
          method    : "POST",
          headers   : HEADERS,
          body      : JSON.stringify(user)
        })
        .then((response) => response.json())
        .then((data) => {
          if (data.errors || data.status == 401) {
            if (DEV) {console.log(data.errors);}
            errors = 'Login failed'
            this.setState({sendingData: false});
          }
          else {
            if (DEV) {console.log('DATA', data);}
            AsyncStorage.setItem('USER_PARAMS', JSON.stringify(user));
            fetch(`${BASE_URL}/users/me`, {
              method    : "GET",
              headers   : _.extend({}, {'Set-Cookie': `sid=${data.id}`}, HEADERS),
            })
            .then((response) => response.json())
            .then((data) => {
              this.props.updateUser(data);
              this.setState({sendingData: false});
              this.props.navigator.push({
                name: 'Dashboard'
              });
            })
            .catch((error) => {
              if (DEV) {console.log(error)}
              this.setState({sendingData: false});
            })
            .done();
          }
        })
        .catch((error) => {
          if (DEV) {console.log(error)}
          this.setState({sendingData: false})
        })
        .done();
      }
    })
    .catch((error) => {
      if (DEV) {console.log(error)}
    })
    .done();
  }
  _buttonText(){
    return (
      <Text style={Globals.submitButtonText}>Create Account</Text>
    );
  }
  _sendingData(){
    return (
      <Text style={Globals.submitButtonText}>
        <ActivityIndicatorIOS style={{marginRight: 4,}}/>
        Create Account
      </Text>
    )
  }
  render(){
    let {technologies} = this.state;
    let titleConfig = {title: 'Create Account', tintColor: 'white'}
    let leftButtonConfig = this._renderBackButton();
    let techAreas = technologies.length ? this._renderTechnologies() : null;
    return (
      <View style={styles.container}>
        <NavigationBar
          statusBar={{style: 'light-content', hidden: false}}
          title={titleConfig}
          tintColor={Colors.brandPrimary}
          leftButton={leftButtonConfig}
        />
        <Progress.Bar
          borderRadius={0}
          borderWidth={0}
          color={Colors.brandPrimary}
          unfilledColor="white"
          borderColor={Colors.brandPrimary}
          progress={this.state.progress}
          width={deviceWidth} />
        <ScrollView
          ref="scrollView"
          style={styles.formContainer}>
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
              return (
                <Option style={optionStyles} styleText={optionTextStyles} key={idx}>
                  {tech}
                </Option>
              );
            })}
          </Select>

          <OptionList ref="OPTIONLIST" overlayStyles={overlayStyles}/>

          <Text style={styles.h4}>{"Tell us a little about yourself"}</Text>
          <TextInput
            ref="summary"
            maxLength={200}
            blurOnSubmit={true}
            clearButtonMode='always'
            returnKeyType="next"
            onSubmitEditing={()=>{
              this.setState({progress: 0.67})
            }}
            onFocus={this.inputFocused.bind(this, "summary")}
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
        <TouchableOpacity style={Globals.submitButton} onPress={() => {
            this.setState({sendingData: true}, this._registerUser.bind(this));
          }}>
          {this.state.sendingData ? this._sendingData() : this._buttonText()}
        </TouchableOpacity>
      </View>
    )
  }
}

let styles = StyleSheet.create({
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
    backgroundColor: 'transparent',
    color: Colors.brandPrimary,
    paddingHorizontal: 2,
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
  techContainer: {
    paddingHorizontal: 2,
    marginHorizontal: 2,
    marginVertical: 4,
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
});
