import _              from 'underscore';
import Icon           from 'react-native-vector-icons/Ionicons';
import moment         from 'moment';
import {truncate}     from 'underscore.string';
import Comment        from './comment';
import Colors         from '../styles/colors';

import React, {
  Component,
  StyleSheet,
  Text,
  View,
  Dimensions,
  NativeModules,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class CommentList extends React.Component{
  _renderRow(comment, idx){
    return (
      <Comment {...this.props} comment={comment} key={idx} {...this.props} />
    );
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
    backgroundColor: 'white',
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
  }

}

module.exports = CommentList;
