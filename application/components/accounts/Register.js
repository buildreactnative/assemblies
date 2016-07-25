import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { globals } from '../../styles';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import BackButton from '../shared/BackButton';
import Colors from '../../styles/colors';

class Register extends Component{
  constructor(){
    super();
    this.goBack = this.goBack.bind(this);
  }
  goBack(){
    this.props.navigator.pop();
  }
  render(){
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          title={{ title: 'Register', tintColor: 'white' }}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        <View style={globals.flexCenter}>
          <Text style={globals.h2}>Register</Text>
        </View>
      </View>
    )
  }
};

export default Register;
