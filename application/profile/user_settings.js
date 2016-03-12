import Colors from '../styles/colors';
import Globals from '../styles/globals';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import {GooglePlacesAutocomplete} from '../third_party/google_places/autocomplete';
import _ from 'underscore';
import {autocompleteStyles} from '../utilities/style_utilities'
import {BASE_URL, DEV} from '../utilities/fixtures';
import ErrorMessage from '../ui_helpers/error_message';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
  TabBarIOS,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeModules,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class UserSettings extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      locationError: '',
      firstNameError: '',
      lastNameError: '',
      summaryError: '',
      formError: '',
      summary: props.currentUser.summary,
      firstName: props.currentUser.firstName,
      lastName: props.currentUser.lastName,
      location: props.currentUser.location,
    }
  }
  inputFocused (refName) {
    setTimeout(() => {
      let scrollResponder = this.refs.scrollView.getScrollResponder();
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
  _updateUser(user){
    let {currentUser} = this.props;
    fetch(`${BASE_URL}/users/${currentUser.id}`, {
      method: "PUT",
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
    })
    .then((response) => response.json())
    .then((data) => {
      if (DEV) {console.log('UPDATED USER', data);}
      this.props.changeProfile(data);
      this.props.navigator.pop();
    })
    .catch((error) => {
      if (DEV) {console.log(error)}
    })
    .done();
  }
  _testErrors(){
    let {location, summary, firstName, lastName} = this.state;
    if (!! location &&
        summary != '' &&
        firstName != '' &&
        lastName != ''
    ) {
      this.setState({formError: ''})
    }
  }
  focusLocation(){
    this.refs.scrollView.scrollTo(80);
  }
  render(){
    let titleConfig = {title: 'Profile Settings', tintColor: 'white'}
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
          style={styles.formContainer}
          ref="scrollView"
        >
          <Text style={styles.h4}>{"Where are you looking for assemblies?"}</Text>
          <View style={{paddingBottom: 10}}>
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
                    formatted_address: details.formatted_address,
                  })
                }, ()=> this._testErrors());
                this.refs.emailField.focus();
              }}
              getDefaultValue={() => {return this.state.location.city;}}
              query={{
                key: 'AIzaSyC40fZge0C6WnKBE-39gkM4-Ze2mXCMLVc',
                language: 'en', // language of the results
                types: '(cities)', // default: 'geocode'
              }}
              currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
              currentLocationLabel="Current location"
              nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
              GoogleReverseGeocodingQuery={{}}
              GooglePlacesSearchQuery={{
                rankby: 'distance',
              }}
              filterReverseGeocodingByTypes={['street_address']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
              predefinedPlaces={[]}
            />
          </View>
          <Text style={styles.h4}>First Name</Text>
          <View style={{paddingBottom: 10}}>
            <ErrorMessage error={this.state.firstNameError}/>
          </View>
          <View style={styles.formField} ref="firstName">
            <TextInput
              ref="firstNameField"
              returnKeyType="next"
              onSubmitEditing={()=>{
                this.refs.lastNameField.focus();
              }}
              onFocus={this.inputFocused.bind(this, "firstName")}
              maxLength={20}
              onChangeText={(text)=> this.setState({firstName: text, firstNameError: ''}, ()=> this._testErrors())}
              placeholderTextColor='#bbb'
              style={styles.input}
              placeholder="Your first name"
              value={this.state.firstName}
            />
          </View>
          <Text style={styles.h4}>Last name</Text>
          <View style={{paddingBottom: 10}}>
            <ErrorMessage error={this.state.lastNameError}/>
          </View>
          <View style={styles.formField} ref="lastName">
            <TextInput
              returnKeyType="next"
              maxLength={20}
              onSubmitEditing={()=>{
                this.refs.summary.focus();
              }}
              ref="lastNameField"
              onFocus={this.inputFocused.bind(this, 'lastName')}
              onChangeText={(text) => this.setState({lastName: text, lastNameError: ''}, ()=> this._testErrors())}
              placeholderTextColor='#bbb'
              style={styles.input}
              placeholder="Your last name"
              value={this.state.lastName}
            />
          </View>
          <Text style={styles.h4}>{"Tell us a little about yourself"}</Text>
          <View style={{paddingBottom: 10}}>
            <ErrorMessage error={this.state.summaryError}/>
          </View>
          <TextInput
            ref="summary"
            maxLength={200}
            blurOnSubmit={true}
            clearButtonMode='always'
            returnKeyType="next"
            onFocus={this.inputFocused.bind(this, "summary")}
            placeholderTextColor='#bbb'
            style={styles.largeInput}
            multiline={true}
            onChangeText={(text)=> this.setState({summary: text})}
            value={this.state.summary}
            placeholder="Short personal summary..."/>
          <ErrorMessage error={this.state.formError}/>
        </ScrollView>
        <TouchableOpacity style={[Globals.submitButton, {marginBottom: 50}]} onPress={()=>{
          let user = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            location: this.state.location,
            summary: this.state.summary,
          };
          this._updateUser(user);
        }}>
          <Text style={Globals.submitButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

let styles = {
  container: {
    flex: 1,
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
    marginBottom: 50,
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
}

module.exports = UserSettings
