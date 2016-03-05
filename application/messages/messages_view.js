import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import MessagesList from './messages_list';
import MessageBox from './message_box';
import Profile from './profile';
import Groups from '../groups/groups';
import Group from '../groups/group';
import CreateGroup from '../groups/create_group';
import CreateEvent from '../groups/create_event';
import GroupMembers from '../groups/group_members';
import GroupEvents from '../groups/group_events';
import CreateEventConfirm from '../groups/create_event_confirm';
import CreateGroupConfirm from '../groups/create_group_confirm';
import Event from '../groups/event';
import _ from 'underscore';
import {conversationFixtures,} from '../fixtures/messages';
import {BASE_URL} from '../utilities/fixtures';

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
  Navigator,
  Dimensions,
  NativeModules,
} from 'react-native';

let { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const BASE_CONFIG = Navigator.SceneConfigs.HorizontalSwipeJump;

const CUSTOM_CONFIG = BASE_CONFIG;
// console.log(Navigator.SceneConfigs)

class MessagesView extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
      })
      .cloneWithRows([]),
      conversations: {},
    }
  }
  componentDidMount(){
    let {currentUser} = this.props;
    let url = `${BASE_URL}/messages`
    fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type':'application/json'
      }
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('MESSAGES', data);
      let conversations = {};
      data.forEach((msg) => {
        let key = msg.participants.sort().join(':');
        if (conversations[key]){
          conversations[key].push(msg)
        } else {
          conversations[key] = [msg];
        }
      })
      console.log('CONVERSATIONS', conversations);
      let dataBlob = [];
      Object.keys(conversations).forEach((c) => {
        dataBlob.push(conversations[c])
      })
      console.log('DATA BLOB', dataBlob.map((d) => d[0]))
      this.setState({
        dataSource: new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
        })
        .cloneWithRows(dataBlob.map((d) => d[0])),
        conversations: conversations
      })
    })
    .catch((err) => {console.log('ERR: ', err)})
  }

  render(){
    console.log('DATA SOURCE', this.state.dataSource);
    return (
      <View style={styles.container}>
        <Navigator
          initialRoute={{
            name: 'MessageList'
          }}
          configureScene={(route, routeStack) => {
            return CUSTOM_CONFIG;
          }}
          renderScene={(route, navigator) => {
            if (route.name == 'MessageList') {
              return (
                <MessagesList dataSource={this.state.dataSource} navigator={navigator} />
              )
            } else if (route.name == 'Message'){
              let {userIds} = route;
              let otherUserIds = _.reject(userIds, (id) => id == this.props.currentUser.id)
              return (
                <MessageBox
                  userIds={userIds}
                  {...this.props}
                  messages={this.state.conversations[userIds.sort().join(':')]}
                  navigator={navigator}
                />
              )
            } else if (route.name == 'Profile') {
              return (
                <Profile navigator={navigator} user={route.user} username={route.username} avatar={route.avatar} />
              )
            } if (route.name == 'Groups') {
              return (
                <Groups
                  {...this.props}
                  {...this.state}
                  navigator={navigator}
                  addUserToGroup={()=>{console.log('ADD USER TO GROUP')}}
                />
              )
            } else if (route.name == 'CreateGroup'){
              return <CreateGroup {...this.props} navigator={navigator} />
            } else if (route.name == 'Group') {
              return (
                <Group
                  addUserToGroup={()=>{console.log('ADD USER TO GROUP')}}
                  {...this.props}
                  {...route}
                  {...this.state}
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
                  createGroup={()=> {console.log('CREATE GROUP')}}
                  navigator={navigator}
                />
              )
            } else if (route.name == 'Event') {
              return (
                <Event {...route} {...this.props} {...this.state} navigator={navigator} />
              )
            } else if (route.name == 'Chat') {
              let userIds = [this.props.currentUser.id, route.user.id]
              let otherUserIds = _.reject(userIds, (id) => id == this.props.currentUser.id)
              return (
                <MessageBox
                  user={route.user}
                  userIds={userIds}
                  messages={this.state.conversations[userIds.sort().join(':')]}
                  {...this.props}
                  navigator={navigator}/>
              )
            }
          }}
        >
        </Navigator>

      </View>
    )
  }
}

let styles = {
  sentText:{
    fontSize: 14,
    padding: 10,
    marginRight: 15,
    fontWeight: '300',
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
}

module.exports = MessagesView;
