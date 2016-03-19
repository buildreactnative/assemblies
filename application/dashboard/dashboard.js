import _                from 'underscore';
import Icon             from 'react-native-vector-icons/Ionicons';
import Colors           from '../styles/colors';
import ActivityView     from '../activity/activity_view';
import CalendarView     from '../calendar/calendar_view';
import MessagesView     from '../messages/messages_view';
import Profile          from '../messages/profile';
import Settings         from '../profile/settings';
import GroupView        from '../groups/group_view';
import {BASE_URL, DEV, HEADERS}  from '../utilities/fixtures';

import React, {
  Component,
  AsyncStorage,
  StyleSheet,
  View,
  TabBarIOS,
  ListView,
  Dimensions,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

let { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export default class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedTab               : 'Activity',
      loading                   : true,
      fetchedNotifications      : false,
      fetchedAllEvents          : false,
      fetchedAllEventsGroups    : false,
      fetchedGroups             : false,
      fetchedMessages           : false,
      fetchedNextEvent          : false,
      fetchedUserEvents         : false,
      fetchedSuggestedGroups    : false,
      fetchedGroupUsers         : false,
      allEvents                 : [],
      allEventsGroups           : [],
      events                    : [],
      groups                    : [],
      groupUsers                : [],
      messages                  : [],
      notifications             : [],
      suggestedGroups           : [],
      suggestedEvents           : [],
      currentUser               : props.currentUser,
    };
  }
  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this.setState({loading: false});
      if (!! this.props.currentUser){
        this._fetchNotifications();
      }
    });
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.currentUser != this.state.currentUser && ! this.state.loading){
      this.setState({currentUser: nextProps.currentUser})
      this._fetchNotifications();
    }
  }

  _fetchNotifications(){
    let {currentUser} = this.props;
    let url = `${BASE_URL}/notifications?{"userIdString": {"$regex": ".*${currentUser.id}.*"}}`;
    fetch(url, {
      method: "GET",
      headers: HEADERS,
    })
    .then((response) => response.json())
    .then((data) => {
      if (DEV) {console.log('NOTIFICATIONS', data);}
      let notifications = _.reject(data, (n) => n.relatedUserIds[currentUser.id].seen);
      this._fetchLastEvent(notifications);
    })
    .catch((err) => {
      if (DEV) {console.log('ERR:', err);}
    }).done();
  }
  _fetchLastEvent(notifications){
    let {currentUser} = this.props;
    let d = new Date();
    d.setHours(0);
    // let fakeArr = ['abcdefg'];
    let groupIds = currentUser.groupIds;
    let url = `${BASE_URL}/events?{"$and": [{"groupId": {"$in": ${JSON.stringify(groupIds)}}}, {"start" : {"$gte": ${JSON.stringify(d.valueOf())}}}]}`;
    fetch(url, {
      method: "GET",
      headers: HEADERS,
    })
    .then((response) => response.json())
    .then((data) => {
      if (DEV) {console.log('FETCHED EVENTS', data);}
      let sortedEvents = data.sort((a, b) => {
        return a.start > b.start;
      });
      let nextEvent = _.first(_.filter(sortedEvents, (e) => e.attending[currentUser.id] == true));
      this.setState({
        nextEvent               : nextEvent,
        notifications           : notifications,
        events                  : data,
        fetchedNotifications    : true,
        fetchedNextEvent        : true,
        fetchedUserEvents       : true,
      });
    })
    .catch((err) => {
      if (DEV) {console.log('ERR: ', err)}
    }).done();
  }
  _mutateState(newState, callback){
    this.setState(newState);
  }
  _logout(){
    AsyncStorage.setItem('USER_PARAMS', JSON.stringify(null));
    this.props.navigator.push({
      name: 'Welcome'
    });
  }
  _setTab(tabId){
    this.setState({selectedTab: tabId})
  }

  _renderLoading(){
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
        <ActivityIndicatorIOS animating={true}  style={[styles.centering, {height: 80}]} size="large"/>
      </View>
    )
  }
  _sendData(newState){
    console.log('NEW STATE', newState, this.state);
    this.setState(newState);
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
          <MessagesView
            {...this.state}
            {...this.props}
            sendData={this._sendData.bind(this)}
          />
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
          <GroupView
            {...this.props}
            {...this.state}
            sendData={this._sendData.bind(this)}
          />
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
          <CalendarView
            {...this.props }
            {...this.state }
            sendData={this._sendData.bind(this)}
          />
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
            sendData={this._sendData.bind(this)}
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
            {...this.props}
            {...this.state}
            changeState={this._sendData.bind(this)}
            logout={this._logout.bind(this)}
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
