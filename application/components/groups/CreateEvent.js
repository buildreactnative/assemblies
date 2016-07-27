import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import React, { Component, PropTypes } from 'react';
import { ScrollView, View, Text, TextInput, Slider, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { find } from 'underscore';

import Colors from '../../styles/colors';
import BackButton from '../shared/BackButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Config from 'react-native-config';
import { globals, formStyles, autocompleteStyles } from '../../styles';

const styles = formStyles;

class CreateEvent extends Component{
  constructor(){
    super();
    this.saveLocation = this.saveLocation.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.goBack = this.goBack.bind(this);
    this.state = {
      capacity    : 50,
      location    : null,
      name        : '',
      showPicker  : false,
    };
  }
  submitForm(){
    this.props.navigator.push({
      name: 'CreateEventConfirmation',
      group: this.props.group,
      location: this.state.location,
      capacity: this.state.capacity,
      eventName: this.state.name,
    })
  }
  saveLocation(data, details=null){
    if ( ! details ) { return; }
    let location = {
      ...details.geometry.location,
      city: find(details.address_components, (c) => c.types[0] === 'locality'),
      state: find(details.address_components, (c) => c.types[0] === 'administrative_area_level_1'),
      county: find(details.address_components, (c) => c.types[0] === 'administrative_area_level_2'),
      formattedAddress: details.formatted_address
    };
    this.setState({ location });
    this.name.focus();
  }
  goBack(){
    this.props.navigator.pop();
  }
  render(){
    let { capacity } = this.state;
    return (
      <View style={[globals.flexContainer, globals.inactive]}>
        <NavigationBar
          title={{ title: 'Create Event', tintColor: 'white' }}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        <KeyboardAwareScrollView style={[styles.formContainer, globals.mt1]} contentInset={{bottom: 49}}>
          <Text style={styles.h4}>* Where is the event?</Text>
          <View style={globals.flex}>
            <GooglePlacesAutocomplete
              styles={autocompleteStyles}
              placeholder='Type a place or street address'
              minLength={2}
              autoFocus={true}
              fetchDetails={true}
              onPress={this.saveLocation}
              getDefaultValue={() => ''}
              query={{
                key: Config.GOOGLE_PLACES_API_KEY,
                language: 'en'
              }}
              currentLocation={false}
              currentLocationLabel='Current Location'
              nearbyPlacesAPI='GooglePlacesSearch'
              GoogleReverseGeocodingQuery={{}}
              GooglePlacesSearchQuery={{ rankby: 'distance' }}
              filterReverseGeocodingByTypes={['locality', 'adminstrative_area_level_3']}
              predefinedPlaces={[]}
            />
          </View>
          <Text style={styles.h4}>{"* What's the event name?"}</Text>
          <View style={styles.formField}>
            <TextInput
              returnKeyType="next"
              ref={(el) => this.name = el }
              onChangeText={(name) => this.setState({ name })}
              placeholderTextColor='#bbb'
              style={styles.input}
              placeholder="Type a name"
            />
          </View>
          <Text style={styles.h4}>Attendee capacity</Text>
          <View style={styles.formField}>
            <View style={styles.pickerButton}>
              <Text style={styles.input}>{capacity ? capacity : 'Choose a duration'}</Text>
            </View>
          </View>
          <View style={globals.mv1}>
            <Slider
              style={styles.slider}
              defaultValue={capacity}
              value={capacity}
              step={10}
              minimumValue={10}
              maximumValue={200}
              onValueChange={(val) => this.setState({capacity: val})}
            />
          </View>
        </KeyboardAwareScrollView>
        <TouchableOpacity
          onPress={this.submitForm}
          style={[styles.submitButton, styles.buttonMargin]}>
          <Text style={globals.largeButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default CreateEvent;
