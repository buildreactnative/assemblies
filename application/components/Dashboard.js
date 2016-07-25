import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';

import Colors from '../styles/colors';
import { globals } from '../styles';

const BackButton = ({ handlePress }) => (
  <TouchableOpacity onPress={handlePress} style={globals.pa1}>
    <Icon name='ios-arrow-back' size={25} color='white' />
  </TouchableOpacity>
);

class Dashboard extends Component{
  constructor(){
    super();
    this.goBack = this.goBack.bind(this);
    this.visitLanding = this.visitLanding.bind(this);
  }
  visitLanding(){
    this.props.navigator.push({
      name: 'Landing'
    });
  }
  goBack(){
    this.props.navigator.pop();
  }
  render(){
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          title={{title: 'Dashboard', tintColor: 'white'}}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        <View style={globals.flexCenter}>
          <Text style={globals.h2}>This is the Dashbaord</Text>
          <TouchableOpacity onPress={this.visitLanding}>
            <Text>Go to the Landing Page</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default Dashboard;
