import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { globals } from '../../styles';

class CalendarView extends Component{
  render(){
    return (
      <View style={globals.flexCenter}>
        <Text style={globals.h2}>CALENDAR VIEW</Text>
      </View>
    )
  }
};

export default CalendarView;
