import _              from 'underscore';
import {truncate}     from 'underscore.string';
import Icon           from 'react-native-vector-icons/Ionicons';
import moment         from 'moment';
import Colors         from '../styles/colors';
import Globals        from '../styles/globals';
import CommentList    from '../groups/comment_list';
import {BASE_URL, DEV, HEADERS} from '../utilities/fixtures';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  NativeModules,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export default class CommentHeader extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      animation: new Animated.Value(51),
      measured: false,
      renderedComments: {},
      maxHeight: 51,
      minHeight: 51,
    };
  }
  componentWillReceiveProps(nextProps){
    if (DEV) {console.log('NEXT PROPS COMMENT HEADER', this.props.event.comments, nextProps.event.comments);}
    if (nextProps.isToggled != this.props.isToggled){
      if (DEV) {console.log('TOGGLE NOW')}
      this._toggle();
    }
    if (nextProps.event.comments != this.props.event.comments){
      // if (DEV) {console.log('CHANGE COMMENTS LENGTH');}
    }
  }
  _toggle(){
    let initialValue = this.props.isToggled ? this.state.maxHeight : this.state.minHeight;
    let finalValue = this.props.isToggled ? this.state.minHeight : this.state.maxHeight;
    if (DEV) {console.log('FINAL VALUE', finalValue)}
    this.state.animation.setValue(initialValue);
    if (this.props.event.comments.length){
      Animated.spring(
        this.state.animation, {
          toValue: finalValue
        }
      ).start();
    }
  }
  _addHeight(int){
    if (DEV) {console.log('ADD HEIGHT INT', int);}
    let initialValue = this.state.maxHeight;
    let finalValue = initialValue + int;
    if (DEV) {console.log('ADD HEIGHT', finalValue);}
    this.setState({maxHeight: this.state.maxHeight + int});
    if (this.props.isToggled){
      Animated.spring(
        this.state.animation, {
          toValue: finalValue,
        }
      ).start();
    }
  }
  _reduceHeight(int){
    if (DEV) {console.log('REDUCE HEIGHT', int);}
    let initialValue = this.state.maxHeight;
    let finalValue = initialValue - int;
    this.setState({maxHeight: this.state.maxHeight - int});
    this.state.animation.setValue(initialValue);
    Animated.spring(
      this.state.animation, {
        toValue: finalValue,
      }
    ).start();
  }
  _renderExpanded(){
    let {event} = this.props;
    return ( // with comments
      <View style={styles.container}>
        <View style={styles.row}>
          <TouchableOpacity onPress={this.props.toggleComments}>
            <Text style={styles.h2}>Comments {this.props.isToggled ? <Icon name="arrow-down-b"/> : <Icon name="arrow-up-b"/>}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.openCommentForm}>
            <Icon name="plus-circled" size={30} color={Colors.brandPrimary}/>
          </TouchableOpacity>
        </View>
        <CommentList
          measured={this.state.measured}
          addHeight={() => {}}
          reduceHeight={this._reduceHeight.bind(this)}
          comments={_.sortBy(event.comments, (c) => -c.timestamp)}
          {...this.props}
        />
      </View>
    )
  }
  _renderHiddenLayout(){
    let {event} = this.props;
    if (! event.comments.length || this.state.measured) {
      return <View />
    }
    return (
      <View style={{position: this.state.measured ? 'absolute' : 'relative', opacity: this.state.measured ? 1 : 0}}>
        <View style={styles.row}>
          <TouchableOpacity>
            <Text style={styles.h2}>Comments {this.props.isToggled ? <Icon name="arrow-down-b"/> : <Icon name="arrow-up-b"/>}</Text>
          </TouchableOpacity>
        </View>
        <CommentList
          addHeight={this._addHeight.bind(this)}
          reduceHeight={this._reduceHeight.bind(this)}
          comments={_.sortBy(event.comments, (c) => -c.timestamp)}
          {...this.props}
        />
      </View>
    )
  }
  render(){
    let {event} = this.props;
    if (DEV) {console.log('EVENT COMMENTS', event.comments.length, this.state.maxHeight, this.state.minHeight);}
    return (
      <Animated.View style={[styles.container, {height: this.state.animation}]}>
        {this._renderExpanded()}
        {this._renderHiddenLayout()}
      </Animated.View>

    )
  }
};

let styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
    paddingVertical: 8,
  },
  h4: {
    fontSize: 16,
    fontWeight: '300',
    paddingHorizontal: 10,
  },
  h2: {
    fontSize: 20,
    fontWeight: '400',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  container: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    overflow: 'hidden',
    marginBottom: 1,
  },
});
