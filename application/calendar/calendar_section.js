import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {DEV} from '../utilities/fixtures';
import _ from 'underscore';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  Image,
  ListView,
  TouchableOpacity,
  Dimensions,
  NativeModules,
} from 'react-native';

class CalendarSection extends React.Component{
  render(){
    let {sectionData} = this.props;
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{moment(sectionData).format('dddd MMM Do')}</Text>
      </View>
    );
  }
};


let styles = {
  container: {
    flex: 1,
  },
  sectionHeader: {
    backgroundColor: Colors.inactive,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.inactiveDark,
  },
  sectionHeaderText: {
    color: Colors.brandPrimaryDark,
    fontSize: 18,
    fontWeight: '300',
  },
  header: {
    height: 70,
    backgroundColor: Colors.brandPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 22,
  },
  listView: {},
};

module.exports = CalendarSection;
