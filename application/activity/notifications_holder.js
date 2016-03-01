import Colors from '../styles/colors';
import Globals from '../styles/globals';
import Icon from 'react-native-vector-icons/Ionicons';
import ActivityView from '../activity/activity_view';
import Notification from './notification';

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

let { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const NOTIFICATIONS = [
  {time: new Date(), message: 'new message from Chris', subject: 'Message', seen: false, redirect: '/'},
  {time: new Date(), message: 'comment in React Native NYC', subject: 'Event', seen: false, redirect: '/'},
  {time: new Date(), message: 'new members in React Native NYC', subject: 'Group', seen: false, redirect: '/'},
  {time: new Date(), message: 'new message from Nick', subject: 'Message', seen: false, redirect: '/'},
  {time: new Date(), message: 'new event in JavaScript', subject: 'Event', seen: false, redirect: '/'},
]
const MAP_REGION = {
  latitude        : 40.688816,
  longitude       : -73.988410,
  latitudeDelta   : 0.01,
  longitudeDelta  : 0.01
};

class NotificationsHolder extends React.Component{
  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.bodyText}>Next Assembly</Text>
        <MapView
          style={Globals.map}
          region={MAP_REGION}
          annotations={[{latitude: MAP_REGION.latitude, longitude: MAP_REGION.longitude}]}
        />
        <View style={styles.notificationsContainer}>
          <Text style={styles.bodyText}>Notifications</Text>
          <View style={styles.break}></View>
          <ScrollView style={styles.notificationsHolder}>
            {this.props.notifications.map((notification, idx) => {
              return (
                <Notification notification={notification} key={idx}/>
              )
            })}
            <View style={styles.emptySpace}></View>
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
  notificationsContainer: {
    height: deviceHeight - 70 - 20 - 250 - 40,
  },
  container: {},
}
module.exports = NotificationsHolder;
