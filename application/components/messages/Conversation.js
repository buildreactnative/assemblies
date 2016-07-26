import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { globals } from '../../styles';
import BackButton from '../shared/BackButton';

class Conversation extends Component{
  constructor(){
    super();
    this.goBack = this.goBack.bind(this);
  }
  goBack(){
    this.props.navigator.pop();
  }
  render(){
    let { user, currentUser } = this.props;
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          tintColor={Colors.brandPrimary}
          title={{ title: `${user.firstName} ${user.lastName}`, tintColor: 'white' }}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        <View style={globals.flexCenter}>
          <Text style={globals.h2}>Conversation</Text>
        </View>
      </View>
    )
  }
};

export default Conversation;
