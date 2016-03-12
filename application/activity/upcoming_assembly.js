import Colors from '../styles/colors';
import Globals from '../styles/globals';
import Icon from 'react-native-vector-icons/Ionicons';
import ActivityView from '../activity/activity_view';
import moment from 'moment';
import _ from 'underscore';
import {DEV} from '../utilities/fixtures';
import {shadeColor, blendColors} from '../utilities/color_utilities';

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
  _renderImage(group){
    return (
      <Image source={{uri: group.imageUrl}} style={styles.groupImage}>
        <View style={[styles.group, {backgroundColor: group.backgroundColor,}]} >
        </View>
      </Image>
    )
  }
  _renderGoing(){
    let {event} = this.props;
    return (
      <Text style={styles.going}> {Object.keys(event.attending).length} going</Text>
    )
  }
  _renderAttending(){
    return (
      <Text style={styles.attending}><Icon name="checkmark-circled" color={Colors.brandSuccess}/> Yes</Text>
    )
  }
  render(){
    let group = _.find(this.props.groups, (g) => {
      return g.id == this.props.event.groupId
    })
    let {event, currentUser,} = this.props;
    if (DEV) {console.log('GROUP', group);}
    let {name, attending, start} = event;
    let startTime = new Date(start);
    let isAttending = !! attending[currentUser.id]
    return (
      <View style={styles.container}>
        {group ? this._renderImage(group) : null}
        <View style={styles.row}>
          <View style={styles.textRow}>
            <Text style={styles.subjectText}>{name}</Text>
            {isAttending ? this._renderAttending() : this._renderGoing()}
          </View>
          <Text style={styles.messageText}>{group ? group.name : ''}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{moment(startTime).format('h:mm a')}</Text>
          <Icon style={styles.icon} name="ios-arrow-forward" size={25} color={Colors.bodyTextLight}/>
        </View>
      </View>
    )
  }
}

let styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.inactive,
    marginHorizontal: 8,
  },
  attending: {
    color: Colors.brandSuccess,
    fontSize: 12,
    fontWeight: '300',
    paddingHorizontal: 4,
  },
  group: {
    opacity: 0.9,
    flex: 1,
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  groupImage: {
    height: 30,
    borderRadius: 15,
    width: 30,
    margin: 10,
    opacity: 0.8,
  },
  row: {
    flex: 1,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  going: {
    fontSize: 12,
    fontWeight: '300',
    paddingHorizontal: 5,
  },
  subjectText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '300',
  },
  icon: {
    marginLeft: 15,
    marginTop: 5,
  },
  timeLink: {},
  timeLinkText: {},
  messageText: {
    fontStyle: 'italic',
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '300',
    paddingVertical: 8,
  },
}

module.exports = UpcomingAssembly;
