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
        <TabBarIOS.Item
          systemIcon="history"
          onPress={()=>this._setTab('history')}
          selected={this.state.selectedTab == 'history'}>
          <View><Text>HISTORY</Text></View>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          systemIcon="bookmarks"
          onPress={()=>this._setTab('bookmarks')}
          selected={this.state.selectedTab == 'bookmarks'}>
          <View><Text>BOOKMARKS</Text></View>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          systemIcon="more"
          onPress={()=>this._setTab('more')}
          selected={this.state.selectedTab == 'more'}>
          <View><Text>MORE</Text></View>
        </TabBarIOS.Item>
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
