import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {truncate} from 'underscore.string';
import _ from 'underscore';
import CommentReplies from './comment_replies';
import {BASE_URL} from '../utilities/fixtures';

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

class Comment extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isReply: false,
      message: '',
      comment: props.comment,
      showReplies: false,
    }
  }
  _renderReplyForm(){
    return (
      <View style={styles.inputBox}>
        <TextInput
          ref="input"
          value={this.state.message}
          placeholder='Say something...'
          onChange={(e) => {this.setState({message: e.nativeEvent.text}); }}
          style={styles.input}
          />
        <TouchableOpacity
          style={this.state.message ? styles.buttonActive : styles.buttonInactive}
          underlayColor={Colors.brandPrimaryDark}
          onPress={()=>{
            console.log('SUBMIT REPLY');
            let {currentUser, event} = this.props;
            let {message, comment} = this.state;
            this.setState({message: ''});
            let foundComments = _.reject(event.comments, (c) => {
              return (
                c.timestamp == comment.timestamp &&
                c.text      == comment.text      &&
                c.name      == comment.name
              )
            })
            // console.log('SUBMIT COMMENT', this.state.message, this.props.currentUser)
            let reply = {
              avatarUrl: currentUser.avatarUrl,
              name: `${currentUser.firstName} ${currentUser.lastName}`,
              timestamp: new Date().valueOf(),
              text: message,
            };

            comment.replies.push(reply)
            foundComments.push(comment);

            console.log('COMMENT', reply);
            fetch(`${BASE_URL}/events/${this.props.event.id}`, {
              method: "PUT",
              headers: {
                'Accept':'application/json',
                'Content-Type':'application/json',
              },
              body: JSON.stringify({comments: foundComments})
            })
            .then((response) => response.json())
            .then((data) => {
              console.log('DATA', data);
              this.setState({comment: comment, isReply: false})
            })
          }}
        >
          <Text style={styles.buttonText}>Reply</Text>
        </TouchableOpacity>
      </View>
    )
  }
  render(){
    let {comment} = this.props;
    console.log('COMMENT', comment);
    return (
      <View style={styles.messageBox}>
        <View style={styles.messageContainer}>
          <Image style={styles.profile} source={{uri: comment.avatarUrl}}/>
          <View style={styles.messageTextContainer}>
            <View style={styles.fromContainer}>
              <Text style={styles.fromText}>{comment.name}</Text>
              <Text style={styles.sentText}>{moment(comment.timestamp).fromNow()}</Text>
            </View>
            <Text style={styles.messageText}>{comment.text}</Text>
            <View style={styles.fromContainer}>
              <TouchableOpacity onPress={()=>this.setState({showReplies: ! this.state.showReplies})}>
                <Text style={styles.commentDataText}>{comment.replies.length} replies</Text>
              </TouchableOpacity>
              <Text style={styles.commentDataText}>{Object.keys(comment.likes).length} likes</Text>
            </View>
          </View>
        </View>
        {this.state.isReply ? this._renderReplyForm() : null  }
        <View style={styles.reactionContainer}>
          <TouchableOpacity style={styles.reactionBox} onPress={()=>{
            console.log('LIKE');
            let {currentUser, event} = this.props;
            let {message, comment} = this.state;
            this.setState({message: ''});
            let foundComments = _.reject(event.comments, (c) => {
              return (
                c.timestamp == comment.timestamp &&
                c.text      == comment.text      &&
                c.name      == comment.name
              )
            })
            // console.log('SUBMIT COMMENT', this.state.message, this.props.currentUser)

            comment.likes[currentUser.id] = true;
            foundComments.push(comment);

            fetch(`${BASE_URL}/events/${this.props.event.id}`, {
              method: "PUT",
              headers: {
                'Accept':'application/json',
                'Content-Type':'application/json',
              },
              body: JSON.stringify({comments: foundComments})
            })
            .then((response) => response.json())
            .then((data) => {
              console.log('DATA', data);
              this.setState({comment: comment})
            })
          }}>
            <Icon name="thumbsup" color="#999" size={30}/>
            <Text style={styles.reactionText}> Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reactionBox} onPress={()=>this.setState({isReply: !this.state.isReply})}>
            <Icon name="android-chat" color="#999" size={30}/>
            <Text style={styles.reactionText}> Reply</Text>
          </TouchableOpacity>
        </View>
        {this.state.showReplies ? <CommentReplies replies={comment.replies}/> : null}
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
    paddingHorizontal: 15,
  },
  messageTextContainer:{
    flex: 1,
  },
  messageText:{
    fontSize: 18,
    fontWeight: '300',
    paddingHorizontal: 15,
  },
  replyText: {
    fontSize: 16,
    fontWeight: '300',
    paddingHorizontal: 15,
    paddingVertical: 4,
    marginBottom: 10,
  },
  messageBox: {
    backgroundColor: 'white',
  },
  messageContainer:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#999',
  },
  profile:{
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  replyProfile: {
    width: 30,
    height: 30,
    borderRadius: 15,
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
    width: deviceWidth / 2,
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
  },
  backButton: {
    paddingLeft: 20,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  addButton: {
    backgroundColor: 'transparent',
    paddingRight: 20,
    paddingBottom: 10,
  },
  container: {
    flex: 1,
  },
  inputBox: {
    height: 60,
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
  },
  input: {
    height: 40,
    padding: 8,
    flex: 1,
    fontSize: 18,
    margin: 10,
    marginRight: 5,
    borderColor: '#b4b4b4',
    borderRadius: 8,
    color: 'black',
    backgroundColor: 'white',
  },
  buttonActive: {
    flex: 0.4,
    backgroundColor: Colors.brandPrimary,
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
  scrollView: {
    flex: 1,
  },
  commentTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
  },
  topImage: {
    width: deviceWidth,
    height: 200,
    flexDirection: 'column',
  },
  overlayBlur: {
    backgroundColor: '#333',
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  h1: {
    fontSize: 22,
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomPanel: {
    flex: 0.3,
    backgroundColor: 'white',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberText: {
    textAlign: 'center',
    color: Colors.brandPrimary,
    fontSize: 18,
    fontWeight: '400',
  },
  h4: {
    fontSize: 18,
    fontWeight: '300',
  },
  h3: {
    fontSize: 18,
    color: Colors.brandPrimary,
    paddingHorizontal: 18,
    paddingVertical: 5,
    fontWeight: '500',
  },
  break: {
    height: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginHorizontal: 15,
    marginVertical: 5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '300',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  eventContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  joinContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  joinButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: Colors.brandPrimary,
  },
  joinText: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlign: 'center',
  },
  joinIcon: {
    paddingVertical: 10,
  },
  eventInfo: {
    flex: 1,
  },
  h5: {
    fontSize: 18,
    fontWeight: '500',
  },
  goingContainer: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goingText: {
    fontSize: 17,
    color: Colors.brandPrimary
  },
  memberContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  avatar: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  memberInfo: {
    paddingLeft: 30,
  },
}

module.exports = Comment;
