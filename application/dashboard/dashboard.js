import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import ActivityView from '../activity/activity_view';
import CalendarView from '../calendar/calendar_view';
import MessagesView from '../messages/messages_view';
import Profile from '../messages/profile';
import Settings from '../profile/settings';
import GroupView from '../groups/group_view';

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
  constructor(){
    super();
    this.state = {
      selectedTab: 'Activity',
      loading: true,
    }
  }
  _logout(){
    AsyncStorage.setItem('sid', 'false');
    this.props.navigator.push({
      name: 'Welcome'
    })
  }
  _setTab(tabId){
    this.setState({selectedTab: tabId})
  }
  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this.setState({loading: false});
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
          <MessagesView />
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
          <ActivityView />
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
          <Settings {...this.props} logout={this._logout.bind(this)}/>
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
