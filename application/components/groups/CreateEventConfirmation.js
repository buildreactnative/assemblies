import React, { Component } from 'react';
import { View, Text } from 'react-native';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';

import Colors from '../../styles/colors';
import BackButton from '../shared/BackButton';
import { globals } from '../../styles';

class CreateEventConfirmation extends Component{
  render(){
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          title={{ title: 'Create Event', tintColor: 'white' }}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        <View style={globals.flexCenter}>
          <Text style={globals.h2}>CreateEventConfirmation</Text>
        </View>
      </View>
    )
  }
};

export default CreateEventConfirmation;
