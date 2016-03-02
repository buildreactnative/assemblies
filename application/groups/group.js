import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import EventList from './event_list';
import FakeEvent from './fake_event';
import moment from 'moment';
import {truncate} from 'underscore.string';
import {BASE_URL} from '../utilities/fixtures';
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
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class Group extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      members: [],
      events: [],
      alreadyJoined: !! props.group.members[props.currentUser.id],
      joined : false,
    }
  }
  componentDidMount(){
    let {group, events,} = this.props;
    let eventIds = group.events;
    let groupEvents = _.reject(events, (evt) => ! _.contains(eventIds, evt.id));
    if (groupEvents.length == eventIds ){
      this.setState({events: groupEvents})
    } else {
      fetch(`${BASE_URL}/events?{"id": {"$in": ${JSON.stringify(eventIds)}}}`, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((data) => {
        console.log('DATA USERS', data)
        this.setState({events: data})
      })
      .catch((error) => {console.log(error)})
    }
    let userIds = Object.keys(group.members);
    let url = `${BASE_URL}/users?{"id": {"$in": ${JSON.stringify(userIds)}}}`
    fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('DATA USERS', data)
      this.setState({members: data})
    })
    .catch((error) => {console.log(error)})
  }
  _renderBackButton(){
    return (
      <TouchableOpacity style={styles.backButton} onPress={()=> {
        console.log('Routes', this.props.navigator.getCurrentRoutes());
        this.props.navigator.popToTop();
      }}>
        <Icon name="ios-arrow-back" size={25} color="#ccc" />
      </TouchableOpacity>
    )
  }
  _renderAddButton(){
    return (
      <TouchableOpacity style={styles.addButton} onPress={()=> {
        this.props.navigator.push({
          name: 'CreateEvent',
          group: this.props.group,
        });
      }}>
        <Icon name="ios-plus-outline" size={25} color="#ccc" />
      </TouchableOpacity>
    )
  }
  _renderEvents(){
    let {currentUser, group, navigator} = this.props;
    console.log('EVENTS GROUP', this.state.events);
    return (
      <EventList
        currentUser={currentUser}
        group={group}
        navigator={this.props.navigator}
        events={this.state.events}
      />
    )
  }
  _renderNoEvents(){
    return (
      <View style={styles.eventContainer}>
        <View style={styles.eventInfo}>
          <Text style={styles.h5}>No events scheduled</Text>
        </View>
        <View style={styles.goingContainer}>
          <Text style={styles.goingText}>Create an event</Text>
          <Icon name="checkmark-circled" size={30} color="green" />
        </View>
      </View>
    )
  }
  _renderJoinIcon(){
    let {joined} = this.state;
    if (joined) {
      return (
        <Icon name="checkmark-circled" size={20} color="white" style={styles.joinIcon}/>
      )
    } else {
      return (
        <Icon name="plus" size={20} color="white" style={styles.joinIcon}/>
      )
    }
  }
  _renderJoin(){
    let {group, currentUser} = this.props;
    return (
      <View style={styles.joinContainer}>
        <TouchableOpacity
          onPress={()=>{
            let members = group.members;
            members[currentUser.id] = {
              confirmed: true,
              admin: false,
              owner: false,
              notifications: true
            }
            fetch(`${BASE_URL}/groups/${group.id}`, {
              method: "PUT",
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({members: members})
            })
            .then((response) => response.json())
            .then((data) => {
              console.log('ADD USER TO GROUP', data);
              fetch(`${BASE_URL}/users/${currentUser.id}`, {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({groupIds: currentUser.groupIds.concat(group.id)})
              })
              .then((response) => response.json())
              .then((data) => {
                console.log('ADD GROUP_ID TO USER', data);
                this.props.addUserToGroup(group.id, currentUser.id)
                this.setState({joined: true, members: this.state.members.concat(currentUser)})
              });
            });
          }}
          style={styles.joinButton}
        >
          {this._renderJoinIcon()}
          <Text style={styles.joinText}>{this.state.joined ? 'Joined' : 'Join'}</Text>
        </TouchableOpacity>
      </View>
    )
  }
  render(){
    let {group, currentUser} = this.props;
    let {events, members} = this.state;
    let isMember = _.contains(currentUser.groupIds, group.id);
    let isAdmin = isMember && group.members[currentUser.id].admin;
    let isOwner = isMember && group.members[currentUser.id].owner;
    console.log('EVENTS', events, group.events);
    let backButton = this._renderBackButton();
    let addButton = isAdmin ? this._renderAddButton() : <View></View>;
    return (
      <View style={styles.container}>
      <NavigationBar
        title={{title: group.name, tintColor: 'white'}}
        tintColor={Colors.brandPrimary}
        leftButton={backButton}
        rightButton={addButton}
      />
        <ScrollView style={styles.scrollView}>
        <Image source={{uri: group.imageUrl}} style={styles.topImage}>
          <View style={styles.overlayBlur}>
            <Text style={styles.h1}>{group.name}</Text>
          </View>
          <View style={styles.bottomPanel}>
            <Text style={styles.memberText}>{Object.keys(group.members).length} members</Text>
          </View>
        </Image>
        <Text style={styles.h2}>Summary</Text>
        <Text style={[styles.h4, {paddingHorizontal: 20,}]}>{truncate(group.summary, 140)}</Text>
        <Text style={styles.h2}>Technologies</Text>
        <Text style={styles.h3}>{group.technologies.join(', ')}</Text>
        {! this.state.alreadyJoined ? this._renderJoin() : null}
        <Text style={styles.h2}>Events</Text>
        <View style={styles.break}></View>
        {Object.keys(group.events).length ? this._renderEvents() : this._renderNoEvents()}
        <View style={styles.break}></View>
        <Text style={styles.h2}>Members</Text>
        <View style={styles.break}></View>
        {this.state.members.map((member, idx) => {
          console.log('MEMBER', member)
          let isOwner = group.members[member.id].owner;
          let isAdmin = group.members[member.id].admin;
          let status = isOwner ? 'owner' : isAdmin ? 'admin' : 'member'
          return (
            <TouchableOpacity
              onPress={()=>{
                this.props.navigator.push({
                  name: 'Profile',
                  user: member,
                })
              }}
              key={idx}
              style={styles.memberContainer}>
              <Image source={{uri: member.avatarUrl}} style={styles.avatar}/>
              <View style={styles.memberInfo}>
                <Text style={styles.h5}>{member.firstName} {member.lastName}</Text>
                <Text style={styles.h4}>{status}</Text>
              </View>
            </TouchableOpacity>
          )
        })}
        </ScrollView>
      </View>
    )
  }
}

