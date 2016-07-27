import React, { Component } from 'react';
import { View, Text } from 'react-native';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';

import BackButton from '../shared/BackButton';
import Colors from '../../styles/colors';
import { globals } from '../../styles';

class CreateGroupConfirmation extends Component{
  render(){
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          title={{ title: 'Create Group', tintColor: 'white' }}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        <View style={globals.flexCenter}>
          <Text style={globals.h2}>CreateGroupConfirmation</Text>
        </View>
      </View>
    );
  }
};

export default CreateGroupConfirmation;
