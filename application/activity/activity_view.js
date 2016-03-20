import Icon                 from 'react-native-vector-icons/Ionicons';
import _                    from 'underscore';
import Colors               from '../styles/colors';
import NotificationsHolder  from './notifications_holder';
import UpcomingAssemblies   from './upcoming_assemblies';
import ActivityHolder       from './activity_holder';
import MessageList          from '../messages/messages_list';
import MessageBox           from '../messages/message_box';
import Event                from '../groups/event';
import Profile              from '../messages/profile';
import Group                from '../groups/group';
import {BASE_URL, HEADERS, DEV} from '../utilities/fixtures';

import React, {
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

export default class ActivityView extends Component{
  constructor(props){
    super(props);
    this.state = {
      tab: 'notifications',
    };
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
  changeEvent(event){
    let idx = _.findIndex(this.props.events, (e) => e.id == event.id);
    let allEventsIdx = _.findIndex(this.props.allEvents, (e) => e.id == event.id);
    let newAllEvents = this.props.allEvents;
    if (allEventsIdx != -1){
      newAllEvents = [...this.props.allEvents.slice(0, allEventsIdx), event, ...this.props.allEvents.slice(allEventsIdx+1)];
    }
    this.props.sendData({
      events      : [...this.props.events.slice(0, idx), event, ...this.props.events.slice(idx+1)],
      allEvents   : newAllEvents,
    });
  }
  render(){
    let {tab,} = this.state;
    let tabContent = tab == 'upcoming' ? <UpcomingAssemblies {...this.props} {...this.state}/> : <NotificationsHolder {...this.state}/>
    return (
      <View style={styles.container}>
        <Navigator
          initialRoute={{ name: 'ActivityHolder' }}
          configureScene={(route, routeStack) => {
            return CUSTOM_CONFIG;
          }}
          renderScene={(route, navigator) => {
            if (route.name == 'ActivityHolder'){
              return (
                <ActivityHolder
                  {...this.props}
                  tab={this.state.tab}
                  setUpcoming={()=>this.setState({tab: 'upcoming'})}
                  setNotifications={()=>this.setState({tab: 'notifications'})}
                  navigator={navigator}
                />
              )
            } else if (route.name == 'CreateGroup'){
              return <CreateGroup {...this.props} navigator={navigator} />
            } else if (route.name == 'Group') {
              return (
                <Group
                  addUserToGroup={this.addUserToGroup.bind(this)}
                  unsubscribe={this.unsubscribe.bind(this)}
                  addEvent={this.addEvent.bind(this)}
                  changeEvent={this.changeEvent.bind(this)}
                  {...this.props}
                  {...route}
                  navigator={navigator}
                />
              )
            } else if (route.name == 'CreateEvent'){
              return <CreateEvent {...this.props} {...route} navigator={navigator}  />
            } else if (route.name == 'CreateEventConfirm'){
              return (
                <CreateEventConfirm
                  {...this.props}
                  {...route}
                  navigator={navigator}
                  addEvent={()=>{if (DEV) {console.log('ADD EVENT')}}}
                />
              )
            } else if (route.name == 'CreateGroupConfirm'){
              return (
                <CreateGroupConfirm
                  {...this.props}
                  {...route}
                  createGroup={()=>{if (DEV) {console.log('CREATE GROUP')}}}
                  navigator={navigator}
                />
              )
            } else if (route.name == 'Profile') {
              return (
                <Profile {...route} {...this.props} navigator={navigator} />
              )
            } else if (route.name == 'event' || route.name == 'comment') {
              if (DEV){console.log('ROUTE', route)}
              let {events, groups} = this.props;
              let eventId = route.notification.eventId;
              let event = _.find(this.props.events, (e) => e.id == eventId);
              let group = !! event ? _.find(groups, (g) => g.id == event.groupId) : null;
              if (DEV) {console.log('EVENT NOW', event, group, route.notification, this.state);}
              return (
                <Event event={event} group={group} {...route} {...this.props} navigator={navigator} />
              )
            } else if (route.name == 'Event'){
              return (
                <Event
                  {...route}
                  {...this.props}
                  {...this.state}
                  navigator={navigator}
                />
              );
            } else if (route.name == 'message') {
              if (DEV) {console.log(route, this.state, this.props)}
              let userIds = Object.keys(route.notification.relatedUserIds)
              return (
                <MessageBox
                  user={route.user}
                  userIds={userIds}
                  {...this.props}
                  navigator={navigator}
                />
              );
            } else if (route.name == 'Chat'){
              let userIds = [this.props.currentUser.id, route.user.id]
              return (
                <MessageBox
                  {...this.props}
                  user={route.user}
                  userIds={userIds}
                  messageUsers={null}
                  navigator={navigator}
                />
              );
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
  topTab: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    paddingTop: 25,
    paddingBottom: 10,
    backgroundColor: Colors.brandPrimary,
  },
  selectTab:{
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  leftSelectTab: {
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginLeft: 5,
    borderRightWidth: 0,
  },
  rightSelectTab: {
    borderRadius: 4,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeftWidth: 0,
    marginRight: 5,
  },
  leftActiveTab: {
    backgroundColor: Colors.brandPrimary,
  },
  leftInactiveTab: {
    backgroundColor: 'white',
  },
  rightActiveTab: {
    backgroundColor: Colors.brandPrimary,
  },
  rightInactiveTab: {
    backgroundColor: 'white',
  },
  activeTabText: {
    textAlign: 'center',
    color: 'white',
  },
  inactiveTabText: {
    textAlign: 'center',
    color: Colors.brandPrimary,
  },
});
