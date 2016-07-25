import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, MapView } from 'react-native';

import Colors from '../../styles/colors';
import { globals, activityStyles } from '../../styles';
import { upcomingEvent, FakeNotifications } from '../../fixtures';

const styles = activityStyles;

const ActivityMap = ({ event }) => {
  const mapRegion = {
    latitude: event.location.lat,
    longitude: event.location.lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  return (
    <MapView
      style={globals.map}
      region={mapRegion}
      annotations={[{latitude: mapRegion.latitude, longitude: mapRegion.longitude}]}
    />
  )
};

const Notification = ({ notification }) => (
  <TouchableOpacity style={[globals.flexRow, globals.ph1]}>
    <View style={globals.flex}>
      <View style={globals.flexRow}>
        <View style={styles.circle}/>
        <View style={[globals.textContainer, globals.pv1]}>
          <Text style={styles.h4}>New {notification.type}</Text>
        </View>
        <Text style={styles.h5}>{moment(new Date(new Date(notification.createdAt))).fromNow()}</Text>
      </View>
      <View style={globals.flex}>
        <Text style={styles.messageText}>{notification.message}</Text>
      </View>
    </View>
    <View>
      <Icon name='ios-arrow-forward' color='#777' size={25} />
    </View>
  </TouchableOpacity>
)

class Activity extends Component{
  render() {
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          title={{ title: 'Activity', tintColor: 'white' }}
          tintColor={Colors.brandPrimary}
        />
        <ScrollView>
          <TouchableOpacity>
            <View style={[globals.flexRow, globals.mb1]}>
              <Text style={styles.h4}>Next Assembly: </Text>
              <Text style={globals.primaryText}>{ upcomingEvent.name }</Text>
            </View>
            <Text style={[styles.dateText, globals.mb1]}>{moment(new Date(upcomingEvent.start)).format('dddd MMM Do, h:mm a')}</Text>
          </TouchableOpacity>
          <ActivityMap event={upcomingEvent}/>
          <View>
            <Text style={[styles.h4, globals.mv1]}>Notifications</Text>
            <View style={globals.divider}/>
            <View style={globals.flex}>
              {FakeNotifications.map((n, idx) => (
                <View key={idx} style={globals.flex}>
                  <Notification notification={n} />
                </View>
              ))}
              <View style={styles.emptySpace} />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
};

export default Activity;
