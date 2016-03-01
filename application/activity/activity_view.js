import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import NotificationsHolder from './notifications_holder';
import UpcomingAssemblies from './upcoming_assemblies';

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
} from 'react-native';

class ActivityView extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      tab: 'notifications',
      notifications: [],
      events: []
    }
  }
  _fetchNotifications(){
    let url = `http://localhost:2403/notifications`;
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
  _fetchEvents(){
    let {currentUser} = this.props;
    let url = `http://localhost:2403/events?{"groupId": {"$in": ${JSON.stringify(currentUser.groupIds)}}}`;
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
      this.setState({
        events: sortedEvents,
        nextEvent: nextEvent
      })
    })
    .catch((err) => {console.log('ERR: ', err)})
  }
  componentDidMount(){
    this._fetchNotifications();
    this._fetchEvents();
  }
  render(){
    let {tab,} = this.state;
    let tabContent = tab == 'upcoming' ? <UpcomingAssemblies /> : <NotificationsHolder {...this.state}/>
    return (
      <View style={styles.container}>
        <View style={styles.topTab}>
          <TouchableOpacity
            style={[
              styles.leftSelectTab,
              styles.selectTab,
              this.state.tab == 'upcoming' ? styles.leftActiveTab : styles.leftInactiveTab]
            }
            onPress={()=>{this.setState({tab: 'upcoming'})}}>
            <Text
              style={this.state.tab == 'upcoming' ? styles.activeTabText : styles.inactiveTabText}>Nearby</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.rightSelectTab,
              styles.selectTab,
              this.state.tab == 'notifications' ? styles.rightActiveTab : styles.rightInactiveTab]}
            onPress={()=>{this.setState({tab: 'notifications'})}}>
            <Text
              style={this.state.tab == 'notifications' ? styles.activeTabText : styles.inactiveTabText}>Notifications</Text>
          </TouchableOpacity>
        </View>
        {tabContent}
      </View>
    )
  }
}

let styles = {
  container: {
    flex: 1,
  },
  topTab: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    paddingTop: 25,
    paddingBottom: 10,
    backgroundColor: Colors.brandPrimary,
  },
  selectTab:{
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  leftSelectTab: {
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginLeft: 5,
    borderRightWidth: 0,
  },
  rightSelectTab: {
    borderRadius: 4,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeftWidth: 0,
    marginRight: 5,
  },
  leftActiveTab: {
    backgroundColor: Colors.brandPrimary,
  },
  leftInactiveTab: {
    backgroundColor: 'white',
  },
  rightActiveTab: {
    backgroundColor: Colors.brandPrimary,
  },
  rightInactiveTab: {
    backgroundColor: 'white',
  },
  activeTabText: {
    textAlign: 'center',
    color: 'white',
  },
  inactiveTabText: {
    textAlign: 'center',
    color: Colors.brandPrimary,
  },
}

module.exports = ActivityView;
