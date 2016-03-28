import _              from 'underscore';
import Icon           from 'react-native-vector-icons/Ionicons';
import moment         from 'moment';
import Notification   from './notification';
import Colors         from '../styles/colors';
import Globals        from '../styles/globals';
import ActivityView   from '../activity/activity_view';
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
    if (! this.props.fetchedNotifications) {
      return (
        <View style={{flex: 1,}}>
        </View>
      );
    }
    return (
      <View style={{height: deviceHeight / 3 }}>
        <NoMessages
          text='You do not have any notifications at this time.'
          textStyle={{fontSize: 14, fontStyle: 'italic'}}
          viewStyle={{paddingTop: 10}}/>
      </View>
    );
  }
  _goToEvent(event){
    if (! event ) {
      return;
    } else {
      let group = _.find(this.props.groups, (g) => {
        return g.id == event.groupId
      })
      this.props.navigator.push({
        name: 'Event',
        event: event,
        group: group,
      });
    }
  }
  _renderNextEvent(nextEvent){
    return (
      <TouchableOpacity onPress={() => this._goToEvent(nextEvent)}>
        <Text style={{color: Colors.brandPrimary, fontWeight: '500'}}>{nextEvent ? nextEvent.name : ''}</Text>
      </TouchableOpacity>
    );
  }
  _renderCreateGroup(){
    if (! this.props.fetchedNextEvent ) {
      return (
        <Text></Text>
      )
    }
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 4,}}>
        <Text style={styles.nextEvent}>No events selected. </Text>
        <TouchableOpacity
          onPress={()=>{
            this.props.sendData({
              selectedTab: 'Groups',
            })
          }}
          >
          <Text style={{color: Colors.brandPrimary, fontWeight: '500'}}>Explore Assemblies</Text>
        </TouchableOpacity>
      </View>

    )
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.bodyText}>Next Assembly: </Text>

            {nextEvent ? this._renderNextEvent(nextEvent) : this._renderCreateGroup()}
          </View>
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
  nextEvent: {
    color: Colors.bodyTextLight,
    fontSize: 14,
    fontWeight: '300',
    fontStyle: 'italic',
  },
  dateText: {
    fontSize: 14,
    paddingBottom: 4,
    fontWeight: '300',
    fontStyle: 'italic',
    paddingHorizontal: 15,
    color: Colors.bodyText,
  },
  notificationsHolder:{
    flex: 1,
  },
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
