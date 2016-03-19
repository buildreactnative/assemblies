import Colors         from '../styles/colors';
import Globals        from '../styles/globals';
import Icon           from 'react-native-vector-icons/Ionicons';
import ActivityView   from '../activity/activity_view';
import Notification   from './notification';
import moment         from 'moment';
import NoMessages     from '../messages/no_messages';
import {DEV}          from '../utilities/fixtures';

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
const MAP_REGION = {};

export default class NotificationsHolder extends Component{
  _renderMap(mapRegion){
    return (
      <MapView
        style={Globals.map}
        region={mapRegion}
        annotations={[{latitude: mapRegion.latitude, longitude: mapRegion.longitude}]}
      />
    )
  }
  _renderEmptyMap(){
    return (
      <View style={[Globals.map, {backgroundColor: Colors.inactive}]}></View>
    )
  }
  _renderNotifications(){
    return (
      <View style={styles.notificationsHolder}>
        {this.props.notifications.map((notification, idx) => {
          return (
            <Notification {...this.props} notification={notification} key={idx}/>
          )
        })}
        <View style={styles.emptySpace}></View>
      </View>
    );
  }
  _renderNoNotifications(){
    return (
      <View style={{height: 100}}>
        <NoMessages
          text='You do not have any notifications at this time.'
          textStyle={{fontSize: 14, fontStyle: 'italic'}}
          viewStyle={{paddingTop: 10}}/>
      </View>
    );
  }
  render(){
    let {nextEvent} = this.props;
    let mapRegion = null;
    if (nextEvent) {
      mapRegion = {
        latitude: nextEvent.location.lat,
        longitude: nextEvent.location.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    }
    if (DEV){console.log('NEXT EVENT', nextEvent)}
    return (
      <ScrollView
        contentContainerStyle={{paddingBottom: 80}}
        automaticallyAdjustContentInsets={false}
        style={styles.container}>
        <View style={{backgroundColor: 'white'}}>
          <Text style={styles.bodyText}>Next Assembly: {nextEvent ? nextEvent.name : ''}</Text>
          <Text style={styles.dateText}>{nextEvent ? moment(new Date(parseInt(nextEvent.start))).format('dddd MMM Do, h:mm a') : ''}</Text>
        </View>
        {nextEvent ? this._renderMap(mapRegion) : this._renderEmptyMap()}
        <View style={styles.notificationsContainer}>
          <Text style={styles.bodyText}>Notifications</Text>
          <View style={styles.break}></View>
          {this.props.notifications.length ? this._renderNotifications() : this._renderNoNotifications()}
        </View>
      </ScrollView>
    )
  }
}

let styles = StyleSheet.create({
  bodyText: {
    color: Colors.bodyText,
		fontSize: 16,
    fontWeight: '400',
		paddingHorizontal: 15,
    paddingVertical: 10,
  },
  dateText: {
    fontSize: 14,
    paddingBottom: 4,
    fontWeight: '300',
    fontStyle: 'italic',
    paddingHorizontal: 15,
    color: Colors.bodyText,
  },
  notificationsHolder:{},
  break: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 10,
  },
  notificationsContainer: {
  },
  container: {
    flex: 1,
    paddingTop: 0,
  },
});
