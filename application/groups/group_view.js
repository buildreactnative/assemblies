import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import Groups from './groups';
import Group from './group';
import CreateGroup from './create_group';
import CreateEvent from './create_event';
import GroupMembers from './group_members';
import GroupEvents from './group_events';
import CreateGroupConfirm from './create_group_confirm';

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
  Navigator,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

const CUSTOM_CONFIG = Navigator.SceneConfigs.HorizontalSwipeJump;
class GroupView extends React.Component{
  render(){
    return (
      <View style={styles.container}>
        <Navigator
          initialRoute={{ name: 'Groups' }}
          configureScene={(route, routeStack) => {
            return CUSTOM_CONFIG;
          }}
          renderScene={(route, navigator) => {
            if (route.name == 'Groups') {
              return <Groups navigator={navigator}/>
            } else if (route.name == 'CreateGroup'){
              return <CreateGroup navigator={navigator} />
            } else if (route.name == 'Group') {
              return <Group navigator={navigator} group={route.group} />
            } else if (route.name == 'Members') {
              return <GroupMembers navigator={navigator}/>
            } else if (route.name == 'Events' ) {
              return <GroupEvents navigator={navigator} />
            } else if (route.name == 'CreateEvent'){
              return <CreateEvent navigator={navigator} />
            } else if (route.name == 'CreateGroupConfirm'){
              return <CreateGroupConfirm {...route} navigator={navigator}/>
            }
          }}/>
      </View>
    )
  }
}

let styles = {
  container: {
    flex: 1,
  }
}
module.exports = GroupView;
