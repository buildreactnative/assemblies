import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import Groups from './groups';
import Group from './group';
import CreateGroup from './create_group';
import CreateEvent from './create_event';
import GroupMembers from './group_members';
import GroupEvents from './group_events';
import CreateEventConfirm from './create_event_confirm';
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
  constructor(props){
    super(props);
    this.state = {
      groups: [],
      suggestedGroups: [],
    }
  }
  componentDidMount(){
    let {currentUser} = this.props;
    let groupIds = currentUser ? currentUser.groupIds : [];
    let url = `http://localhost:2403/groups?{"id": {"$in": ${JSON.stringify(groupIds)}}}`
    console.log('URL', url)
    fetch(url, {
      method: "GET",
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('DATA GROUPS', data)
      this.setState({groups: data})
    })
    .catch((error) => {console.log(error)})
  }
  createGroup(group){
    if (! group) {return;}
    this.setState({
      groups: this.state.groups.concat(group),
    })
  }
  render(){
    // console.log('THIS PROPS', this.props);
    return (
      <View style={styles.container}>
        <Navigator
          initialRoute={{ name: 'Groups' }}
          configureScene={(route, routeStack) => {
            return CUSTOM_CONFIG;
          }}
          renderScene={(route, navigator) => {
            if (route.name == 'Groups') {
              return <Groups {...this.props} {...this.state} navigator={navigator} />
            } else if (route.name == 'CreateGroup'){
              return <CreateGroup {...this.props} navigator={navigator} />
            } else if (route.name == 'Group') {
              return <Group {...this.props} navigator={navigator} {...route}  />
            } else if (route.name == 'Members') {
              return <GroupMembers {...this.props} navigator={navigator} />
            } else if (route.name == 'Events' ) {
              return <GroupEvents {...this.props} navigator={navigator}  />
            } else if (route.name == 'CreateEvent'){
              return <CreateEvent {...this.props} {...route} navigator={navigator}  />
            } else if (route.name == 'CreateEventConfirm'){
              return <CreateEventConfirm {...this.props} {...route} navigator={navigator} />
            } else if (route.name == 'CreateGroupConfirm'){
              return (
                <CreateGroupConfirm {...this.props} {...route}
                  createGroup={this.createGroup.bind(this)}
                  navigator={navigator}
                />
              )
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
