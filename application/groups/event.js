import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import moment from 'moment';
import {truncate} from 'underscore.string';
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

class Event extends React.Component{
  constructor(props){
    super(props);
    console.log('SUPER', props.event.attending, props.currentUser.id)
    this.state = {
      members: [],
      going: !! props.event.attending[props.currentUser.id],
    }
  }
  componentDidMount(){
    let {group, event,} = this.props;
    let attending = Object.keys(event.attending)
    fetch(`http://localhost:2403/users?{"id": {"$in": ${JSON.stringify(attending)}}}`, {
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
        this.props.navigator.pop();
      }}>
        <Icon name="ios-arrow-back" size={25} color="#ccc" />
      </TouchableOpacity>
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
    let {group, currentUser, event} = this.props;
    return (
      <View style={styles.joinContainer}>
        <TouchableOpacity
          onPress={()=>{
            let attending = event.attending;
            attending[currentUser.id] = true;
            fetch(`http://localhost:2403/events/${event.id}`, {
              method: "PUT",
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({attending: attending})
            })
            .then((response) => response.json())
            .then((data) => {
              console.log('RES', data);
            });
          }}
          style={styles.joinButton}
        >
          {this._renderJoinIcon()}
          <Text style={styles.joinText}>{this.state.joined ? " I'm Going" : "Going"}</Text>
        </TouchableOpacity>
      </View>
    )
  }
  render(){
    let {group, currentUser, event} = this.props;
    let {events, members} = this.state;
    let isMember = _.contains(currentUser.groupIds, group.id);
    let isAdmin = isMember && group.members[currentUser.id].admin;
    let isOwner = isMember && group.members[currentUser.id].owner;
    console.log('EVENTS', events, group.events);
    let backButton = this._renderBackButton();
    return (
      <View style={styles.container}>
      <NavigationBar
        title={{title: group.name, tintColor: 'white'}}
        tintColor={Colors.brandPrimary}
        leftButton={backButton}
      />
        <ScrollView style={styles.scrollView}>
        <Image source={{uri: group.imageUrl}} style={styles.topImage}>
          <View style={styles.overlayBlur}>
            <Text style={styles.h1}>{event.name}</Text>
          </View>
          <View style={styles.bottomPanel}>
            <Text style={styles.memberText}>{Object.keys(event.attending).length} going</Text>
          </View>
        </Image>
        <Text style={styles.h2}>Summary</Text>
        <Text style={[styles.h4, {paddingHorizontal: 20,}]}>{truncate(event.summary, 140)}</Text>
        <Text style={styles.h2}>Technologies</Text>
        <Text style={styles.h3}>{group.technologies.join(', ')}</Text>
          {! this.state.going ? this._renderJoin() : null}
        <Text style={styles.h2}>Comments</Text>
        <View style={styles.break}></View>
        <Text style={styles.h2}>Going</Text>
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

module.exports = Event;
