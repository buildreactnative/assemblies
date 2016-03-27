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
      // expanded: false,
      animation: new Animated.Value(),
      measured: false,
      maxHeight: 50,
    };
  }
  // componentWillReceiveProps(nextProps){
  //   if (!! nextProps.newComment && ! this.props.newComment && ! this.props.isToggled){
  //     this._toggle();
  //   }
  // }
  _setMaxHeight(event){
    if (DEV) {console.log('SET MAX HEIGHT', event.nativeEvent.layout);}
    if (!! event.nativeEvent && event.nativeEvent.layout.height > this.state.maxHeight){
      this.setState({
        maxHeight: event.nativeEvent.layout.height,
        measured: true,
      });
    }
  }
  _setMinHeight(event){
    this.setState({
      minHeight: event.nativeEvent.layout.height,
    });
  }

  _toggle(){
    let initialValue = this.props.isToggled ? this.state.maxHeight : this.state.minHeight;
    let finalValue = this.props.isToggled ? this.state.minHeight : this.state.maxHeight;
    this.props.toggleComments();
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
    let initialValue = this.state.maxHeight;
    let finalValue = initialValue + int;
    this.setState({maxHeight: finalValue})
    this.state.animation.setValue(initialValue);
    Animated.spring(
      this.state.animation, {
        toValue: finalValue,
      }
    ).start();
  }
  _reduceHeight(int){
    let initialValue = this.state.maxHeight;
    let finalValue = initialValue - int;
    this.setState({maxHeight: finalValue})
    this.state.animation.setValue(initialValue);
    Animated.spring(
      this.state.animation, {
        toValue: finalValue,
      }
    ).start();
  }
  _renderExpanded(){
    let {event} = this.props;
    if (! event.comments.length){
      return (
        <View style={styles.container}>
          <View style={styles.row}>
            <TouchableOpacity onPress={this._toggle.bind(this)}>
              <Text style={styles.h2}>Comments {this.props.isToggled ? <Icon name="arrow-down-b"/> : <Icon name="arrow-up-b"/>}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.props.openCommentForm}>
              <Icon name="plus-circled" size={30} color={Colors.brandPrimary}/>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <TouchableOpacity onPress={this._toggle.bind(this)}>
            <Text style={styles.h2}>Comments {this.props.isToggled ? <Icon name="arrow-down-b"/> : <Icon name="arrow-up-b"/>}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.openCommentForm}>
            <Icon name="plus-circled" size={30} color={Colors.brandPrimary}/>
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
  _renderHiddenLayout(){
    let {event} = this.props;
    if (! event.comments.length || this.state.measured) {
      return <View />
    }
    return (
      <View onLayout={this._setMaxHeight.bind(this)} style={{position: this.state.measured ? 'absolute' : 'relative', opacity: this.state.measured ? 1 : 0}}>
        <View style={styles.row}>
          <TouchableOpacity>
            <Text style={styles.h2}>Comments {this.props.isToggled ? <Icon name="arrow-down-b"/> : <Icon name="arrow-up-b"/>}</Text>
          </TouchableOpacity>
        </View>
        <CommentList
          comments={_.sortBy(event.comments, (c) => -c.timestamp)}
          {...this.props}
        />
      </View>
    )
  }
  _renderClosed(){
    return (
      <View style={[styles.container]} onLayout={(e) => {
        if (! this.state.minHeight) {
          this._setMinHeight(e);
        }}}>
        <View style={styles.row} >
          <TouchableOpacity onPress={this._toggle.bind(this)} >
            <Text style={styles.h2}>Comments {this.props.isToggled ? <Icon name="arrow-down-b"/> : <Icon name="arrow-up-b"/>}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.openCommentForm}>
            <Icon name="plus-circled" size={30} color={Colors.brandPrimary}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  render(){
    let {event} = this.props;
    return (
      <Animated.View style={[styles.container, {height: this.state.animation}]}>
        {this.props.isToggled ? this._renderExpanded() : this._renderClosed()}
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
