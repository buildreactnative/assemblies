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
      tab: 'upcoming',
    }
  }
  render(){
    let {tab,} = this.state;
    let tabContent = tab == 'upcoming' ? <UpcomingAssemblies /> : <NotificationsHolder />
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
            <Text style={styles.tabText}>Nearby</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.rightSelectTab,
              styles.selectTab,
              this.state.tab == 'notifications' ? styles.rightActiveTab : styles.rightInactiveTab]}
            onPress={()=>{this.setState({tab: 'notifications'})}}>
            <Text style={styles.tabText}>Notifications</Text>
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
  tabText: {
    textAlign: 'center',
  }
}

module.exports = ActivityView;
