import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import ActivityView from '../activity/activity_view';
import moment from 'moment';
import {BASE_URL, DEV} from '../utilities/fixtures';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeModules,
} from 'react-native';

class Notification extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      notification: props.notification
    }
  }
  _renderUnseen(){
    return (
      <TouchableOpacity
        onPress={()=>{
          let {notification} = this.state;
          let url = `${BASE_URL}/notifications/${notification.id}`;
          fetch(url, {
            method: "PUT",
            headers: {
              'Accept':'application/json',
              'Content-Type':'application/json'
            },
            body: JSON.stringify({seen: true})
          })
          .then((response) => response.json())
          .then((data) => {
            if (DEV){console.log('UPDATE NOTIFICATION', data);}
            this.setState({notification: data})
          })
        }}
        style={styles.seenCircle}>
      </TouchableOpacity>
    )
  }
  render(){
    let {notification} = this.state;
    let {type, message, seen} = notification;
    if (DEV){console.log('RENDERED NOTIFICATION', message);}
    return (
      <View style={styles.container}>
        <View style={{flex: 1,}}>
          <View style={styles.row}>
            {seen ? <View style={styles.emptySeen}></View> : this._renderUnseen()}
            <TouchableOpacity
              onPress={()=>{
                this.props.navigator.push({
                  name: type,
                  notification: notification,
                })
              }}
              style={styles.subjectTextContainer}>
              <Text style={styles.subjectText}>new {type}</Text>
            </TouchableOpacity>
            <Text style={styles.timeText}>{moment(new Date(parseInt(notification.timestamp))).fromNow()}</Text>
          </View>
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        </View>

        <View style={styles.timeContainer}>

          <TouchableOpacity style={styles.timeLink}>
            <Icon name="ios-arrow-forward" color="#777" size={25}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

let styles = {
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  seenCircle: {
    backgroundColor: Colors.brandPrimary,
    borderRadius: 7.5,
    width: 15,
    height: 15,
    marginHorizontal: 10,
  },
  emptySeen: {
    height: 15,
    width: 15,
    backgroundColor: 'white',
    marginHorizontal: 10,
  },
  subjectTextContainer: {
    marginRight: 5,
  },
  subjectText: {
    fontSize: 18,
    fontWeight: '500',
  },
  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingRight: 10,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '300',
    paddingHorizontal: 4,
  },
  timeLink: {
    paddingHorizontal: 10,
  },
  timeLinkText: {},
  messageContainer: {
    flex: 1,
  },
  messageText: {
    color: 'black',
    marginLeft: 35,
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '300',
  },
}
module.exports = Notification;
