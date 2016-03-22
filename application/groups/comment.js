import Icon             from 'react-native-vector-icons/Ionicons';
import moment           from 'moment';
import {truncate}       from 'underscore.string';
import _                from 'underscore';
import CommentReplies   from './comment_replies';
import Message          from '../messages/message';
import Colors           from '../styles/colors';
import {BASE_URL, DEV}  from '../utilities/fixtures';

import React, {
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  NativeModules,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export default class Comment extends Component{
  constructor(props){
    super(props);
    this.state = {
      isReply     : false,
      animation   : new Animated.Value(),
      message     : '',
      comment     : props.comment,
      showReplies : false,
      measured    : false,
      minHeight   : 0,
    }
  }
  _toggle(){
    let initialValue = this.props.showReplies ? this.state.maxHeight : this.state.minHeight;
    let finalValue = this.props.showReplies ? this.state.minHeight : this.state.maxHeight;
    this.state.animation.setValue(initialValue);
    if (this.props.comment.replies.length){
      Animated.spring(
        this.state.animation, {
          toValue: finalValue
        }
      ).start();
    }
  }
  _likeComment(){
    let {comment} = this.props;
    if (DEV) {console.log('LIKE COMMENT', comment);}
    if (comment.likes[this.props.currentUser.id]) {
      comment.likes[this.props.currentUser.id] = false;
    } else {
      comment.likes[this.props.currentUser.id] = true;
    }
    this.props.changeComment(comment);
  }
  _toggleReplies(){
    let {comment} = this.props;
    this.setState({showReplies: ! this.state.showReplies});
    if (DEV) {console.log('TOGGLE REPLIES', comment);}
  }
  _writeReply(){
    let {comment} = this.props;
    if (DEV) {console.log('WRITE REPLY', comment);}
    this.props.writeReply(comment);
  }
  _renderReplies(){
    let {comment} = this.props;
    return (
      <Animated.View style={{height: this.state.animation}}>
        {comment.replies.map((reply, idx) => {
          let message, user;
          message = {
            createdAt: reply.timestamp,
            text: reply.text
          };
          user = _.find(this.props.groupUsers, (u) => `${u.firstName} ${u.lastName}` == reply.name);
          return (
            <Message message={message} user={user} {...this.props}/>
          )
        })}
      </Animated.View>
    );
  }
  _setMaxHeight(event){
    if (!! event.nativeEvent && event.nativeEvent.layout.height > this.state.maxHeight){
      this.setState({
        maxHeight : event.nativeEvent.layout.height,
        measured  : true,
      });
    }
  }
  _renderHidden(){
    let {comment} = this.props;
    return (
      <View style={{opacity: 1, position: 'absolute'}} onLayout={this._setMaxHeight.bind(this)}>
        {comment.replies.map((reply, idx) => {
          let message, user;
          message = {
            createdAt: reply.timestamp,
            text: reply.text
          };
          user = _.find(this.props.groupUsers, (u) => `${u.firstName} ${u.lastName}` == reply.name);
          return (
            <Message message={message} user={user} {...this.props}/>
          )
        })}
      </View>
    );
  }
  render(){
    let {comment} = this.props;
    let message = {
      createdAt: comment.timestamp,
      text: comment.text
    };
    let user = _.find(this.props.groupUsers, (u) => `${u.firstName} ${u.lastName}` == comment.name);
    return (
      <View>
        <Message message={message} user={user} {...this.props}/>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={this._likeComment.bind(this)}
            style={styles.iconBox}>
            <Icon name='ios-heart' color={Colors.bodyTextLight} size={25}/>
            <Text style={styles.iconText}>{_.filter(_.keys(comment.likes), (k) => comment.likes[k] == true).length}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this._toggleReplies.bind(this)}
            style={styles.iconBox}>
            <Icon name='reply' color={Colors.bodyTextLight} size={25}/>
            <Text style={styles.iconText}>{comment.replies.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this._writeReply.bind(this)}
            style={styles.iconBox}>
            <Icon name='edit' color={Colors.bodyTextLight} size={20}/>
          </TouchableOpacity>
        </View>
        {this.state.showReplies ? this._renderReplies() : this._renderHidden()}
        <View>
          <View style={styles.border}/>
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  iconBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  iconText: {
    paddingHorizontal: 5,
    fontSize: 12,
    color: Colors.bodyTextLight,
    fontWeight: '300',
  },
  sentText:{
    fontSize: 14,
    padding: 10,
    marginRight: 15,
    fontWeight: '300',
  },
  border: {
    height: 0,
    marginTop: 4,
    borderBottomWidth: 1,
    width: deviceWidth * 0.95,
    borderBottomColor: Colors.inactive,
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
});
