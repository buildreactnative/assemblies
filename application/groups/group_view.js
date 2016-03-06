import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import Groups from './groups';
import Group from './group';
import CreateGroup from './create_group';
import CreateEvent from './create_event';
import GroupMembers from './group_members';
import GroupEvents from './group_events';
import CreateEventConfirm from './create_event_confirm';
import CreateGroupConfirm from './create_group_confirm';
import Profile from '../messages/profile';
import Event from './event';
import MessageList from '../messages/messages_list';
import MessageBox from '../messages/message_box';
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
class GroupView extends React.Component{
  createGroup(group){
    if (! group) {return;}
    this.props.changeState({
      groups: this.state.groups.concat(group),
    })
  }
  addUserToGroup(groupId, userId){
    let {currentUser} = this.props;
    let {groups} = this.state;
    groups.forEach((gp, idx) => {
      if (gp.id == groupId){
        gp.members[userId] = true;
      }
    })
    currentUser.groupIds.push(groupId)
    this.props.updateUser(currentUser)
    this.props.changeState({groups: groups})
  }
  addEvent(event){
    console.log('EVENT', event);
    if (! event) {
      return;
    }
    let {groups} = this.props;
    let group;
    groups.forEach((gp, id) => {
      if (gp.id == event.groupId){
        group = groups[id];
        groups[id].events.push(event.id)
      }
    })
    console.log('UPDATED GROUPS', groups)
    fetch(`${BASE_URL}/groups/${event.groupId}`, {
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({events: group.events.concat(event.id)})
    })
    .then((response) => response.json())
    .then((data) => {
      this.props.changeState({events: this.state.events.concat(event), groups: groups})
      console.log('UPDATED GROUP EVENT DATA', data);
    });
  }
  render(){
    // console.log('THIS PROPS', this.props);
    return (
      <View style={styles.container}>
        <Navigator
          initialRoute={{ name: 'Groups' }}
          configureScene={(route, routeStack) => {
            return CUSTOM_CONFIG;
          }}
          renderScene={(route, navigator) => {
            if (route.name == 'Groups') {
              return (
                <Groups
                  {...this.props}
                  navigator={navigator}
                  addUserToGroup={this.addUserToGroup.bind(this)}
                />
              )
            } else if (route.name == 'CreateGroup'){
              return <CreateGroup {...this.props} navigator={navigator} />
            } else if (route.name == 'Group') {
              return (
                <Group
                  addUserToGroup={this.addUserToGroup.bind(this)}
                  {...this.props}
                  {...route}
                  navigator={navigator}
                />
              )
            } else if (route.name == 'Members') {
              return <GroupMembers {...this.props} navigator={navigator} />
            } else if (route.name == 'Events' ) {
              return <GroupEvents {...this.props} navigator={navigator}  />
            } else if (route.name == 'CreateEvent'){
              return <CreateEvent {...this.props} {...route} navigator={navigator}  />
            } else if (route.name == 'CreateEventConfirm'){
              return (
                <CreateEventConfirm {...this.props} {...route}
                  navigator={navigator}
                  addEvent={this.addEvent.bind(this)}
                />
              )
            } else if (route.name == 'CreateGroupConfirm'){
              return (
                <CreateGroupConfirm {...this.props} {...route}
                  createGroup={this.createGroup.bind(this)}
                  navigator={navigator}
                />
              )
            } else if (route.name == 'Profile') {
              return (
                <Profile {...route} {...this.props} navigator={navigator} />
              )
            } else if (route.name == 'Event') {
              return (
                <Event {...route} {...this.props} navigator={navigator} />
              )
            } else if (route.name == 'Chat') {
              return (
                <MessageBox user={route.user} userIds={[route.user.id, this.props.currentUser.id].sort()} {...this.props} navigator={navigator}/>
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
module.exports = GroupView;
