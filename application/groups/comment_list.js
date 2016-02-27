import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {truncate} from 'underscore.string';
import _ from 'underscore';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  TextInput,
  ListView,
  TouchableHighlight,
  View,
  TabBarIOS,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeModules,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class CommentList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
      })
      .cloneWithRows(props.comments)
    }
  }
  _renderRow(comment, idx){
    // console.log('DATA', comment);
    return (
      <TouchableOpacity key={idx}>
        <View style={styles.messageContainer}>
          <Image style={styles.profile} source={{uri: comment.avatarUrl}}/>
          <View style={styles.messageTextContainer}>
            <View style={styles.fromContainer}>
              <Text style={styles.fromText}>{comment.name}</Text>
              <Text style={styles.sentText}>{moment(comment.timestamp).fromNow()}</Text>
            </View>
            <Text style={styles.messageText}>{comment.text}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  render(){
    return (
      <View>
        {this.props.comments.map((comment, idx) => {
          return this._renderRow(comment, idx)
        })}
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

module.exports = CommentList;
