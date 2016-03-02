import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import Groups from '../groups/groups';
import Group from '../groups/group';
import CreateGroup from '../groups/create_group';
import CreateEvent from '../groups/create_event';
import GroupMembers from '../groups/group_members';
import GroupEvents from '../groups/group_events';
import CreateEventConfirm from '../groups/create_event_confirm';
import CreateGroupConfirm from '../groups/create_group_confirm';
import Profile from '../messages/profile';
import Event from '../groups/event';
import MessageList from '../messages/messages_list';
import MessageBox from '../messages/message_box';
import CalendarList from './calendar_list';
import _ from 'underscore';
import {BASE_URL} from '../utilities/fixtures';

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
  Navigator,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

const CUSTOM_CONFIG = Navigator.SceneConfigs.HorizontalSwipeJump;
// console.log('GESTURES', CUSTOM_CONFIG.gestures);
CUSTOM_CONFIG.gestures = {}; // disable gestures for side swipe
class CalendarView extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      groups: [],
      events: [],
    }
  }
  _loadEvents(){
    let groupIds = this.props.currentUser.groupIds;
    let url = `${BASE_URL}/events?{"groupId": {"$in": ${JSON.stringify(groupIds)}}}`
    fetch(url, {
      method: "GET",
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json'
      },
    })
    .then((response)=>response.json())
    .then((data) => {
      console.log('EVENT DATA', data);
      this.setState({
        events: data
      })
    })
    .catch((err) => {
      console.log('ERR: ', err);
    })
  }
  _loadGroups(){
    let groupIds = this.props.currentUser.groupIds;
    let url = `${BASE_URL}/groups?{"id": {"$in": ${JSON.stringify(groupIds)}}}`
    fetch(url, {
      method: "GET",
      header: {
        'Accept': 'application/json',
        'Content-Type':'application/json'
      }
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('GROUPS', data);
      this.setState({
        groups: data
      })
    })
    .catch((err) => {
      console.log('ERR: ', err);
    })
  }
  componentDidMount(){
    this._loadEvents();
    this._loadGroups();
  }
  render(){
    // console.log('THIS PROPS', this.props);
    return (
      <View style={styles.container}>
        <Navigator
          initialRoute={{ name: 'CalendarList' }}
          configureScene={(route, routeStack) => {
            return CUSTOM_CONFIG;
          }}
          renderScene={(route, navigator) => {
            if (route.name == 'CalendarList') {
              return (
                <CalendarList groups={this.state.groups} events={this.state.events} navigator={navigator}/>
              )
            } else if (route.name == 'Event') {
              return (
                <Event {...route} {...this.props} {...this.state} navigator={navigator} />
              )
            } else if (route.name == 'Profile') {
              return (
                <Profile {...route} {...this.props} {...this.state} navigator={navigator} />
              )
            } else if (route.name == 'Chat') {
              return (
                <MessageBox
                  {...this.props}
                  userIds={[route.user.id, this.props.currentUser.id]}
                  user={route.user}
                  navigator={navigator}
                />
              )
            }
          }}/>
      </View>
    )
  }
}

let styles = {
  container: {
    flex: 1,
  }
}
module.exports = CalendarView;
