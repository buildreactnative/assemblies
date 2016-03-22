import Icon                       from 'react-native-vector-icons/Ionicons';
import NavigationBar              from 'react-native-navbar';
import Progress                   from 'react-native-progress';
import _                          from 'underscore';
import Colors                     from '../styles/colors';
import Globals                    from '../styles/globals';
import {GooglePlacesAutocomplete} from '../third_party/google_places/autocomplete';
import {autocompleteStyles}       from '../utilities/style_utilities'
import {DEV}                      from '../utilities/fixtures';
import ErrorMessage               from '../ui_helpers/error_message';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export default class Register extends Component{
  constructor(props){
    super(props);
    this.state = {
      email           : '',
      emailError      : '',
      password        : '',
      passwordError   : '',
      firstName       : '',
      firstNameError  : '',
      lastName        : '',
      lastNameError   : '',
      locationError   : '',
      formError       : '',
      location        : null,
      progress        : 0,
      height          : deviceHeight,
    }
  }
  inputFocused (refName) {
    setTimeout(() => {
      let scrollView = this.refs.scrollView.getScrollResponder();
      let scrollResponder = scrollView.getScrollRef();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(this.refs[refName]),
        110, //additionalOffset
        true
      );
    }, 50);
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
  focusLocation(){
    this.refs.scrollView.scrollTo(100);
  }
  inputFocused(refName) {
    setTimeout(() => {
      let scrollResponder = this.refs.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        React.findNodeHandle(this.refs[refName]), 110, true
      )
    }, 50)
  }
  _testErrors(){
    let {location, email, password, firstName, lastName} = this.state;
    if (!! location &&
        email != '' &&
        password != '' &&
        firstName != '' &&
        lastName != ''
    ) {
      this.setState({formError: ''})
    }
  }
  _animateProgress(){
    let {progress} = this.state;
    let newProgress = progress + 0.2;
    if (newProgress > 1){
      newProgress = 1;
    }
    this.setState({progress: newProgress});
  }
  render(){
    let titleConfig = {title: 'Create Account', tintColor: 'white'}
    let leftButtonConfig = this._renderBackButton();
    return (
      <View style={styles.container}>
        <NavigationBar
          ref="navbar"
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
          style={[styles.formContainer, {height: this.state.height}]}
          ref="scrollView"
          keyboardDismissMode="interactive">
          <TouchableOpacity onPress={()=>{
            this.props.navigator.push({
              name: 'Login'
            });
          }}>
            <Text style={styles.h5}>
              Already have an account? <Text style={styles.technologyList}>Login</Text>
            </Text>
          </TouchableOpacity>
          <Text style={styles.h4}>{"* Where are you looking for assemblies?"}</Text>
          <View style={styles.pb}>
            <ErrorMessage error={this.state.locationError}/>
          </View>
          <View ref="location" style={{flex: 1,}}>
            <GooglePlacesAutocomplete
              styles={autocompleteStyles}
              placeholder='Your city'
              minLength={2} // minimum length of text to search
              autoFocus={false}
              onFocus={()=>this.focusLocation()}
              fetchDetails={true}
              onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                if (DEV) {console.log(data);}
                if (DEV) {console.log(details);}
                this.setState({
                  locationError: '',
                  location: _.extend({}, details.geometry.location, {
                    city: _.find(details.address_components, (c) => c.types[0] == 'locality'),
                    state: _.find(details.address_components, (c) => c.types[0] == 'administrative_area_level_1'),
                    county: _.find(details.address_components, (c) => c.types[0] == 'administrative_area_level_2'),
                    formattedAddress: details.formatted_address,
                  })
                }, ()=> this._testErrors());
                this.refs.emailField.focus();
                this._animateProgress();
                console.log('LOCATION', this.state.location);
              }}
              getDefaultValue={() => {return '';}}
              query={{
                key       : 'AIzaSyC40fZge0C6WnKBE-39gkM4-Ze2mXCMLVc',
                language  : 'en', // language of the results
                types     : '(cities)', // default: 'geocode'
              }}
              currentLocation={false}
              currentLocationLabel="Current location"
              nearbyPlacesAPI='GooglePlacesSearch'
              GoogleReverseGeocodingQuery={{}}
              GooglePlacesSearchQuery={{
                rankby: 'distance',
              }}
              filterReverseGeocodingByTypes={['street_address']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
              predefinedPlaces={[]}>
            </GooglePlacesAutocomplete>
          </View>
          <Text style={styles.h4}>* Email</Text>
          <View style={{paddingBottom: 10}}>
            <ErrorMessage error={this.state.emailError}/>
          </View>
          <View ref="email" style={styles.formField}>
            <TextInput
              ref="emailField"
              returnKeyType="next"
              onSubmitEditing={()=>{
                this.refs.passwordField.focus();
                this._animateProgress();
              }}
              onFocus={this.inputFocused.bind(this, 'email')}
              onChangeText={(text)=> this.setState({email: text, emailError: ''}, ()=>this._testErrors())}
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={144}
              placeholderTextColor='#bbb' style={styles.input} placeholder="Your email address"/>
          </View>
          <Text style={styles.h4}>* Password</Text>
          <View style={styles.pb}>
            <ErrorMessage error={this.state.passwordError}/>
          </View>
          <View style={styles.formField} ref="password">
            <TextInput
              ref="passwordField"
              returnKeyType="next"
              onSubmitEditing={()=>{
                this.refs.firstNameField.focus();
                this._animateProgress();
              }}
              onFocus={this.inputFocused.bind(this, "password")}
              onChangeText={(text)=> this.setState({password: text, passwordError: ''}, ()=> this._testErrors())}
              secureTextEntry={true}
              autoCapitalize="none"
              maxLength={20}
              placeholderTextColor='#bbb'
              style={styles.input}
              placeholder="Your password"
            />
          </View>
          <Text style={styles.h4}>* First Name</Text>
          <View style={styles.pb}>
            <ErrorMessage error={this.state.firstNameError}/>
          </View>
          <View style={styles.formField} ref="firstName">
            <TextInput
              ref="firstNameField"
              returnKeyType="next"
              onSubmitEditing={() =>{
                this.refs.lastNameField.focus();
                this._animateProgress();
              }}
              onFocus={this.inputFocused.bind(this, "firstName")}
              maxLength={20}
              onChangeText={(text) => {
                this.setState({
                  firstNameError  : '',
                  firstName       : text,
                }, () => this._testErrors())
              }}
              placeholderTextColor='#bbb'
              style={styles.input}
              placeholder="Your first name"
            />
          </View>
          <Text style={styles.h4}>* Last name</Text>
          <View style={styles.pb}>
            <ErrorMessage error={this.state.lastNameError}/>
          </View>
          <View style={styles.formField} ref="lastName">
            <TextInput
              returnKeyType="next"
              maxLength={20}
              ref="lastNameField"
              onSubmitEditing={()=>{this._animateProgress();}}
              onFocus={this.inputFocused.bind(this, 'lastName')}
              onChangeText={(text) => {
                this.setState({lastName: text, lastNameError: ''},
                  this._testErrors.bind(this)
                );
              }}
              placeholderTextColor='#bbb'
              style={styles.input}
              placeholder="Your last name"
            />
          </View>
          <ErrorMessage error={this.state.formError}/>
        </ScrollView>
        <TouchableOpacity style={Globals.submitButton} onPress={()=>{
          let {emailError, passwordError, firstNameError, lastNameError, locationError, formError} = this.state;
          if (this.state.email == ''){
            emailError = 'Must enter a valid email address.'
            formError = 'Complete the form to continue.'
          }
          if (this.state.password == '' ){
            passwordError = 'Must enter a password.'
            formError = 'Complete the form to continue.'
          }
          if (this.state.firstName == ''){
            firstNameError = 'Must enter a first name.'
            formError = 'Complete the form to continue.'
          }
          if (this.state.lastName == ''){
            lastNameError = 'Must enter a last name.'
            formError = 'Complete the form to continue.'
          }
          if (! this.state.location){
            locationError = "Must select a location."
            formError = 'Complete the form to continue.'
          }
          if (formError == 'Complete the form to continue.'){
            this.setState({
              emailError      : emailError,
              passwordError   : passwordError,
              firstNameError  : firstNameError,
              lastNameError   : lastNameError,
              locationError   : locationError,
              formError       : formError,
            });
            return;
          } else {
            this.props.navigator.push({
              name      : 'RegisterConfirm',
              email     : this.state.email,
              firstName : this.state.firstName,
              lastName  : this.state.lastName,
              location  : this.state.location,
              password  : this.state.password,
            });
          }
        }}>
          <Text style={Globals.submitButtonText}>Next</Text>
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
    backgroundColor: 'transparent',
    paddingBottom: 10,
  },
  technologyList:{
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.brandPrimary,
    paddingHorizontal: 20,
    marginLeft: 8,
    paddingVertical: 4,
  },
  formContainer: {
    backgroundColor: Colors.inactive,
    flex: 1,
    paddingTop: 15,
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
  h5: {
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 5,
    textAlign: 'center',
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
  pb: {
    paddingBottom: 10,
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
