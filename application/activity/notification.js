import Colors from '../styles/colors';
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
} from 'react-native';

class Notification extends React.Component{
  _renderUnseen(){
    return (
      <View style={styles.seenCircle}></View>
    )
  }
  render(){
    let {notification} = this.props;
    let {subject, message, time, seen} = notification;
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          {seen ? <View style={styles.emptySeen}></View> : this._renderUnseen()}
          <Text style={styles.subjectText}>{subject}</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>12:30PM</Text>
            <TouchableOpacity style={styles.timeLink}>
              <Text style={styles.timeLinkText}>
                {' >'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.messageText}>{message}</Text>
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
    alignItems: 'center',
    marginVertical: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  timeText: {},
  timeLink: {},
  timeLinkText: {},
  messageText: {
    marginLeft: 25,
  },
}
module.exports = Notification;
