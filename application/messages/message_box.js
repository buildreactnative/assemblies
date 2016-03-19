import Colors                 from '../styles/colors';
import Globals                from '../styles/globals';
import Icon                   from 'react-native-vector-icons/Ionicons';
import moment                 from 'moment';
import InvertibleScrollView   from 'react-native-invertible-scroll-view';
import Message                from './message';
import {messageFixtures}      from '../fixtures/messages';
import NavigationBar          from 'react-native-navbar';
import _                      from 'underscore';
import {BASE_URL, DEV, HEADERS} from '../utilities/fixtures';

import React, {
  Component,
  StyleSheet,
  Text,
  Easing,
  View,
  TouchableOpacity,
  InteractionManager,
  Dimensions,
  NativeModules,
  Animated,
  ActivityIndicatorIOS,
  TextInput,
} from 'react-native';

let { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export default class MessageBox extends Component{
  constructor(props){
    super(props);
    this.state = {
      loading           : true,
      newMessage        : '',
      messages          : props.messages,
      keyboardOffset    : 0,
      users             : props.messageUsers,
      height            : new Animated.Value(0),
    }
  }
  _fetchMessages(){
    let {userIds} = this.props;
    let url = `${BASE_URL}/messages?{"participantsString":${userIds.sort().join(':')}}`;
    fetch(url, {method: "GET", headers: HEADERS,})
    .then((response) => response.json())
    .then((data) => {
      if (DEV) {console.log('MESSAGES', data);}
      if (data != this.state.messages){
        this.setState({messages: data})
      }
    })
    .catch((err) => {
      if (DEV) {console.log('ERR: ', err);}
    }).done();
  }
  _fetchUsers(){
    let url = `${BASE_URL}/users?{"id": {"$in": ${JSON.stringify(this.props.userIds)}}}`;
    fetch(url, {method: "GET", headers: HEADERS})
    .then((response) => response.json())
    .then((data) => {
      if (DEV) {console.log('USERS', data);}
      this.setState({users: data})
    })
    .catch((err) => {
      if (DEV) {console.log('ERR: ', err)}
    }).done();
  }
  inputFocused(refName) {
    console.log('FOCUS INPUT', Easing);
    Animated.timing(
      this.state.height,
      {
        toValue: 200,
        duration: 300,
        easing :  Easing.in(Easing.linear)
      },
    ).start();
  }
  inputBlur(refName){
    Animated.timing(
      this.state.height,
      {
        toValue: 0,
        duration: 150,
        easing: Easing.out(Easing.linear)
      }
    ).start();
  }
  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      if (this.state.messages = []){
        this._fetchMessages();
      }
      if (! this.state.messageUsers) {
        this._fetchUsers();
      }
      this.setState({loading: false});
    });
    this.refs.scroll.scrollTo(0);
  }
  _renderLoading(){
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
        <ActivityIndicatorIOS size='large'/>
      </View>
    );
  }
  _renderBackButton(){
    return (
      <TouchableOpacity onPress={()=>{
        this.props.navigator.pop();
      }}>
        <Icon name="ios-arrow-back" size={25} color="white" style={{paddingBottom: 3, paddingLeft: 20,}}/>
      </TouchableOpacity>
    );
  }
  _createMessage(){
    let {currentUser} = this.props;
    let uniqueParticipants = _.uniq(this.state.users.map((usr)=>usr.id)).sort()
    if (uniqueParticipants.length < 2) {
      return; // don't allow users to message themselves
    }
    let msg = {
      text                : this.state.newMessage,
      participants        : uniqueParticipants,
      participantsString  : uniqueParticipants.join(':'),
      createdAt           : new Date().valueOf(),
      senderName          : `${currentUser.firstName} ${currentUser.lastName}`,
      senderAvatar        : currentUser.avatarUrl,
      senderId            : currentUser.id,
    }
    let url = `${BASE_URL}/messages`
    fetch(url, { method: 'POST', headers: HEADERS, body: JSON.stringify(msg) })
    .then((response) => response.json())
    .then((data) => {
      if (DEV) {console.log('MSG', data);}
      this.setState({newMessage: '',});
      this.props.sendData({messages: this.props.messages.concat(data)})
      this._createNotification(data)
    })
    .catch((err) => {
      if (DEV) {console.log('ERR: ', err)}
    }).done();
  }
  _createNotification(data){
    let {currentUser} = this.props;
    let url = `${BASE_URL}/notifications`;
    let relatedUserIds = {};
    data.participants.forEach((p) => {
      relatedUserIds[p] = {seen: false}
    })
    relatedUserIds[currentUser.id].seen = true;
    let notification = {
      type              : 'message',
      relatedUserIds    : relatedUserIds,
      message           : `You have a new message from ${data.senderName}`,
      timestamp         : new Date().valueOf(),
    }
    if (DEV) {console.log('PARAMS', notification)}
    fetch(url, { method: "POST", headers: HEADERS, body: JSON.stringify(notification)})
    .then((response) => response.json())
    .then((data) => {
      if (DEV) {console.log('NOTIFICATION', data);}
    })
    .catch((err) => {
      if (DEV) {console.log('ERR: ', err);}
    }).done();
  }
  render(){
    console.log('MESSAGE BOX PROPS', this.props, this.state);
    let {currentUser, messages, messageUsers, userIds} = this.props;
    let username = messageUsers ? messageUsers.map((usr) => usr.firstName).join(', ') : '';
    let titleConfig = {title: username, tintColor: 'white'}
    let back = this._renderBackButton();
    return (
      <View style={styles.container}>
        <NavigationBar
          statusBar={{style: 'light-content', hidden: false}}
          tintColor={Colors.brandPrimary}
          title={titleConfig}
          leftButton={back}
        />
        <InvertibleScrollView ref="scroll">
          {_.reject(messages, (m) => m.participants.sort().join(':') != userIds.sort().join(':')).map((msg, idx) => {
            let user = _.find(this.state.users.concat(this.props.currentUser), (usr) => `${usr.firstName} ${usr.lastName}` == msg.senderName)
            if (DEV) {console.log('USER', user);}
            return (
              <Message message={msg} user={user} key={idx} navigator={this.props.navigator}/>
            )
          })}
        </InvertibleScrollView>
        <Animated.View style={[styles.inputBox, {bottom: this.state.height}]}>
          <TextInput
            ref="message"
            onFocus={this.inputFocused.bind(this, 'message')}
            onBlur={()=>{
              console.log('DONE EDITING');
              this.inputBlur();
            }}
            multiline={true}
            value={this.state.newMessage}
            placeholder='Say something...'
            onChange={(e) => {this.setState({newMessage: e.nativeEvent.text}); }}
            style={styles.input}
            />
          <TouchableOpacity
            style={this.state.newMessage ? styles.buttonActive : styles.buttonInactive}
            underlayColor='#D97573'
            onPress={this._createMessage.bind(this)}
          >
            <Text style={Globals.submitButtonText}>Send</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  inputBox: {
    height: 60,
    left: 0,
    right: 0,
    backgroundColor: '#F3EFEF',
    flexDirection: 'row',
    marginBottom: 50,
  },
  input: {
    height: 40,
    padding: 8,
    flex: 1,
    marginRight: 5,
    fontSize: 12,
    borderColor: '#E0E0E0',
    margin: 10,
    borderColor: '#b4b4b4',
    borderRadius: 8,
    color: 'black',
    backgroundColor: 'white',
  },
  buttonActive: {
    flex: 0.4,
    backgroundColor: "#E0514B",
    borderRadius: 6,
    justifyContent: 'center',
    margin: 10,
  },
  buttonInactive: {
    flex: 0.4,
    backgroundColor: "#E0514B",
    flex: 0.4,
    backgroundColor: "#E0514B",
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
  backButton: {
    position: 'absolute',
    left: 20,
  },
  backButtonText: {
    color: 'white',
  },
  fromContainer:{
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fromText:{
    fontSize: 16,
    fontWeight: '500',
  },
  messageTextContainer:{
    flex: 1,
  },
  messageText:{
    fontSize: 18,
    fontWeight: '300',
    paddingHorizontal: 15,
  },
  messageContainer:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile:{
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  container: {
    flex: 1,
  },
  header: {
    height: 70,
    backgroundColor: Colors.brandPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 22,
  },
});
