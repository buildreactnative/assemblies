import Colors                 from '../styles/colors';
import Globals                from '../styles/globals';
import Icon                   from 'react-native-vector-icons/Ionicons';
import moment                 from 'moment';
import InvertibleScrollView   from 'react-native-invertible-scroll-view';
import Message                from './message';
import {messageFixtures}      from '../fixtures/messages';
import NavigationBar          from 'react-native-navbar';
import _                      from 'underscore';
import KeyboardSpacer         from 'react-native-keyboard-spacer';
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
      messages          : props.messages || [],
      keyboardOffset    : 0,
      users             : props.messageUsers || [],
      height            : 50,
    }
  }
  _fetchMessages(){
    let {userIds} = this.props;
    let url = `${BASE_URL}/messages?{"participantsString":${JSON.stringify(userIds.sort().join(':'))}}`;
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
    })
    .done();
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
  componentWillReceiveProps(nextProps){
    if (nextProps.messages != this.state.messages && this.props.hasMessages){
      this.setState({messages: nextProps.messages});
    }
    if (nextProps.messageUsers != this.state.users && this.props.hasMessages){
      this.setState({users: nextProps.messageUsers});
    }
  }
  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      if (! this.props.hasMessages){
        this._fetchMessages();
      }
      if (! this.props.hasMessages) {
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
      this.setState({newMessage: '', messages: this.state.messages.concat(data)});
      this.props.sendData({messages: this.props.messages.concat(data)});
      this._createNotification(data);
      this.refs.message.blur();
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
      userIdString      : Object.keys(relatedUserIds).sort().join(':'),
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
  _renderScrollView(){
    let {currentUser, messageUsers, userIds} = this.props;
    let {messages} = this.state;
    return (
      <InvertibleScrollView
        inverted={true}
        contentContainerStyle={{paddingTop: 10}}
        ref="scroll">
        {_.reject(messages, (m) => m.participants.sort().join(':') != userIds.sort().join(':'))
          .sort((a, b) => {return b.createdAt - a.createdAt})
          .map((msg, idx) => {
          let user = _.find(this.state.users, (usr) => {return usr.id == msg.senderId});
          if (DEV) {console.log('USER', user, msg);}
          return (
            <Message message={msg} user={user} key={idx} navigator={this.props.navigator}/>
          )
        })}
      </InvertibleScrollView>
    );
  }
  render(){
    let {currentUser, messageUsers, userIds} = this.props;
    let {messages} = this.state;
    let username = messageUsers ? messageUsers.map((usr) => usr.firstName).join(', ') : this.state.users.map((usr) => usr.firstName).join(', ');
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
      {this.state.users.length && this.state.messages.length ? this._renderScrollView() : <InvertibleScrollView ref="scroll"/>}
        <View style={styles.inputBox}>
          <TextInput
            ref="message"
            multiline={true}
            value={this.state.newMessage}
            placeholder='Say something...'
            placeholderTextColor={Colors.bodyTextLight}
            onChange={(e) => {this.setState({newMessage: e.nativeEvent.text}); }}
            style={styles.input}
            />
          <TouchableOpacity
            style={this.state.newMessage ? styles.buttonActive : styles.buttonInactive}
            underlayColor='#D97573'
            onPress={this._createMessage.bind(this)}>
            <Text style={this.state.newMessage ? styles.submitButtonText : styles.inactiveButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
        <KeyboardSpacer topSpacing={-50}/>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  inputBox: {
    marginBottom: 50,
    height: 60,
    left: 0,
    right: 0,
    backgroundColor: '#F3EFEF',
    backgroundColor: Colors.inactive,
    flexDirection: 'row',
  },
  input: {
    height: 40,
    padding: 8,
    flex: 1,
    marginRight: 5,
    fontSize: 14,
    borderColor: '#E0E0E0',
    margin: 10,
    borderColor: '#b4b4b4',
    borderRadius: 8,
    color: Colors.bodyText,
    backgroundColor: 'white',
  },
  buttonActive: {
    flex: 0.4,
    backgroundColor: "#E0514B",
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
  submitButtonText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '400',
    color: 'white',
  },
  inactiveButtonText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '400',
    color: '#999'
  }
});
