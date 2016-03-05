import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import NotificationsHolder from './notifications_holder';
import UpcomingAssemblies from './upcoming_assemblies';
import ActivityHolder from './activity_holder';
import MessageList from '../messages/messages_list';
import MessageBox from '../messages/message_box';
import {BASE_URL} from '../utilities/fixtures';
import Event from '../groups/event';
import Profile from '../messages/profile';
import Group from '../groups/group';
import _ from 'underscore';

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

class ActivityView extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      tab: 'notifications',
    }
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
            } else if (route.name == 'Groups') {
              return (
                <Groups
                  {...this.props}
                  navigator={navigator}
                  addUserToGroup={()=>{console.log('ADD USER')}}
                />
              )
            } else if (route.name == 'CreateGroup'){
              return <CreateGroup {...this.props} navigator={navigator} />
            } else if (route.name == 'Group') {
              return (
                <Group
                  addUserToGroup={()=>{console.log('ADD USER')}}
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
                  addEvent={()=>{console.log('ADD EVENT')}}
                />
              )
            } else if (route.name == 'CreateGroupConfirm'){
              return (
                <CreateGroupConfirm {...this.props} {...route}
                  createGroup={()=>{console.log('CREATE GROUP')}}
                  navigator={navigator}
                />
              )
            } else if (route.name == 'Profile') {
              return (
                <Profile {...route} {...this.props} navigator={navigator} />
              )
            } else if (route.name == 'event' || route.name == 'comment') {
              console.log('ROUTE', route)
              let {events, groups} = this.props;
              let eventId = route.notification.eventId;
              let event = _.find(this.props.allEvents, (e) => e.id == eventId);
              let group = _.find(groups, (g) => g.id == event.groupId);
              console.log('EVENT NOW', event, group, route.notification, this.state);
              return (
                <Event event={event} group={group} {...route} {...this.props} navigator={navigator} />
              )
            } else if (route.name == 'Event'){
              return (
                <Event {...route} {...this.props} {...this.state} navigator={navigator}/>
              )
            } else if (route.name == 'message') {
              console.log(route, this.state, this.props)
              let userIds = Object.keys(route.notification.relatedUserIds)
              return (
                <MessageBox user={route.user} userIds={userIds} {...this.props} navigator={navigator}/>
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
}

module.exports = ActivityView;
