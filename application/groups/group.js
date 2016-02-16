import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import moment from 'moment';
import {truncate} from 'underscore.string';

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
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class Group extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      members: [],
    }
  }
  componentDidMount(){
    let {group} = this.props;
    let userIds = Object.keys(group.members);
    let url = `http://localhost:2403/users?{"id": {"$in": ${JSON.stringify(userIds)}}}`
    fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('DATA USERS', data)
      this.setState({members: data})
    })
    .catch((error) => {console.log(error)})
  }
  _renderBackButton(){
    return (
      <TouchableOpacity style={styles.backButton} onPress={()=> {
        this.props.navigator.pop();
      }}>
        <Icon name="ios-arrow-back" size={25} color="#ccc" />
      </TouchableOpacity>
    )
  }
  _renderAddButton(){
    return (
      <TouchableOpacity style={styles.addButton} onPress={()=> {
        this.props.navigator.push({
          name: 'CreateEvent',
          group: this.props.group,
        });
      }}>
        <Icon name="ios-plus-outline" size={25} color="#ccc" />
      </TouchableOpacity>
    )
  }
  _renderEvents(){
    let {group} = this.props;
    return (
      <View>
        {Object.keys(group.events).map((key, idx) => {
          let event = group.events[key];
          return (
            <View key={idx} style={styles.eventContainer}>
              <View style={styles.eventInfo}>
                <Text style={styles.h5}>{event.name}</Text>
                <Text style={styles.h4}>{moment(event.start).format('dddd, MMM Do')}</Text>
                <Text style={styles.h4}>{event.goingCount} Going</Text>
              </View>
              <View style={styles.goingContainer}>
                <Text style={styles.goingText}>{"You're Going"}</Text>
                <Icon name="checkmark-circled" size={30} color="green" />
              </View>
            </View>
          )
        })}
      </View>
    )
  }
  _renderNoEvents(){
    return (
      <View style={styles.eventContainer}>
        <View style={styles.eventInfo}>
          <Text style={styles.h5}>No events scheduled</Text>
        </View>
        <View style={styles.goingContainer}>
          <Text style={styles.goingText}>Create an event</Text>
          <Icon name="checkmark-circled" size={30} color="green" />
        </View>
      </View>
    )
  }
  render(){
    let {group} = this.props;
    let backButton = this._renderBackButton();
    let addButton = this._renderAddButton();
    return (
      <View style={styles.container}>
      <NavigationBar
        title={{title: group.name, tintColor: 'white'}}
        tintColor={Colors.brandPrimary}
        leftButton={backButton}
        rightButton={addButton}
      />
        <ScrollView style={styles.scrollView}>
        <Image source={{uri: group.imageUrl}} style={styles.topImage}>
          <View style={styles.overlayBlur}>
            <Text style={styles.h1}>{group.name}</Text>
          </View>
          <View style={styles.bottomPanel}>
            <Text style={styles.memberText}>{Object.keys(group.members).length} members</Text>
          </View>
        </Image>
        <Text style={styles.h2}>Summary</Text>
        <Text style={[styles.h4, {paddingHorizontal: 20,}]}>{truncate(group.summary, 140)}</Text>
        <Text style={styles.h2}>Technologies</Text>
        <Text style={styles.h3}>{group.technologies.join(', ')}</Text>
        <Text style={styles.h2}>Events</Text>
        <View style={styles.break}></View>
        {Object.keys(group.events).length ? this._renderEvents() : this._renderNoEvents()}
        <View style={styles.break}></View>
        <Text style={styles.h2}>Members</Text>
        <View style={styles.break}></View>
        {this.state.members.map((member, idx) => {
          console.log('MEMBER', member)
          let isOwner = group.members[member.id].owner;
          let isAdmin = group.members[member.id].admin;
          let status = isOwner ? 'owner' : isAdmin ? 'admin' : 'member'
          return (
            <View key={idx} style={styles.memberContainer}>
              <Image source={{uri: member.avatarUrl}} style={styles.avatar}/>
              <View style={styles.memberInfo}>
                <Text style={styles.h5}>{member.firstName} {member.lastName}</Text>
                <Text style={styles.h4}>{status}</Text>
              </View>
            </View>
          )
        })}
        </ScrollView>
      </View>
    )
  }
}

let styles = {
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
  scrollView: {
    flex: 1,
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

module.exports = Group;
