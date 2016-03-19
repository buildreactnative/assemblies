import Colors from '../styles/colors';
import Globals from '../styles/globals';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {truncate} from 'underscore.string';
import _ from 'underscore';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  TabBarIOS,
  Image,
  MapView,
  TouchableOpacity,
  Dimensions,
  NativeModules,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class EventLocation extends React.Component{
  render(){
    let {event, group} = this.props;
    if (! event.location || ! event.location.lat || ! event.location.lng) {
      return <View style={[Globals.map, {backgroundColor: Colors.inactive}]}></View>
    }
    const mapRegion = {
      latitude        : event.location.lat,
      longitude       : event.location.lng,
      latitudeDelta   : 0.01,
      longitudeDelta  : 0.01
    }
    return (
      <View style={{backgroundColor: Colors.inactive}}>
        <MapView
          style={Globals.map}
          region={mapRegion}
          annotations={[{latitude: mapRegion.latitude, longitude: mapRegion.longitude}]}
        />
        <View style={styles.bottomPanel}>
          <Text style={styles.memberText}>{Object.keys(event.attending).length} going</Text>
        </View>
      </View>
    )
  }
}

let styles = {
  topImage: {
    width: deviceWidth,
    height: 200,
    flexDirection: 'column',
  },
  overlayBlur: {
    backgroundColor: '#333',
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  h1: {
    fontSize: 22,
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomPanel: {
    flex: 0.3,
    backgroundColor: Colors.brandPrimaryDark,
    paddingVertical: 12,
    marginBottom: 10,
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: '400',
  },
}

module.exports = EventLocation;
