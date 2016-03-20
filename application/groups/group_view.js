import _                  from 'underscore';
import Icon               from 'react-native-vector-icons/Ionicons';
import NavigationBar      from 'react-native-navbar';
import Groups             from './groups';
import Group              from './group';
import CreateGroup        from './create_group';
import Event              from './event';
import CreateEvent        from './create_event';
import GroupMembers       from './group_members';
import GroupEvents        from './group_events';
import CreateEventConfirm from './create_event_confirm';
import CreateGroupConfirm from './create_group_confirm';
import Profile            from '../messages/profile';
import MessageList        from '../messages/messages_list';
import Colors             from '../styles/colors';
import MessageBox         from '../messages/message_box';
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
export default class GroupView extends Component{
  createGroup(group, currentUser){
    let {groups} = this.props;
    this.props.sendData({
      groups: groups.concat(group),
    });
    this.props.updateUser(currentUser);
  }
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
  addUserToGroup(group, currentUser){
    let {suggestedGroups} = this.props;
    let idx = _.findIndex(suggestedGroups, (g) => g.id == group.id);
    this.props.sendData({
      suggestedGroups: [...suggestedGroups.slice(0, idx), group, ...suggestedGroups.slice(idx+1)],
    });
    this.props.updateUser(currentUser);
  }
  addEvent(event){
    // if (DEV) {console.log('EVENT', event);}
    // if (! event) {
    //   return;
    // }
    // let {groups} = this.props;
    // let group;
    // groups.forEach((gp, id) => {
    //   if (gp.id == event.groupId){
    //     group = groups[id];
    //     groups[id].events.push(event.id)
    //   }
    // })
    // if (DEV) {console.log('UPDATED GROUPS', groups)}
    // fetch(`${BASE_URL}/groups/${event.groupId}`, {
    //   method: "PUT",
    //   headers: HEADERS,
    //   body: JSON.stringify({events: group.events.concat(event.id)})
    // })
    // .then((response) => response.json())
    // .then((data) => {
    //   this.props.changeState({events: this.state.events.concat(event), groups: groups})
    //   if (DEV) {console.log('UPDATED GROUP EVENT DATA', data);}
    // });
  }
  render(){
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
                  unsubscribe={this.unsubscribe.bind(this)}
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

let styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
