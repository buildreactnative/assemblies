import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import React, { Component } from 'react';
import { View, ListView, ScrollView, TouchableOpacity, Text, Image, ActionSheetIOS } from 'react-native';
import { find, findIndex, isEqual } from 'underscore';
import Swipeout from 'react-native-swipeout';

import { rowHasChanged } from '../../utilities';
import BackButton from '../shared/BackButton';
import { API, DEV } from '../../config';
import { Headers } from '../../fixtures';
import { globals, groupsStyles } from '../../styles';

const styles = groupsStyles;

function isMember(group, currentUser){
  return findIndex(group.members, ({ userId }) => isEqual(userId, currentUser.id)) !== -1;
};

function showJoinButton(users, currentUser){
  return findIndex(users, ({ id }) => isEqual(id, currentUser.id)) === -1;
}

const OptionsButton = ({ openActionSheet }) => {
  return (
    <TouchableOpacity style={globals.pa1} onPress={openActionSheet}>
      <Icon name="ios-more" size={25} color="#ccc" />
    </TouchableOpacity>
  )
}

class EventList extends Component{
  constructor(){
    super();
    this._renderRow = this._renderRow.bind(this);
  }
  getButtons(isGoing, event, currentUser){
    if (isGoing){
      return [{
        text: 'Cancel',
        type: 'delete',
        onPress: () => { this.props.cancelRSVP(event, currentUser) }
      }];
    } else {
      return [{
        text: 'RSVP',
        type: 'primary',
        onPress: () => { this.props.joinEvent(event, currentUser) }
      }];
    }
  }
  _renderRow(event, sectionID, rowID){
    let { currentUser, events, group } = this.props;
    let isGoing = find(event.going, (id) => isEqual(id, currentUser.id));
    let right = this.getButtons(isGoing, event, currentUser);
    return (
      <Swipeout backgroundColor='white' rowID={rowID} right={right}>
        <View style={styles.eventContainer}>
          <TouchableOpacity style={globals.flex} onPress={() => this.props.visitEvent(event)}>
            <Text style={globals.h5}>{event.name}</Text>
            <Text style={styles.h4}>{moment(event.start).format('dddd, MMM Do')}</Text>
            <Text style={styles.h4}>{event.going.length} Going</Text>
          </TouchableOpacity>
          <View style={[globals.flexRow, globals.pa1]}>
            <Text style={[globals.primaryText, styles.h4, globals.ph1]}>
              {isGoing ? "You're Going" : "Want to go?"}
            </Text>
            <Icon name={ isGoing ? "ios-checkmark" : "ios-add" } size={30} color={Colors.brandPrimary} />
          </View>
        </View>
      </Swipeout>
    )
  }
  dataSource(){
    return (
      new ListView.DataSource({ rowHasChanged }).cloneWithRows(this.props.events)
    );
  }
  render(){
    if (! this.props.events.length ){ return <Text style={[globals.h5, globals.mh2]}>No events scheduled</Text>}
    return (
      <ListView
        enableEmptySections={true}
        dataSource={this.dataSource()}
        renderRow={this._renderRow}
        scrollEnabled={false}
        style={globals.flex}
      />
    )
  }
};

class JoinButton extends Component{
  render(){
    let { addUserToGroup, group, currentUser } = this.props
    let hasJoined = isMember(group, currentUser);
    return (
      <View style={[styles.joinButtonContainer, globals.mv1]}>
        <TouchableOpacity onPress={() => addUserToGroup(group, currentUser)} style={styles.joinButton}>
          <Text style={styles.joinButtonText}>{ hasJoined ? 'Joined' : 'Join'}</Text>
            <Icon
              name={hasJoined ? "ios-checkmark" : "ios-add"}
              size={30}
              color='white'
              style={styles.joinIcon}
            />
        </TouchableOpacity>
      </View>
    )
  }
}

