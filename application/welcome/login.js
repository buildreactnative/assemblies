import Colors from '../styles/colors';
import Globals from '../styles/globals';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import _ from 'underscore';
import ErrorMessage from '../ui_helpers/error_message';
import {BASE_URL, DEV, HEADERS} from '../utilities/fixtures';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  AsyncStorage,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicatorIOS,
  Dimensions,
  InteractionManager,
} from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export default class Login extends Component{
  constructor(props){
    super(props);
    this.state = {
      email           : '',
      password        : '',
      connectionError : '',
      sendingData     : false,
    };
  }
  inputFocused(refName) {
    setTimeout(() => {
      let scrollResponder = this.refs.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(this.refs[refName]), 110, true
      )
    }, 50);
  }
  _renderBackButton(){
    return (
      <TouchableOpacity style={Globals.backButton} onPress={()=>{
        this.props.navigator.pop();
      }}>
        <Icon name="ios-arrow-back" size={25} color="#ccc"/>
      </TouchableOpacity>
    )
  }
  _loginUser(){
    let {email, password,} = this.state;
    let user = {username: email, password: password};
    let errors = null;
    if (DEV) {console.log("LOGIN", `${BASE_URL}/users/login`)}
    fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(user)
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.errors || data.status == 401) {
        if (DEV) {console.log('LOGIN FAILED', data);}
        this.setState({connectionError: 'Email or password was incorrect.'})
      } else {
        if (DEV) {console.log('DATA', data);}
        AsyncStorage.setItem('USER_PARAMS', JSON.stringify(user));
        fetch(`${BASE_URL}/users/me`, {
          method: "GET",
          headers: _.extend({'Set-Cookie': `sid=${data.id}`}, HEADERS),
        })
        .then((response) => response.json())
        .then((data) => {
          this.props.updateUser(data);
          this.props.navigator.push({
            name: 'Dashboard'
          });
        })
        .catch((error) => {
          if (DEV) {console.log(error)}
          this.setState({connectionError: 'Connection error.'})
        })
        .done();
      }
    })
    .catch((error) => {
      if (DEV) {console.log(error)}
      this.setState({connectionError: 'Email or password was incorrect.'})
    })
    .done();
  }
  render(){
    let titleConfig = {title: 'Login', tintColor: 'white'}
    let leftButtonConfig = this._renderBackButton();
    return (
      <View style={styles.container}>
        <NavigationBar
          statusBar={{style: 'light-content', hidden: false}}
          title={titleConfig}
          tintColor={Colors.brandPrimary}
          leftButton={leftButtonConfig}
        />
        <ScrollView
          ref="scrollView"
          keyboardDismissMode="interactive"
          contentContainerStyle={styles.contentContainerStyle}
          style={styles.formContainer}>
          <Text style={styles.h4}>{"Login with your email and password."}</Text>
          <Text style={styles.h4}>Email</Text>
          <View style={styles.formField} ref="email">
            <TextInput
              ref="email"
              autoFocus={true}
              returnKeyType="next"
              onFocus={this.inputFocused.bind(this, "email")}
              onSubmitEditing={()=>{
                this.refs.passwordField.focus();
              }}
              onChangeText={(text)=> this.setState({email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={140}
              placeholderTextColor='#bbb' style={styles.input} placeholder="Your email address"
            />
          </View>
          <Text style={styles.h4}>Password</Text>
          <View style={styles.formField} ref="password">
            <TextInput
              ref="passwordField"
              returnKeyType="next"
              onFocus={this.inputFocused.bind(this, "password")}
              onChangeText={(text)=> this.setState({password: text})}
              secureTextEntry={true}
              autoCapitalize="none"
              maxLength={140}
              placeholderTextColor='#bbb' style={styles.input} placeholder="Your password"
            />
          </View>
          <View style={styles.error}>
            <ErrorMessage error={this.state.connectionError}/>
          </View>
        </ScrollView>
        <TouchableOpacity style={Globals.submitButton} onPress={this._loginUser.bind(this)}>
          <Text style={Globals.submitButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'transparent',
    paddingBottom: 20,
    paddingTop: 0,
    width: 50,
    height: 50,
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
  error: {
    backgroundColor: Colors.inactive,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: '400'
  },
  contentContainerStyle: {
    flex: 1,
  },
  h4: {
    fontSize: 20,
    fontWeight: '300',
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
    marginHorizontal: (deviceWidth - 200) / 2,
    width: 200,
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
    color: '#777',
    fontSize: 18,
    fontWeight: '300',
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  largeInput: {
    color: '#ccc',
    fontSize: 18,
    backgroundColor: 'white',
    fontWeight: '300',
    height: 100,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
});
