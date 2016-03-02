import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import Message from './message';
import {messageFixtures} from '../fixtures/messages';
import NavigationBar from 'react-native-navbar';
import {BASE_URL} from '../utilities/fixtures';
import _ from 'underscore';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  ListView,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  InteractionManager,
  Navigator,
  Dimensions,
  NativeModules,
  ActivityIndicatorIOS,
  DeviceEventEmitter,
  TextInput,
} from 'react-native';

let { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class MessageBox extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      messages: props.messages || [],
      newMessage: '',
      keyboardOffset: 0,
      users: [],
    }
  }
  _fetchMessages(){
    let {userIds} = this.props;
    let url = `${BASE_URL}/messages?{"participants":${JSON.stringify(userIds.sort())}}`;
    fetch(url, {
      method: "GET",
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json'
      }
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('MESSAGES', data);
      this.setState({messages: data})
    })
  }
  componentDidMount(){
    if (this.state.messages = []){
      this._fetchMessages()
    }
    InteractionManager.runAfterInteractions(() => {
      this.setState({loading: false});
    });
    this.refs.scroll.scrollTo(0);
    console.log('USER IDS', this.props.userIds);
    let url = `${BASE_URL}/users?{"id": {"$in": ${JSON.stringify(this.props.userIds)}}}`;
    fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type':'application/json'
      }
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('USERS', data);
      this.setState({users: data})
    })
    .catch((err) => {console.log('ERR: ', err)})
  }
  _keyboardWillShow(e){
    let newCoordinates = e.endCoordinates.height;
    this.setState({
      keyboardOffset: newCoordinates
    })
    this.refs.scroll.scrollTo(0);
  }
  _keyboardWillHide(e){
    this.setState({
      keyboardOffset: 0
    })
  }
  _renderLoading(){
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
      </View>
    )
  }
  _renderBackButton(){
    return (
      <TouchableOpacity onPress={()=>{
        this.props.navigator.pop();
      }}>
        <Icon name="ios-arrow-back" size={25} color="white" style={{paddingBottom: 3, paddingLeft: 20,}}/>
      </TouchableOpacity>
    )
  }
  _createNotification(data){
    let {currentUser} = this.props;
    let url = `${BASE_URL}/notifications`;
    let notification = {
      type: 'message',
      relatedUserIds: _.reject(data.participants, (p)=> p == currentUser.id),
      message: `You have a new message from ${data.senderName}`,
      timestamp: new Date().valueOf(),
      seen: false,
    }
    console.log('PARAMS', notification)
    fetch(url, {
      method: "POST",
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json'
      },
      body: JSON.stringify(notification)
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('NOTIFICATION', data);
    })
  }
  render(){
    let {currentUser,} = this.props;
    let {messages, users,} = this.state;
    let username = users.map((usr) => usr.firstName).join(', ');
    let titleConfig = {title: username, tintColor: 'white'}
    let back = this._renderBackButton();
    return (
      <View style={styles.container}>
        <NavigationBar
          tintColor={Colors.brandPrimary}
          title={titleConfig}
          leftButton={back}
        />
        <InvertibleScrollView ref="scroll">
          {messages.map((msg, idx) => {
            let user = _.find(this.state.users.concat(this.props.currentUser), (usr) => `${usr.firstName} ${usr.lastName}` == msg.senderName)
            console.log('USER', user);
            return (
              <Message message={msg} user={user} key={idx} navigator={this.props.navigator}/>
            )
          })}
        </InvertibleScrollView>
        <View style={styles.inputBox}>
          <TextInput
            value={this.state.newMessage}
            placeholder='Say something...'
            onChange={(e) => {this.setState({newMessage: e.nativeEvent.text}); }}
            style={styles.input}
            />
          <TouchableHighlight
            style={this.state.newMessage ? styles.buttonActive : styles.buttonInactive}
            underlayColor='#D97573'
            onPress={()=>{
              let msg = {
                text: this.state.newMessage,
                participants: this.state.users.map((usr)=>usr.id).concat(currentUser.id),
                createdAt: new Date().valueOf(),
                senderName: `${currentUser.firstName} ${currentUser.lastName}`,
                senderAvatar: currentUser.avatarUrl
              }
              let url = `${BASE_URL}/messages`
              fetch(url, {
                method: "POST",
                headers: {
                  'Accept':'application/json',
                  'Content-Type':'application/json'
                },
                body: JSON.stringify(msg)
              })
              .then((response) => response.json())
              .then((data) => {
                console.log('MSG', data);
                this.setState({
                  messages: this.state.messages.concat(data),
                  newMessage: '',
                })
                this._createNotification(data)
              })
              .catch((err) => {console.log('ERR: ', err)})
            }}
          >
            <Text style={styles.buttonText}>Send</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  inputBox: {
    height: 60,
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

module.exports = MessageBox;