export const GroupMembers = ({ users, members, handlePress }) => {
  return (
    <View>
      {members.map((member, idx) => {
        let user = find(users, ({ id }) => isEqual(id, member.userId));
        if ( ! user ) { return; }
        return (
          <TouchableOpacity key={idx} style={globals.flexRow} onPress={() => handlePress(user)}>
            <Image source={{uri: user.avatar}} style={globals.avatar}/>
            <View style={globals.textContainer}>
              <Text style={globals.h5}>{user.firstName} {user.lastName}</Text>
              <Text style={[styles.h4, globals.mh1]}>{member.role}</Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  );
}

class Group extends Component{
  constructor(){
    super();
    this.openActionSheet = this.openActionSheet.bind(this);
    this.cancelRSVP = this.cancelRSVP.bind(this);
    this.joinEvent = this.joinEvent.bind(this);
    this.goBack = this.goBack.bind(this);
    this.visitProfile = this.visitProfile.bind(this);
    this.visitEvent = this.visitEvent.bind(this);
    this.visitCreateEvent = this.visitCreateEvent.bind(this);
    this.updateEvents = this.updateEvents.bind(this);
    this.state = {
      events    : [],
      ready     : false,
      users     : [],
    }
  }
  componentDidMount(){
    this._loadEvents();
  }
  _loadEvents(){
    let query = {
      groupId: this.props.group.id,
      end: { $gt: new Date().valueOf() },
      $limit: 10,
      $sort: { start: -1 }
    };
    fetch(`${API}/events?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(events => this._loadUsers(events))
    .catch(err => {})
    .done();
  }

  joinEvent(event, currentUser){
    let { events } = this.state;
    let updatedEvent = {
      ...event,
      going: [ ...event.going, currentUser.id ]
    };
    let index = findIndex(this.state.events, ({ id }) => isEqual(id, event.id));
    let updatedEvents = [
      ...this.state.events.slice(0, index),
      updatedEvent,
      ...this.state.events.slice(index + 1)
    ];
    this.setState({ events: updatedEvents })
    this.updateEventGoing(event);
  }

  cancelRSVP(event, currentUser){
    let updatedEvent = {
      ...event,
      going: event.going.filter((userId) => ! isEqual(userId, currentUser.id))
    };
    let index = findIndex(this.state.events, ({ id }) => isEqual(id, event.id));
    let updatedEvents = [
      ...this.state.events.slice(0, index),
      updatedEvent,
      ...this.state.events.slice(index + 1)
    ];
    this.setState({ events: updatedEvents })
    this.updateEventGoing(event);
  }
  updateEventGoing(event){
    fetch(`${API}/events/${event.id}`, {
      method: 'PUT',
      headers: Headers,
      body: JSON.stringify({
        going: event.going
      })
    })
    .then(response => response.json())
    .then(data => {})
    .catch(err => {})
    .done();
  }

  openActionSheet(){
    let { group, currentUser } = this.props;
    let member = find(group.members, ({ userId }) => isEqual(userId, currentUser.id));
    let buttonActions = ['Unsubscribe', 'Cancel'];
    if (member && member.role === 'owner') {
      buttonActions.unshift('Create Event');
    }
    let options = {
      options: buttonActions,
      cancelButtonIndex: buttonActions.length-1
    };
    ActionSheetIOS.showActionSheetWithOptions(options, (buttonIndex) => {
      switch(buttonActions[buttonIndex]){
        case 'Unsubscribe':
          this.props.unsubscribeFromGroup(group, currentUser);
          break;
        case 'Create Event':
          this.visitCreateEvent(group);
          break;
        default:
          return;
      }
    });
  }

  visitEvent(event){
    this.props.navigator.push({
      name: 'Event',
      group: this.props.group,
      updateEvents: this.updateEvents,
      event,
    })
  }

  updateEvents(event){
    let idx = findIndex(this.state.events, ({ id }) => isEqual(id, event.id));
    let events = [
      ...this.state.events.slice(0, idx),
      event,
      ...this.state.events.slice(idx + 1)
    ];
    this.setState({ events })
  }

  visitCreateEvent(group){
    this.props.navigator.push({
      name: 'CreateEvent',
      group
    })
  }

  _loadUsers(events){
    this.setState({ events })
    let query = {
      id: { $in: this.props.group.members.map(({ userId }) => userId ) },
      $limit: 100
    };
    fetch(`${API}/users?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(users => this.setState({ users, ready: true }))
    .catch(err => {})
    .done();
  }
  goBack(){
    this.props.navigator.replacePreviousAndPop({ name: 'Groups' });
  }
  visitProfile(user){
    this.props.navigator.push({
      name: 'Profile',
      user
    })
  }
  visitCreateEvent(group){
    this.props.navigator.push({
      name: 'CreateEvent',
      group
    })
  }
  render(){
    let { group, currentUser } = this.props;
    let showButton = showJoinButton(this.state.users, currentUser) && this.state.ready;
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          title={{title: group.name, tintColor: 'white'}}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton handlePress={this.goBack}/>}
          rightButton={<OptionsButton openActionSheet={this.openActionSheet}/>}
        />
        <ScrollView style={globals.flex}>
          <Image source={{uri: group.image}} style={styles.groupTopImage}>
            <View style={styles.overlayBlur}>
              <Text style={styles.h1}>{group.name}</Text>
            </View>
            <View style={styles.bottomPanel}>
              <Text style={[globals.h4, globals.primaryText]}>
                {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
              </Text>
            </View>
          </Image>
          <Text style={styles.h2}>Summary</Text>
          <Text style={[globals.h5, globals.ph2]}>{group.description}</Text>
          <Text style={styles.h2}>Technologies</Text>
          <Text style={[globals.h5, globals.ph2]}>{group.technologies.join(', ')}</Text>
          <View style={globals.lightDivider}/>
          { showButton ? <JoinButton addUserToGroup={this.props.addUserToGroup} group={group} currentUser={currentUser} /> : null }
          <Text style={styles.h2}>Events</Text>
          <EventList
            {...this.state}
            {...this.props}
            visitEvent={this.visitEvent}
            joinEvent={this.joinEvent}
            cancelRSVP={this.cancelRSVP}
          />
          <View style={globals.lightDivider} />
          <Text style={styles.h2}>Members</Text>
          <View style={globals.lightDivider} />
          <GroupMembers
            members={group.members}
            users={this.state.users}
            handlePress={this.visitProfile}
          />
        </ScrollView>
      </View>
    )
  }
};

export default Group;
