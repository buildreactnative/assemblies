import _              from 'underscore';
import {truncate}     from 'underscore.string';
import Icon           from 'react-native-vector-icons/Ionicons';
import NavigationBar  from 'react-native-navbar';
import moment         from 'moment';
import CommentList    from './comment_list';
import EventLocation  from './event_location';
import Colors         from '../styles/colors';
import Globals        from '../styles/globals';
import Summary        from '../ui_helpers/summary';
import Address        from '../ui_helpers/address';
import EventDate      from '../ui_helpers/event_date';
import CommentHeader  from '../ui_helpers/comment_header';
import {BASE_URL, DEV, HEADERS} from '../utilities/fixtures';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeModules,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export default class Event extends Component{
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
        headers: HEADERS,
      })
      .then((response) => response.json())
      .then((data) => {
        if (DEV) {console.log('DATA USERS', data)}
        this.setState({members: data, showMap: true})
      })
      .catch((error) => {
        if (DEV) {console.log(error)}
        this.setState({showMap: true})
      }).done();
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
              headers: HEADERS,
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
    let userIds = _.reject(Object.keys(event.attending), (id) => id == currentUser.id);
    let relatedUserIds = {};
    userIds.forEach((id) => {
      relatedUserIds[id] = {seen: false};
    });
    relatedUserIds[currentUser.id] = {seen: true};
    let notification = {
      type            : 'comment',
      relatedUserIds  : relatedUserIds,
      userIdString    : userIds.sort().join(':'),
      message         : `New comment in ${event.name}`,
      timestamp       : new Date().valueOf(),
      eventId         : event.id,
      groupId         : event.groupId,
      seen            : false,
    };
    fetch(url, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(notification)
    })
    .then((response) => response.json())
    .then((data) => {
      if (DEV) {console.log('NOTIFICATION', data);}
    })
    .catch((err) => {
      if (DEV) {console.log('ERR:', err);}
    }).done();
  }
  _renderCommentForm(){
    return (
      <View style={[styles.inputBox, {opacity: this.state.showCommentForm ? 0 : 1}]}>
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
              headers: HEADERS,
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
    let longText = "Locavore vice readymade photo booth four loko. Drinking vinegar chia lomo cray. Try-hard cardigan bespoke, cold-pressed chillwave letterpress single-origin coffee knausgaard. Hammock tumblr lomo ethical post-ironic, XOXO PBR&B cray banh mi master cleanse farm-to-table. Celiac marfa echo park YOLO, drinking vinegar fap etsy mixtape chillwave jean shorts microdosing knausgaard pinterest. Gluten-free butcher 3 wolf moon humblebrag, occupy deep v schlitz mustache williamsburg portland selvage polaroid selfies chicharrones. Aesthetic kombucha flexitarian taxidermy portland PBR&B, green juice lo-fi.";
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
        <Summary summary={event.summary}/>
        <Address location={event.location}/>
        <EventDate start={event.start} />

        {! this.state.going || this.state.signedUp ? this._renderJoin() : null}
        <CommentHeader
          isToggled={this.state.showCommentForm}
          event={event}
          {...this.props}
          openCommentForm={()=>{
            console.log('OPEN COMMENT FORM');
            this.setState({showCommentForm: true})
          }}
          toggleCommentForm={()=> {this.setState({showCommentForm: ! this.state.showCommentForm})}}/>


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
        { this._renderCommentForm() }
      </View>
    )
  }
}

let styles = StyleSheet.create({
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
    backgroundColor: Colors.inactive,
  },
  inputBox: {
    height: 60,
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
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
    backgroundColor: Colors.brandPrimaryDark,
    opacity: 0.8,
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  memberText: {
    textAlign: 'center',
    color: 'white',
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
    marginVertical: 10,
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
});
