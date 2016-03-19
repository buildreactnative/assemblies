'use strict';
import React from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import NavigationBar from 'react-native-navbar';
import _ from 'underscore';

let {
  AppRegistry,
  StyleSheet,
  Text,
  Animated,
  Easing,
  Image,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Navigator,
} = React;

class Message extends React.Component{
  render(){
    let {message, user} = this.props;
    console.log('PROPS', this.props);
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={()=>{
          this.props.navigator.push({
            name      : 'Profile',
            user      : this.props.user,
            username  : `${this.props.user.firstName} ${this.props.user.lastName}`,
            avatar    : this.props.user.avatarUrl,
          })
        }}>
          <Image
            style={styles.icon}
            source={{uri: user.avatarUrl}}
          />
        </TouchableOpacity>
        <View style={styles.messageBox}>
          <View style={styles.row}>
            <Text style={styles.author}>{`${user.firstName} ${user.lastName}`}</Text>
            <Text style={styles.sent}>{moment(new Date(parseInt(message.createdAt))).fromNow()}</Text>
          </View>
          <View style={styles.messageView}>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        </View>
      </View>
    )
  }
}
let styles = StyleSheet.create({
  container:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 10,
  },
  icon: {
    marginTop: 10,
    marginLeft: 13,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  messageBox: {
    flex: 1,
    alignItems: 'stretch',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
    marginTop: 10
  },
  messageView: {
    backgroundColor: 'white',
    flex: 1,
    paddingRight: 15
  },
  messageText: {
    fontSize: 16,
    fontWeight: '300',
  },
  author:{
    fontSize: 12,
    fontWeight: '700'
  },
  sent:{
    fontSize: 12,
    fontWeight: '300',
    color: '#9B9B9B',
    marginLeft: 10,
    color: '#9B9B9B',
    fontWeight: '300',
    marginLeft: 10
  }
})
module.exports = Message;
