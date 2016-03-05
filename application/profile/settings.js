import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import UserProfile from './user_profile';
import UserSettings from './user_settings';
import UserTechnologies from './user_technologies';
import UserAvatar from './user_avatar';

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

let { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const CUSTOM_CONFIG = Navigator.SceneConfigs.HorizontalSwipeJump;

class Settings extends React.Component{
  _changeProfile(user){
    this.props.changeState({currentUser: user})
  }
  render(){
    return (
      <View style={styles.container}>
        <Navigator
          initialRoute={{
            name: 'UserProfile'
          }}
          configureScene={(route, routeStack) => {
            return CUSTOM_CONFIG;
          }}
          renderScene={(route, navigator) => {
            if (route.name == 'UserTechnologies') {
              console.log('USER TECH')
              return (
                <UserTechnologies currentUser={this.props.currentUser} navigator={navigator} changeProfile={this._changeProfile.bind(this)}/>
              )
            } else if (route.name == 'UserSettings'){
              return (
                <UserSettings currentUser={this.props.currentUser} navigator={navigator} changeProfile={this._changeProfile.bind(this)}/>
              )
            } else if (route.name == 'UserAvatar'){
              return (
                <UserAvatar currentUser={this.props.currentUser} navigator={navigator} changeProfile={this._changeProfile.bind(this)}/>
              )
            } else  {
              return (
                <UserProfile currentUser={this.props.currentUser} navigator={navigator}/>
              )
            }
          }}
        >
        </Navigator>
      </View>
    )
  }
}

let styles = {
  container: {
    flex: 1,
  }
}

module.exports = Settings;
