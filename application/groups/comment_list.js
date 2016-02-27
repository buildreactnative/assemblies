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
      <View key={idx} style={styles.messageBox}>
        <View style={styles.messageContainer}>
          <Image style={styles.profile} source={{uri: comment.avatarUrl}}/>
          <View style={styles.messageTextContainer}>
            <View style={styles.fromContainer}>
              <Text style={styles.fromText}>{comment.name}</Text>
              <Text style={styles.sentText}>{moment(comment.timestamp).fromNow()}</Text>
            </View>
            <Text style={styles.messageText}>{comment.text}</Text>
            <View style={styles.fromContainer}>
              <Text style={styles.commentDataText}>{comment.replies.length} replies</Text>
              <Text style={styles.commentDataText}>{Object.keys(comment.likes).length} likes</Text>
            </View>
          </View>
        </View>
        <View style={styles.reactionContainer}>
          <TouchableOpacity style={styles.reactionBox}>
            <Icon name="thumbsup" color="#999" size={30}/>
            <Text style={styles.reactionText}> Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reactionBox}>
            <Icon name="android-chat" color="#999" size={30}/>
            <Text style={styles.reactionText}> Reply</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reactionBox}>
            <Icon name="ios-flag" color="#999" size={30}/>
            <Text style={styles.reactionText}> Flag</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  render(){
    return (
      <View style={styles.commentsBox}>
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
  commentsBox: {
    backgroundColor: 'f2f2f2',
    padding: 5,
  },
  commentDataText: {
    fontSize: 14,
    fontWeight: '300',
    marginHorizontal: 20,
    paddingVertical: 10,
    textAlign: 'center',
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
  messageBox: {
    backgroundColor: 'white',
    margin: 5,
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
  reactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reactionBox: {
    backgroundColor: '#eee',
    padding: 10,
    borderWidth: 1,
    width: deviceWidth / 3,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  reactionText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '400',
    color: '#777'
  }

}

module.exports = CommentList;
