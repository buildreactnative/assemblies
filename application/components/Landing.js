import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';

import Colors from '../styles/colors';
import { globals } from '../styles';

class Landing extends Component{
  constructor(){
    super();
    this.visitDashboard = this.visitDashboard.bind(this);
  }
  visitDashboard(){
    this.props.navigator.push({
      name: 'Dashboard'
    });
  }
  render(){
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          title={{title: 'Landing', tintColor: 'white'}}
          tintColor={Colors.brandPrimary}
        />
        <View style={globals.flexCenter}>
          <Text style={globals.h2}>This is the Landing Page</Text>
          <TouchableOpacity onPress={this.visitDashboard}>
            <Text>Go to the Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default Landing;
