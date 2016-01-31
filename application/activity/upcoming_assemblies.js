import Colors from '../styles/colors';
import Globals from '../styles/globals';
import Icon from 'react-native-vector-icons/Ionicons';
import ActivityView from '../activity/activity_view';

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
          <Text style={styles.bodyText}>Notifications</Text>
          <View style={styles.break}></View>
          <ScrollView style={styles.notificationsHolder}>

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
