import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { find } from 'underscore';

import Colors from '../../styles/colors';
import { Headers } from '../../fixtures';
import BackButton from '../shared/BackButton';
import { GooglePlacesCityConfig } from '../../config';
import { DEV, API } from '../../config';
import { globals, formStyles, autocompleteStyles } from '../../styles';

const styles = formStyles;
const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

function setErrorMsg({ location, firstName, lastName, email }){
  if (typeof location !== 'object' || ! location.city ) {
    return 'Must provide valid location.';
  } else if (firstName === ''){
    return 'Must provide a valid first name.';
  } else if (lastName === '') {
    return 'Must provide a valid last name.';
  } else if (email === ''){
    return 'Must provide a valid email address.';
  } else {
    return '';
  }
}
class UserSettings extends Component{
  constructor(props){
    super(props);
    this.goBack = this.goBack.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.selectLocation = this.selectLocation.bind(this);
    this.state = {
      email     : props.currentUser.username,
      errorMsg  : '',
      firstName : props.currentUser.firstName,
      lastName  : props.currentUser.lastName,
      location  : props.currentUser.location,
    }
  }
  saveSettings(){
    let errorMsg = setErrorMsg(this.state);
    if (errorMsg !== '') {
      this.setState({ errorMsg }); return;
    }
    let user = {
      location: this.state.location,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email
    };
    fetch(`${API}/users/${this.props.currentUser.id}`, {
      method: 'PUT',
      headers: Headers,
      body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(user => this.updateUser(user))
    .catch(err => console.log('ERR:', err))
    .done();
  }
  updateUser(user){
    this.props.updateUser(user);
    this.goBack();
  }
  selectLocation(data, details){
    if ( ! details ) { return; }
    let location = {
      ...details.geometry.location,
      city: find(details.address_components, (c) => c.types[0] === 'locality'),
      state: find(details.address_components, (c) => c.types[0] === 'administrative_area_level_1'),
      county: find(details.address_components, (c) => c.types[0] === 'administrative_area_level_2'),
      formattedAddress: details.formatted_address
    };
    this.setState({ location });
  }
  goBack(){
    this.props.navigator.pop();
  }
  render(){
    return (
      <View style={[globals.flexContainer, globals.inactive]}>
        <NavigationBar
          title={{ title: 'User Settings', tintColor: 'white' }}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        <KeyboardAwareScrollView style={[styles.formContainer, globals.mt1]}>
          <Text style={styles.h4}>{"* Where are you looking for assemblies?"}</Text>
          <View ref="location" style={{flex: 1,}}>
            <GooglePlacesAutocomplete
              styles={autocompleteStyles}
              placeholder='Your city'
              minLength={2}
              autoFocus={false}
              fetchDetails={true}
              onPress={this.selectLocation}
              getDefaultValue={() => {return this.state.location.city.long_name;}}
              query={GooglePlacesCityConfig}
              currentLocation={false}
              currentLocationLabel="Current location"
              nearbyPlacesAPI='GooglePlacesSearch'
              GoogleReverseGeocodingQuery={{}}
              GooglePlacesSearchQuery={{rankby: 'distance',}}
              filterReverseGeocodingByTypes={['street_address']}
              predefinedPlaces={[]}>
            </GooglePlacesAutocomplete>
          </View>
          <Text style={styles.h4}>* Email</Text>
          <View style={styles.formField}>
            <TextInput
              ref={(el) => this.email = el }
              returnKeyType="next"
              onChangeText={(email) => this.setState({ email })}
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={144}
              value={this.state.email}
              placeholderTextColor='#bbb'
              style={styles.input}
              placeholder="Your email address"
            />
          </View>
          <Text style={styles.h4}>* First Name</Text>
          <View style={styles.formField}>
            <TextInput
              ref={(el) => this.firstName = el }
              returnKeyType="next"
              maxLength={20}
              value={this.state.firstName}
              onChangeText={(firstName) => this.setState({ firstName })}
              placeholderTextColor='#bbb'
              style={styles.input}
              placeholder="Your first name"
            />
          </View>
          <Text style={styles.h4}>* Last name</Text>
          <View style={styles.formField} ref="lastName">
            <TextInput
              returnKeyType="next"
              maxLength={20}
              ref={(el) => this.lastName = el }
              onChangeText={(lastName) => this.setState({ lastName })}
              placeholderTextColor='#bbb'
              value={this.state.lastName}
              style={styles.input}
              placeholder="Your last name"
            />
         </View>
        </KeyboardAwareScrollView>
        <TouchableOpacity style={[styles.submitButton, styles.buttonMargin]} onPress={this.saveSettings}>
          <Text style={globals.largeButtonText}>SAVE</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default UserSettings;
