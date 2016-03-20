import Colors               from '../styles/colors';
import Icon                 from 'react-native-vector-icons/Ionicons';
import NavigationBar        from 'react-native-navbar';
import Groups               from '../groups/groups';
import Group                from '../groups/group';
import CreateGroup          from '../groups/create_group';
import CreateEvent          from '../groups/create_event';
import GroupMembers         from '../groups/group_members';
import GroupEvents          from '../groups/group_events';
import CreateEventConfirm   from '../groups/create_event_confirm';
import CreateGroupConfirm   from '../groups/create_group_confirm';
import Profile              from '../messages/profile';
import Event                from '../groups/event';
import MessageList          from '../messages/messages_list';
import MessageBox           from '../messages/message_box';
import CalendarList         from './calendar_list';
import _                    from 'underscore';
import {BASE_URL, DEV, HEADERS} from '../utilities/fixtures';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  View,
  Dimensions,
  NativeModules,
  Navigator,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

const CUSTOM_CONFIG = Navigator.SceneConfigs.HorizontalSwipeJump;
CUSTOM_CONFIG.gestures = {}; // disable gestures for side swipe

export default class CalendarView extends Component{
  unsubscribe(group, currentUser){
    let idx = _.findIndex(this.props.suggestedGroups, (g) => g.id == group.id);
    if (idx != -1){
      this.props.sendData({
        groups          : _.reject(this.props.groups, (g) => g.id == group.id),
        suggestedGroups : [...this.props.suggestedGroups.slice(0, idx), group, ...this.props.suggestedGroups.slice(idx+1)],
      });
    } else {
      this.props.sendData({
        groups          : _.reject(this.props.groups, (g) => g.id == group.id),
        suggestedGroups : this.props.suggestedGroups.concat(group),
      });
    }
    this.props.updateUser(currentUser);
    let url = `${BASE_URL}/groups/${group.id}`;
    fetch(url, {
      method    : 'PUT',
      headers   : HEADERS,
      body      : JSON.stringify({members: group.members})
    })
    .then((response) => response.json())
    .then((data) => {
      let url = `${BASE_URL}/users/${currentUser.id}`;
      fetch(url, {
        method    : 'PUT',
        headers   : HEADERS,
        body      : JSON.stringify({groupIds: currentUser.groupIds})
      })
      .catch((err) => {
        if (DEV) {console.log('ERR: ', err);}
      }).done();
    })
    .catch((err) => {
      if (DEV) {console.log('ERR:', err);}
    }).done();
  }
  addEvent(event, group){
    if (DEV) {console.log('EVENT', event);}
    if (! event || ! group) {
      return;
    }
    let idx = _.findIndex(this.props.groups, (g) => g.id == group.id);
    this.props.sendData({
      groups: [...this.props.groups.slice(0, idx), group, ...this.props.groups.slice(idx+1)],
      events: this.props.events.concat(event),
    })
    if (DEV) {console.log('UPDATED GROUPS', this.props.groups)}
    fetch(`${BASE_URL}/groups/${event.groupId}`, {
      method    : 'PUT',
      headers   : HEADERS,
      body      : JSON.stringify({events: group.events})
    })
    .catch((err) => {
      if (DEV) {console.log('ERR:', err);}
    }).done();
  }
  addUserToGroup(group, currentUser){
    let {suggestedGroups} = this.props;
    let idx = _.findIndex(suggestedGroups, (g) => g.id == group.id);
    this.props.sendData({
      suggestedGroups: [...suggestedGroups.slice(0, idx), group, ...suggestedGroups.slice(idx+1)],
    });
    this.props.updateUser(currentUser);
  }
  render(){
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
                <CalendarList
                  {...this.props}
                  sendData={this.props.sendData}
                  navigator={navigator}
                  allEvents={this.props.allEvents.sort((a, b) => a.start > b.start)}
                />
              )
            } else if (route.name == 'Event') {
              return (
                <Event {...route} {...this.props} navigator={navigator} />
              )
            } else if (route.name == 'Profile') {
              return (
                <Profile {...route} {...this.props} navigator={navigator} />
              )
            } else if (route.name == 'Group') {
              return (
                <Group
                  addUserToGroup={this.addUserToGroup.bind(this)}
                  unsubscribe={this.unsubscribe.bind(this)}
                  addEvent={this.addEvent.bind(this)}
                  {...this.props}
                  {...route}
                  navigator={navigator}
                />
              )
            } else if (route.name == 'Events' ) {
              return <GroupEvents {...this.props} navigator={navigator}  />
            } else if (route.name == 'CreateEvent'){
              return <CreateEvent {...this.props} {...route} navigator={navigator}  />
            } else if (route.name == 'CreateEventConfirm'){
              return (
                <CreateEventConfirm {...this.props} {...route}
                  navigator={navigator}
                  addEvent={()=>{
                    if (DEV) {console.log('ADD EVENT')}
                  }}
                />
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

let styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
