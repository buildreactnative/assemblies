import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import NavigationBar from 'react-native-navbar';
import Animatable from 'react-native-animatable';
import NoMessages from './no_messages';
import MessageRow from './message_row';
import {DEV, BASE_URL, HEADERS} from '../utilities/fixtures';
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
  Navigator,
  Dimensions,
  NativeModules,
  ActivityIndicatorIOS,
} from 'react-native';

class MessagesList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      messageUsers: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
      })
      .cloneWithRows([])
    }
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.messages != this.props.messages){
      this._loadConversations(nextProps);
    }
  }
  _loadConversations(props){
    console.log('MESSAGES', props.messages);
    let conversations = {};
    let userIds = [];
    props.messages.forEach((msg) => {
      let key = msg.participants.sort().join(':');
      userIds = userIds.concat(msg.participants);
      if (conversations[key]){
        conversations[key].push(msg)
      } else {
        conversations[key] = [msg];
      }
    })
    if (DEV) {console.log('CONVERSATIONS', conversations);}
    let dataBlob = [];
    Object.keys(conversations).forEach((c) => {
      dataBlob.push(conversations[c])
    });
    let url = `${BASE_URL}/users?{"id": {"$in": ${JSON.stringify(userIds)}}}`;
    fetch(url, {
      method: "GET",
      headers: HEADERS,
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({
        dataSource: new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
        })
        .cloneWithRows(dataBlob.map((d) => d[0])),
        conversations: conversations,
        messageUsers: data
      });
    })
    .catch((err) => {
      if (DEV) {console.log("ERR:", err);}
    })
    .done();
  }
  componentDidMount(){
    this._loadConversations(this.props);
  }
  _renderRow(rowData){
    let {currentUser} = this.props;
    let users = _.reject(this.state.messageUsers, (usr) => {
      return  ! _.contains(rowData.participants, usr.id);
    });
    let otherUser = _.find(users, (usr) => usr.id != currentUser.id);
    return (
      <MessageRow
        otherUser={otherUser}
        users={users}
        navigator={this.props.navigator}
        rowData={rowData}
      />
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
  _renderListView(){
    return (
      <ListView
        dataSource={this.state.dataSource}
        contentInset={{bottom: 49}}
        automaticallyAdjustContentInsets={false}
        ref="messagesList"
        renderRow={this._renderRow.bind(this)}
      />
    )
  }
  _renderNoMessages(){
    if (this.props.fetchedMessages && ! this.props.messages.length) {
      return(
        <NoMessages text={'You dont have any messages yet. You can start a conversation from within one of your groups.'}/>
      );
    } else {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicatorIOS size="large" />
        </View>
      );
    }
  }
  render(){
    let titleConfig = {title: 'Messages', tintColor: 'white'};
    let back = this._renderBackButton();
    let listView = this._renderListView();
    return (
      <View style={styles.container}>
        <NavigationBar
          statusBar={{style: 'light-content', hidden: false}}
          tintColor={Colors.brandPrimary}
          title={titleConfig}
        />

        {_.keys(this.state.dataSource._dataBlob.s1).length ? this._renderListView() : this._renderNoMessages()}
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

module.exports = MessagesList;
