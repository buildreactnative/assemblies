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
      notifications: []
    }
  }
  componentDidMount(){
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
  render(){
    let {tab,} = this.state;
    let tabContent = tab == 'upcoming' ? <UpcomingAssemblies /> : <NotificationsHolder notifications={this.state.notifications}/>
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
