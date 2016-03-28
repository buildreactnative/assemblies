import _                from 'underscore';
import Icon             from 'react-native-vector-icons/Ionicons';
import NavigationBar    from '../third_party/react-native-navbar/index';
import Colors           from '../styles/colors';
import Globals          from '../styles/globals';
import ErrorMessage     from '../ui_helpers/error_message';
import {GooglePlacesAutocomplete} from '../third_party/google_places/autocomplete';
import {autocompleteStyles} from '../utilities/style_utilities';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
  NativeModules,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export default class CreateGroup extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      imageUrl        : "http://devbootcamp.com/assets/img/locations/nyc-about-photo.jpg",
      error           : '',
      name            : '',
      summary         : '',
      members         : {},
      events          : {},
      technologies    : [],
      location        : null,
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
  focusInput(h){
    if (this.refs.scrollView){
      this.refs.scrollView.scrollTo(h);
    }
  }
  _technologies(tech){
    this.setState({
      technologies: this.state.technologies.concat(tech)
    })
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
  _renderTechnologies(){
    return (
      <Text style={styles.technologyList}>{this.state.technologies.join(', ')}</Text>
    )
  }
  _getOptionList(){
    return this.refs['OPTIONLIST']
  }
  render(){
    let {technologies,} = this.state;
    let titleConfig = {title: 'Create Assembly', tintColor: 'white'}
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
        <ScrollView
          style={styles.formContainer}
          contentContainerStyle={{paddingBottom: 100}}
          ref="scrollView">
          <Text style={styles.h4}>* Name of your assembly</Text>
          <View style={styles.formField}>
            <TextInput
              ref="name"
              returnKeyType="next"
              autofocus={true}
              onSubmitEditing={()=>{
                this.refs.location.triggerFocus();
              }}
              onFocus={() => this.focusInput(40)}
              onChangeText={(text)=> this.setState({name: text})}
              placeholderTextColor='#bbb'
              style={styles.input}
              placeholder="Name of your assembly"
            />
          </View>
          <Text style={styles.h4}>* Where is your group located?</Text>
          <GooglePlacesAutocomplete
            styles={autocompleteStyles}
            placeholder='Your city'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            onFocus={() => this.focusInput(120)}
            ref="location"
            fetchDetails={true}
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
              this.setState({
                location: _.extend({}, details.geometry.location, {
                  city: _.find(details.address_components, (c) => c.types[0] == 'locality'),
                  state: _.find(details.address_components, (c) => c.types[0] == 'administrative_area_level_1'),
                  county: _.find(details.address_components, (c) => c.types[0] == 'administrative_area_level_2'),
                  formattedAddress: details.formatted_address,
                })
              });
              this.refs.summary.focus();
            }}
            getDefaultValue={() => {
              return ''; // text input default value
            }}
            query={{
              key: 'AIzaSyC40fZge0C6WnKBE-39gkM4-Ze2mXCMLVc',
              language: 'en', // language of the results
              types: '(cities)', // default: 'geocode'
            }}
            currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
            currentLocationLabel="Current location"
            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{}}
            GooglePlacesSearchQuery={{ rankby: 'distance',}}
            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            predefinedPlaces={[]}
          />

          <Text style={styles.h4}>Who should join and why?</Text>
          <TextInput
            ref="summary"
            returnKeyType="next"
            blurOnSubmit={true}
            clearButtonMode='always'
            onFocus={() => this.focusInput(230)}
            onChangeText={(text)=> this.setState({summary: text})}
            placeholderTextColor='#bbb'
            style={styles.largeInput}
            multiline={true}
            placeholder="Type a message to get people interested in your group..."
          />
          <ErrorMessage error={this.state.error}/>
        </ScrollView>
        <TouchableOpacity
          onPress={()=>{
            let {name, location, summary} = this.state;
            if (name == '' || ! location) {
              this.setState({ error: 'Must fill out required fields *.'});
              return;
            }
            this.props.navigator.push({
              name        : 'CreateGroupConfirm',
              groupName   : name,
              location    : location,
              summary     : summary,
            })
          }}
          style={[Globals.submitButton, {marginBottom: 50}]}
        >
          <Text style={Globals.submitButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

let styles = StyleSheet.create({
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
  technologyList:{
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.brandPrimary,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  input: {
    color: '#777',
    fontSize: 18,
    fontWeight: '300',
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  avatar: {
    height: 200,
    width: deviceWidth,
    borderRadius: 3,
    padding: 20,
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
});
