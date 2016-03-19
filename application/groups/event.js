import Colors from '../styles/colors';
import Globals from '../styles/globals';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import CommentList from './comment_list';
import EventLocation from './event_location';
import moment from 'moment';
import {truncate} from 'underscore.string';
import {BASE_URL, DEV} from '../utilities/fixtures';
import _ from 'underscore';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
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
    if (DEV) {console.log('SUPER', props.event.attending, props.currentUser.id)}
    this.state = {
      event: props.event,
      members: [],
      going: !! props.event.attending[props.currentUser.id],
      signedUp: false,
      message: '',
      showCommentForm: false,
      showMap: false,
      ready: false,
    }
  }
  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this.setState({ready: true});
      let {group, event,} = this.props;
      let attending = Object.keys(event.attending)
      fetch(`${BASE_URL}/users?{"id": {"$in": ${JSON.stringify(attending)}}}`, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((data) => {
        if (DEV) {console.log('DATA USERS', data)}
        this.setState({members: data, showMap: true})
      })
      .catch((error) => {
        if (DEV) {console.log(error)}
        this.setState({showMap: true})
      })
    });
  }
  _renderBackButton(){
    return (
      <TouchableOpacity style={Globals.backButton} onPress={()=> {
        if (DEV) {console.log('Routes', this.props.navigator.getCurrentRoutes());}
        this.props.navigator.pop();
      }}>
        <Icon name="ios-arrow-back" size={25} color="#ccc" />
      </TouchableOpacity>
    )
  }
  _renderJoinIcon(){
    let {going} = this.state;
    if (going) {
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
    let {event} = this.state;
    return (
      <View style={styles.joinContainer}>
        <TouchableOpacity
          onPress={()=>{
            let attending = event.attending;
            attending[currentUser.id] = true;
            fetch(`${BASE_URL}/events/${event.id}`, {
              method: "PUT",
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({attending: attending})
            })
            .then((response) => response.json())
            .then((data) => {
              if (DEV) {console.log('RES', data);}
              this.setState({
                event: data,
                going: true,
                signedUp: true,
                members: this.state.members.concat(this.props.currentUser)
              });
            });
          }}
          style={styles.joinButton}
        >
          {this._renderJoinIcon()}
          <Text style={styles.joinText}>{this.state.going ? "Going" : "RSVP"}</Text>
        </TouchableOpacity>
      </View>
    )
  }
  _createNotification(data){
    let {currentUser, event} = this.props;
    let url = `${BASE_URL}/notifications`;
    let notification = {
      type: 'comment',
      relatedUserIds: _.reject(Object.keys(event.attending), (id) => id == currentUser.id),
      message: `New comment in ${event.name}`,
      timestamp: new Date().valueOf(),
      eventId: event.id,
      groupId: event.groupId,
      seen: false,
    }
    fetch(url, {
      method: "POST",
      headers: {
        'Accept':'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notification)
    })
    .then((response) => response.json())
    .then((data) => {
      if (DEV) {console.log('NOTIFICATION', data);}
    })
  }
  _renderCommentForm(){
    return (
      <View style={styles.inputBox}>
        <TextInput
          ref="input"
          value={this.state.message}
          placeholder='Say something...'
          onChange={(e) => {this.setState({message: e.nativeEvent.text}); }}
          style={styles.input}
          />
        <TouchableOpacity
          style={this.state.message ? styles.buttonActive : styles.buttonInactive}
          underlayColor={Colors.brandPrimaryDark}
          onPress={()=>{
            let {currentUser} = this.props;
            let {message, event} = this.state;
            this.setState({message: ''});
            let {comments} = event;
            let comment = {
              avatarUrl: currentUser.avatarUrl,
              name: `${currentUser.firstName} ${currentUser.lastName}`,
              timestamp: new Date().valueOf(),
              text: message,
              replies: [],
              likes: {},
            };
            if (DEV) {console.log('COMMENT', comment);}
            fetch(`${BASE_URL}/events/${this.props.event.id}`, {
              method: "PUT",
              headers: {
                'Accept':'application/json',
                'Content-Type':'application/json',
              },
              body: JSON.stringify({comments: comments.concat(comment)})
            })
            .then((response) => response.json())
            .then((data) => {
              if (DEV) {console.log('DATA', data);}
              event.comments = comments.concat(comment);
              this.setState({event: event})
              this._createNotification(data)
            })
          }}
        >
          <Text style={Globals.submitButtonText}>Comment</Text>
        </TouchableOpacity>
      </View>
    )
  }
  _renderEmptyMap(){
    return (
      <View>
        <View style={[Globals.map, {backgroundColor: Colors.inactive}]}></View>
        <View style={styles.bottomPanel}>
          <Text style={styles.memberText}>{Object.keys(this.state.event.attending).length} going</Text>
        </View>
      </View>
    );
  }
  render(){
    let {group, currentUser, events} = this.props;
    let {event, members} = this.state;
    let isMember = group ? _.contains(currentUser.groupIds, group.id) : false;
    let isAdmin = group ? isMember && group.members[currentUser.id].admin : false;
    let isOwner = group ? isMember && group.members[currentUser.id].owner : false;
    if (DEV) {console.log('EVENTS', events, group);}
    let backButton = this._renderBackButton();
    return (
      <View style={styles.container}>
      <NavigationBar
        statusBar={{style: 'light-content', hidden: false}}
        title={{title: event.name, tintColor: 'white'}}
        tintColor={Colors.brandPrimary}
        leftButton={backButton}
      />
        <ScrollView style={styles.scrollView}>
        {this.state.showMap ? <EventLocation event={event} group={group}/> : this._renderEmptyMap()}
        <Text style={styles.h2}>Summary</Text>
        <Text style={[styles.h4, {paddingHorizontal: 20,}]}>{truncate(event.summary, 140)}</Text>
        <Text style={styles.h2}>Address</Text>
        <Text style={styles.h3}>{event.location ? event.location.city : ''}</Text>
        <Text style={styles.h2}>Date</Text>
        <Text style={styles.h3}>{moment(event.start).format('dddd, MMM Do, h:mm')}</Text>
        {! this.state.going || this.state.signedUp ? this._renderJoin() : null}
        <View style={styles.commentTitleContainer}>
          <Text style={styles.h2}>Comments </Text>
          <TouchableOpacity onPress={()=>this.setState({showCommentForm: ! this.state.showCommentForm})}>
            <Icon name="plus-circled" size={30} color="#bbb"/>
          </TouchableOpacity>
        </View>
        {this.state.showCommentForm ? this._renderCommentForm() : null}
        <CommentList comments={_.sortBy(event.comments, (c) => -c.timestamp)} {...this.props}/>
        <View style={styles.break}></View>
        <Text style={styles.h2}>Going</Text>
        <View style={styles.break}></View>
        {this.state.members.map((member, idx) => {
          if (DEV) {console.log('MEMBER', member)}
          let isOwner = group ? group.members[member.id].owner : false;
          let isAdmin = group ? group.members[member.id].admin : false;
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
  inputBox: {
    height: 60,
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
    marginBottom: 5,
  },
  input: {
    height: 40,
    padding: 8,
    flex: 1,
    fontSize: 18,
    margin: 10,
    marginRight: 5,
    borderColor: '#b4b4b4',
    borderRadius: 8,
    color: 'black',
    backgroundColor: 'white',
  },
  buttonActive: {
    flex: 0.4,
    backgroundColor: Colors.brandPrimary,
    borderRadius: 6,
    justifyContent: 'center',
    margin: 10,
  },
  buttonInactive: {
    flex: 0.4,
    backgroundColor: "#eeeeee",
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 6,
    justifyContent: 'center',
    margin: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    height: deviceHeight,
  },
  sentText:{
    fontSize: 14,
    padding: 10,
    marginRight: 15,
    fontWeight: '300',
  },
  scrollView: {
    flex: 1,
  },
  commentTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
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
