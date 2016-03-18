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

let { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export default class MessageRow extends Component{
  render(){
    let {rowData, otherUser, users} = this.props;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={()=>{
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
          <View style={{flex: 0.5, alignItems: 'flex-end', paddingRight: 25,}}>
            <Icon size={30} name="ios-arrow-forward" color={Colors.bodyTextLight}/>
          </View>
        </View>
        <View style={{alignItems: 'center',}}>
          <View style={styles.border}/>
        </View>
      </TouchableOpacity>
    )
  }
}

let styles = StyleSheet.create({
  sentText:{
    fontSize: 12,
    fontWeight: '300',
    color: Colors.bodyTextGray,
    marginLeft: 10,
    fontWeight: '300',
    marginLeft: 10
  },
  fromContainer:{
    justifyContent: 'center',
    marginLeft: 10,
    flex: 1,
  },
  border: {
    height: 0,
    borderBottomWidth: 1,
    width: deviceWidth * 0.95,
    borderBottomColor: Colors.inactive,
  },
  fromText:{
    fontSize: 12,
    fontWeight: '700'
  },
  messageTextContainer:{
  },
  messageText:{
    fontSize: 16,
    color: '#9B9B9B',
    fontStyle: 'italic',
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
