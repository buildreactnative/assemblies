import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {DEV, BASE_URL, HEADERS} from '../utilities/fixtures';
import _ from 'underscore';

import React, {
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeModules,
  ActivityIndicatorIOS,
} from 'react-native';

export default class MessageRow extends Component{
  render(){
    let {rowData, otherUser, users} = this.props;
    return (
      <TouchableOpacity onPress={()=>{
        this.props.navigator.push({
          name: 'Message',
          userIds: rowData.participants,
          messageUsers: users
        })
      }}>
        <View style={styles.messageContainer}>
          {otherUser ? <Image style={styles.profile} source={{uri: otherUser.avatarUrl}}/> : <Image style={styles.profile}/>}
          <View style={styles.fromContainer}>
            <View style={styles.messageContainer}>
              <Text style={styles.fromText}>{otherUser ? otherUser.firstName : rowData.senderName}</Text>
              <Text style={styles.sentText}>{moment(new Date(parseInt(rowData.createdAt))).fromNow()}</Text>
            </View>
            <Text style={styles.messageText}>{rowData.text}</Text>
          </View>
        </View>
        <View style={{flex: 0.5}}>
          <Icon size={30} name="ios-arrow-forward" color="#777"/>
        </View>
      </TouchableOpacity>
    )
  }
}

let styles = StyleSheet.create({
  sentText:{
    fontSize: 14,
    padding: 10,
    marginRight: 15,
    fontWeight: '300',
  },
  fromContainer:{
    justifyContent: 'center',
    marginLeft: 10,
    flex: 1,
  },
  fromText:{
    fontSize: 16,
    fontWeight: '500',
  },
  messageTextContainer:{
  },
  messageText:{
    fontSize: 18,
    fontWeight: '300',
  },
  messageContainer:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile:{
    width: 50,
    height: 50,
    borderRadius: 25,
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
