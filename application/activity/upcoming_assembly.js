import Colors from '../styles/colors';
import Globals from '../styles/globals';
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
  MapView,
} from 'react-native';

class UpcomingAssembly extends React.Component{
  render(){
    let {event, group} = this.props;
    console.log('GROUP', group);
    let {name, attending, start} = event;
    let startTime = new Date(start);
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.textRow}>
            <Text style={styles.subjectText}>{name}</Text>
            <Text style={styles.going}> {Object.keys(attending).length} going</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{moment(startTime).format('h:mm')}</Text>
            <TouchableOpacity style={styles.timeLink}>
              <Text style={styles.timeLinkText}>
                {' >'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.messageText}>{group ? group.name : ''}</Text>
      </View>
    )
  }
}

let styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 7,
  },
  emptySeen: {
    flex: 1,
    height: 15,
    width: 15,
  },
  going: {
    fontSize: 14,
  },
  subjectText: {
    marginLeft: 25,
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

module.exports = UpcomingAssembly;
