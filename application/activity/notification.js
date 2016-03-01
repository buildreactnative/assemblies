import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import ActivityView from '../activity/activity_view';
import moment from 'moment';

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
} from 'react-native';

class Notification extends React.Component{
  _renderUnseen(){
    return (
      <View style={styles.seenCircle}></View>
    )
  }
  render(){
    let {notification} = this.props;
    let {type, message, seen} = notification;
    console.log('RENDERED NOTIFICATION', message);
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          {seen ? <View style={styles.emptySeen}></View> : this._renderUnseen()}
          <Text style={styles.subjectText}>new {type}</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{moment(new Date(parseInt(notification.timestamp))).fromNow()}</Text>
            <TouchableOpacity style={styles.timeLink}>
              <Icon name="ios-arrow-forward" color="#777" size={20}/>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </View>
    )
  }
}

let styles = {
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    marginVertical: 8,
    flex: 1,
  },
  seenCircle: {
    backgroundColor: Colors.brandPrimary,
    borderRadius: 7.5,
    width: 15,
    height: 15,
    marginHorizontal: 10,
  },
  emptySeen: {
    flex: 1,
    height: 15,
    width: 15,
  },
  subjectText: {
    flex: 7,
    fontSize: 18,
    fontWeight: '500',
  },
  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingRight: 10,
  },
  timeText: {},
  timeLink: {
    paddingHorizontal: 10,
  },
  timeLinkText: {},
  messageContainer: {
    flex: 1,
  },
  messageText: {
    color: 'black',
    marginLeft: 25,
    fontSize: 16,
    fontWeight: '300',
  },
}
module.exports = Notification;
