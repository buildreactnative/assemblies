import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';

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

let { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class Dashboard extends Component {
  constructor(){
    super();
    this.state = {
      selectedTab: 'history'
    }
  }
  _setTab(tabId){
    this.setState({selectedTab: tabId})
  }
  render() {
    return (
      <TabBarIOS>
        <Icon.TabBarItem
          title="Messages"
          iconName="android-chat"
          selectedIconName="android-chat">
          <View><Text>MESSAGES</Text></View>
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Groups"
          iconName="ios-people"
          selectedIconName="ios-people">
          <View><Text>GROUPS</Text></View>
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Calendar"
          iconName="calendar"
          selectedIconName="calendar">
          <View><Text>CALENDAR</Text></View>
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Activity"
          iconName="clipboard"
          selectedIconName="clipboard">
          <View><Text>DASHBOARD</Text></View>
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Profile"
          iconName="gear-b"
          selectedIconName="gear-b">
          <View><Text>PROFILE</Text></View>
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
