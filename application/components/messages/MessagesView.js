import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ListView } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import { find } from 'underscore';

import Colors from '../../styles/colors';
import { FakeConversations, FakeUsers, currentUser } from '../../fixtures';
import { globals, messagesStyles } from '../../styles';
import { rowHasChanged } from '../../utilities';

const styles = messagesStyles;

class Conversations extends Component{
  constructor(){
    super();
    this._renderRow = this._renderRow.bind(this);
    this.dataSource = this.dataSource.bind(this);
  }

  _renderRow(conversation){
    let otherUserID = find([conversation.user1Id, conversation.user2Id], (id) => id !== currentUser.id);
    let user = find(FakeUsers, ({ id }) => id === otherUserID);
    return (
      <TouchableOpacity style={globals.flexContainer}>
        <View style={globals.flexRow}>
          <Image style={globals.avatar} source={{uri: user.avatar}}/>
          <View style={globals.flex}>
            <View style={globals.textContainer}>
              <Text style={styles.h5}>{user.firstName} {user.lastName}</Text>
              <Text style={styles.h6}>{moment(conversation.lastMessageDate).fromNow()}</Text>
            </View>
            <Text style={styles.h4}>{conversation.lastMessageText.substring(0, 40)}...</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Icon size={30} name="ios-arrow-forward" color={Colors.bodyTextLight}/>
          </View>
        </View>
        <View style={styles.divider}/>
      </TouchableOpacity>
    )
  }
  dataSource(){
    return (
      new ListView.DataSource({ rowHasChanged: rowHasChanged }).cloneWithRows(FakeConversations)
    );
  }
  render() {
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          title={{ title: 'Messages', tintColor: 'white' }}
          tintColor={Colors.brandPrimary}
        />
        <ListView
          dataSource={this.dataSource()}
          contentInset={{ bottom: 49 }}
          renderRow={this._renderRow}
        />
      </View>
    );
  }
};

export default Conversations;
