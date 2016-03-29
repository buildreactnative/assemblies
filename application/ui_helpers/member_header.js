import _              from 'underscore';
import {truncate}     from 'underscore.string';
import Icon           from 'react-native-vector-icons/Ionicons';
import moment         from 'moment';
import Colors         from '../styles/colors';
import Globals        from '../styles/globals';
import GoingList      from './going_list';
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

export default class MemberHeader extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      animation: new Animated.Value(),
      measured: false,
      maxHeight: 100,
    };
  }
  _setMaxHeight(event){
    if (!! (event.nativeEvent && event.nativeEvent.layout.height > this.state.maxHeight)){
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
    this.props.toggleGoing();
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
  _renderGoing(){
    let {group} = this.props;
    return (
      <View>
        {this.props.members.map((member, idx) => {
          if (DEV) {console.log('MEMBER', member)}
          let isOwner = group ? group.members[member.id].owner : false;
          let isAdmin = group ? group.members[member.id].admin : false;
          let status = isOwner ? 'owner' : isAdmin ? 'admin' : 'member'
          return (
            <TouchableOpacity
              onPress={()=>{
                this.props.navigator.push({
                  name: 'Profile',
                  user: member,
                })
              }}
              key={idx}
              style={styles.memberContainer}>
              <Image source={{uri: member.avatarUrl}} style={styles.avatar}/>
              <View style={styles.memberInfo}>
                <Text style={styles.h5}>{member.firstName} {member.lastName}</Text>
                <Text style={styles.h4}>{status}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
  _renderExpanded(){
    let {event} = this.props;
    if (! event.comments.length){
      return (
        <View style={styles.container}>
          <View style={styles.row}>
            <TouchableOpacity onPress={this._toggle.bind(this)}>
              <Text style={styles.h2}>Going {this.props.isToggled ? <Icon name="arrow-down-b"/> : <Icon name="arrow-up-b"/>}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <TouchableOpacity onPress={this._toggle.bind(this)}>
            <Text style={styles.h2}>Going {this.props.isToggled ? <Icon name="arrow-down-b"/> : <Icon name="arrow-up-b"/>}</Text>
          </TouchableOpacity>
        </View>
        {this._renderGoing()}
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
            <Text style={styles.h2}>Going {this.props.isToggled ? <Icon name="arrow-down-b"/> : <Icon name="arrow-up-b"/>}</Text>
          </TouchableOpacity>
        </View>
        {this._renderGoing()}
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
            <Text style={styles.h2}>Going {this.props.isToggled ? <Icon name="arrow-down-b"/> : <Icon name="arrow-up-b"/>}</Text>
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
    marginBottom: 50,
  },
});
