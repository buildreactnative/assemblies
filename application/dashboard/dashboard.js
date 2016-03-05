import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import ActivityView from '../activity/activity_view';
import CalendarView from '../calendar/calendar_view';
import MessagesView from '../messages/messages_view';
import Profile from '../messages/profile';
import Settings from '../profile/settings';
import GroupView from '../groups/group_view';
import {BASE_URL} from '../utilities/fixtures';

import React, {
  ScrollView,
  Component,
  AsyncStorage,
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

let { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedTab: 'Activity',
      loading: true,
      groups: [],
      events: [],
      messages: [],
      notifications: [],
      suggestedGroups: [],
      suggestedEvents: [],
      conversations: [],
      currentUser: props.currentUser,
    }
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.currentUser != this.props.currentUser){
      this.setState({currentUser: nextProps.currentUser})
      this._fetchNotifications();
      this._fetchLastEvent();
    }
  }
  _fetchNotifications(){
    let url = `${BASE_URL}/notifications`;
    fetch(url, {
      method: "GET",
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json'
      }
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('NOTIFICATIONS', data);
      this.setState({notifications: data})
    })
  }
  _fetchLastEvent(){
    let {currentUser} = this.props;
    let url = `${BASE_URL}/events?{"groupId": {"$in": ${JSON.stringify(currentUser.groupIds)}}}`;
    fetch(url, {
      method: "GET",
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/json'
      }
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('FETCHED EVENTS', data);
      let sortedEvents = data.sort((a, b) => {
        return a.start > b.start;
      })
      let nextEvent = null;
      let found = false;
      for (i=0; i<sortedEvents.length; i++){
        let sortedEvent = sortedEvents[i];
        if (!! sortedEvent.attending[currentUser.id] && ! found) {
          nextEvent = sortedEvent;
          found = true;
        }
      }
      this._fetchGroups();
      this._fetchAllEvents();
      this.setState({
        nextEvent: nextEvent
      })
    })
    .catch((err) => {console.log('ERR: ', err)})
  }
  _fetchAllEvents(){
    let d = new Date();
    d.setHours(0);
    d.setTime(0);
    let url = `${BASE_URL}/events?{"start": {"$gt": ${JSON.stringify(d.valueOf())}}}`;
    fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type':'application/json'
      }
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('EVENTS ALL', data);
      this.setState({events: data});
    })
  }
  _mutateState(newState, callback){
    this.setState(newState, callback)
  }
  _logout(){
    AsyncStorage.setItem('sid', 'false');
    this.props.navigator.push({
      name: 'Welcome'
    });
  }
  _setTab(tabId){
    this.setState({selectedTab: tabId})
  }
  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this.setState({loading: false});
      if (!! this.props.currentUser){
        this._fetchNotifications();
        this._fetchLastEvent();
      }
    });
  }
  _renderLoading(){
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
        <ActivityIndicatorIOS animating={true}  style={[styles.centering, {height: 80}]} size="large"/>
      </View>
    )
  }
  render() {
    if (this.state.loading) {
      return this._renderLoading();
    }
    return (
      <TabBarIOS>
        <Icon.TabBarItem
          title="Messages"
          selected={this.state.selectedTab == 'Messages'}
          iconName="android-chat"
          selectedIconName="android-chat"
          onPress={()=>{
            this.setState({
              selectedTab: 'Messages'
            })
          }}
          >
          <MessagesView {...this.props}/>
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Groups"
          selected={this.state.selectedTab == 'Groups'}
          iconName="ios-people"
          selectedIconName="ios-people"
          onPress={()=>{
            this.setState({
              selectedTab: 'Groups'
            })
          }}
          >
          <GroupView {...this.props}/>
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Calendar"
          selected={this.state.selectedTab == 'Calendar'}
          iconName="calendar"
          selectedIconName="calendar"
          onPress={()=>{
            this.setState({
              selectedTab: 'Calendar'
            })
          }}
          >
          <CalendarView {...this.props }/>
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Activity"
          selected={this.state.selectedTab == 'Activity'}
          iconName="clipboard"
          selectedIconName="clipboard"
          onPress={()=>{
            this.setState({
              selectedTab: 'Activity'
            })
          }}
          >
          <ActivityView
            {...this.props}
            {...this.state}
            changeState={this._mutateState.bind(this)}
          />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Profile"
          selected={this.state.selectedTab == 'Profile'}
            iconName="gear-b"
          selectedIconName="gear-b"
          onPress={()=>{
            this.setState({
              selectedTab: 'Profile'
            })
          }}
          >
          <Settings
            changeState={this._mutateState.bind(this)}
            logout={this._logout.bind(this)}
            {...this.state}
          />
        </Icon.TabBarItem>

      </TabBarIOS>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  tabView: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    height: deviceHeight,
  },
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    height: 150,
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});

module.exports = Dashboard;
