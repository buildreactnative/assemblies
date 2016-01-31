import Colors from '../styles/colors';
import Globals from '../styles/globals';
import Icon from 'react-native-vector-icons/Ionicons';
import ActivityView from '../activity/activity_view';
import UpcomingAssembly from './upcoming_assembly';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeModules,
  MapView,
} from 'react-native';

const MAP_REGION = {
  latitude        : 40.688816,
  longitude       : -73.988410,
  latitudeDelta   : 0.01,
  longitudeDelta  : 0.01
};

const UPCOMING_ASSEMBLIES = [
  {name: 'Hack Night', time: new Date(), group: 'Hacker Hours', going: 10,},
  {name: 'Startup Pitch', time: new Date(), group: 'Geeks & Suits NYC', going: 10,},
  {name: 'Intro to Node JS', time: new Date(), group: 'NY JavaScript', going: 20,},
  {name: 'Admission Guidelines', time: new Date(), group: 'Dev Bootcamp', going: 10,},
  {name: 'VC Night', time: new Date(), group: 'New York Startups', going: 10,},
]

class UpcomingAssemblies extends React.Component{
  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.bodyText}>Assemblies Near Me</Text>
        <MapView
          style={Globals.map}
          region={MAP_REGION}
          annotations={[{latitude: MAP_REGION.latitude, longitude: MAP_REGION.longitude}]}
        />
        <View style={styles.notificationsContainer}>
          <Text style={styles.bodyText}>Today</Text>
          <View style={styles.break}></View>
          <ScrollView style={styles.notificationsHolder}>
          {UPCOMING_ASSEMBLIES.map((assembly, idx) => {
            return (
              <UpcomingAssembly assembly={assembly} key={idx} />
            )
          })}
          </ScrollView>
        </View>
      </View>
    )
  }
}

let styles = {
  bodyText: {
    color: Colors.bodyText,
		fontSize: 16,
		paddingHorizontal: 15,
    paddingVertical: 15,
  },
  notificationsHolder:{},
  break: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 10,
  },
  notificationsContainer: {},
  container: {},
}
module.exports = UpcomingAssemblies;