let styles = {
  backButton: {
    paddingLeft: 20,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  addButton: {
    backgroundColor: 'transparent',
    paddingRight: 20,
    paddingBottom: 10,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  topImage: {
    width: deviceWidth,
    height: 200,
    flexDirection: 'column',
  },
  overlayBlur: {
    backgroundColor: '#333',
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  h1: {
    fontSize: 22,
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomPanel: {
    flex: 0.3,
    backgroundColor: 'white',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberText: {
    textAlign: 'center',
    color: Colors.brandPrimary,
    fontSize: 18,
    fontWeight: '400',
  },
  h4: {
    fontSize: 18,
    fontWeight: '300',
  },
  h3: {
    fontSize: 18,
    color: Colors.brandPrimary,
    paddingHorizontal: 18,
    paddingVertical: 5,
    fontWeight: '500',
  },
  break: {
    height: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginHorizontal: 15,
    marginVertical: 5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '300',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  eventContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  joinContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  joinButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: Colors.brandPrimary,
  },
  joinText: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlign: 'center',
  },
  joinIcon: {
    paddingVertical: 10,
  },
  eventInfo: {
    flex: 1,
  },
  h5: {
    fontSize: 18,
    fontWeight: '500',
  },
  goingContainer: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goingText: {
    fontSize: 17,
    color: Colors.brandPrimary
  },
  memberContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  avatar: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  memberInfo: {
    paddingLeft: 30,
  },
}

module.exports = Group;
