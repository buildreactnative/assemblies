import Colors from '../styles/colors';
import Globals from '../styles/globals';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import {GooglePlacesAutocomplete} from '../third_party/google_places/autocomplete';
import ErrorMessage from '../ui_helpers/error_message';
import _ from 'underscore';
import {autocompleteStyles} from '../utilities/style_utilities';
import {DEV} from '../utilities/fixtures';

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

class CreateEvent extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      summary: '',
      name: '',
      location: null,
      error: '',
    }
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
  _scroll(dist){
    this.refs.scrollView.scrollTo(dist);
  }
  render(){
    let titleConfig = {title: 'Create Event', tintColor: 'white'}
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
          contentContainerStyle={{paddingBottom: 100}}
          ref="scrollView">
          <Text style={styles.h4}>* Where is the event?</Text>
          <GooglePlacesAutocomplete
            styles={autocompleteStyles}
            placeholder='Type a place or street address'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            onFocus={()=>{
              this._scroll(60);
            }}
            fetchDetails={true}
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
              if (DEV) {console.log(data);}
              if (DEV) {console.log(details);}
              this.setState({
                location: _.extend({}, details.geometry.location, {
                  city: details.address_components[0].long_name,
                  state: details.address_components[2].short_name,
                })
              });
              this.refs.name.focus();
            }}
            getDefaultValue={() => {
              return ''; // text input default value
            }}
            query={{
              key: 'AIzaSyC40fZge0C6WnKBE-39gkM4-Ze2mXCMLVc',
              language: 'en', // language of the results
            }}
            currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
            currentLocationLabel="Current location"
            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{}}
            GooglePlacesSearchQuery={{ rankby: 'distance',}}
            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            predefinedPlaces={[]}
          />
          <Text style={styles.h4}>{"* What's the event name?"}</Text>
          <View style={styles.formField}>
            <TextInput
              ref="name"
              returnKeyType="next"
              onSubmitEditing={()=>{
                this.refs.summary.focus();
              }}
              onFocus={this.inputFocused.bind(this, "name")}
              onChangeText={(text)=> this.setState({name: text})}
              placeholderTextColor='#bbb'
              style={styles.input}
              placeholder="Type a name"
            />
          </View>
          <Text style={styles.h4}>{"What's happening at the event?"}</Text>
          <TextInput
            ref="summary"
            returnKeyType="next"
            blurOnSubmit={true}
            clearButtonMode='always'
            onFocus={this.inputFocused.bind(this, "summary")}
            onChangeText={(text)=> this.setState({summary: text})}
            placeholderTextColor='#bbb'
            style={styles.largeInput}
            multiline={true}
            placeholder="Type a summary of the event..."
          />
          <ErrorMessage error={this.state.error}/>
        </ScrollView>
        <TouchableOpacity
          onPress={()=>{
            let {name, summary, location} = this.state;
            if (! location || name == ''){
              this.setState({error: 'Must fill required fields *.'});
              return;
            }
            this.props.navigator.push({
              name: 'CreateEventConfirm',
              eventName: name,
              summary: summary,
              location: location,
              group: this.props.group,
            })
          }}
          style={[Globals.submitButton, {marginBottom: 50}]}>
          <Text style={Globals.submitButtonText}>Next</Text>
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
    paddingTop: 25,
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
    color: '#777',
    fontSize: 18,
    backgroundColor: 'white',
    fontWeight: '300',
    height: 120,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
}

module.exports = CreateEvent
