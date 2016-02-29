import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import _ from 'underscore';
// import {profileFixture} from '../fixtures/users';
import NavigationBar from 'react-native-navbar';
import GroupBox from '../groups/group_box';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  ListView,
  Image,
  TouchableOpacity,
  Navigator,
  Dimensions,
  NativeModules,
} from 'react-native';

let { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class Profile extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      groups: []
    }
  }
  componentDidMount(){
    let url = `http://localhost:2403/groups?{"id": {"$in": ${JSON.stringify(this.props.user.groupIds)}}}`;
    fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type':'application/json'
      }
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('GROUPS');
      this.setState({groups: data})
    })
  }
  _renderBackButton(){
    return (
      <TouchableOpacity onPress={()=>{
        this.props.navigator.pop();
      }}>
        <Icon name="ios-arrow-back" size={25} color="white" style={{paddingBottom: 3, paddingLeft: 20,}}/>
      </TouchableOpacity>
    )
  }
  render(){
    let {user,} = this.props;
    let {groups} = this.state;
    let titleConfig = {title: `${user ? user.firstName : 'User'}'s Profile`, tintColor: 'white'};
    let back = this._renderBackButton();
    let splitGroups = []
    if (groups && groups.length != 0){
      groups.forEach((group, idx)=>{
        if (idx & 1) { _.last(splitGroups).push(group);}
        else { splitGroups.push([group]) }
      })
      if (_.last(splitGroups).length == 1){
        _.last(splitGroups).push(null)
      }
    }
    console.log('SPLIT', splitGroups);
    return (
      <View style={styles.container}>
        <NavigationBar
          tintColor={Colors.brandPrimary}
          title={titleConfig}
          leftButton={back}
        />
        <ScrollView style={styles.profileContainer}>
          <View style={{height: 120, alignItems: 'center'}}>
            <Image source={{uri: user.avatarUrl}} style={styles.avatar}/>
          </View>
          <Text style={styles.username}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.location}>{user.location.city}, {user.location.state}</Text>
          <TouchableOpacity style={styles.newMessageContainer}
            onPress={()=>{
              console.log('SEND CHAT', user)
              this.props.navigator.push({
                name: 'Chat',
                user: user
              })
            }}
          >
            <Icon name="chatbubbles" size={40} style={styles.chatBubble} color={Colors.brandPrimary}/>
            <Text style={styles.sendMessageText}>Send a Message</Text>
          </TouchableOpacity>
          <View style={styles.break}></View>
          <Text style={styles.technologies}>Technologies</Text>
          <Text style={styles.technologyList}>{user.technologies.join(', ')}</Text>
          <Text style={styles.technologies}>Assemblies</Text>
          <View style={{flex: 1}}>

          {splitGroups.map((groupDouble, i) => {
            console.log('IDX', i);
            return (
              <View style={styles.groupsContainer} key={i}>
              {groupDouble.map((group, idx) => {
                if (!group) {
                  return (
                    <GroupBox group={group} key={idx}/>
                  )
                }
                return (
                  <TouchableOpacity key={idx} onPress={()=>{
                    this.props.navigator.push({
                      name: 'Group',
                      group: group,
                    })
                  }}>
                    <GroupBox group={group}/>
                  </TouchableOpacity>
                )
              })}
              </View>
            )
          })}
          </View>
        </ScrollView>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  groupsContainer: {
    flexDirection: 'row'
  },
  profileContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 15,
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  backButtonText: {
    color: 'white',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 20,
  },
  username: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '300',
    padding: 8,
  },
  location: {
    textAlign: 'center',
    fontSize: 19,
    fontWeight: '300',
  },
  newMessageContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assemblies:{

  },
  break:{
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    height: 1,
    width: deviceWidth - 20,
  },
  chatBubble:{
    padding: 10,
  },
  sendMessageText: {
    fontSize: 18,
    padding: 5,
  },
  technologies:{
    textAlign: 'left',
    fontSize: 22,
    paddingHorizontal: 20,
    paddingBottom: 4,
    paddingTop: 20,
  },
  technologyList:{
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.brandPrimary,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },

  inputBox: {
    height: 60,
    backgroundColor: '#F3EFEF',
    flexDirection: 'row',
    marginBottom: 50,
  },

  container: {
    flex: 1,
  },
  header: {
    height: 70,
    backgroundColor: Colors.brandPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 22,
  },
})

module.exports = Profile;
