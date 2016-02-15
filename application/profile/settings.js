import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import UserProfile from './user_profile';
import UserSettings from './user_settings';
import UserTechnologies from './user_technologies';

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
              return (
                <UserTechnologies navigator={navigator}/>
              )
            } else if (route.name == 'UserSettings'){
              return (
                <UserSettings navigator={navigator} {...this.props}/>
              )
            } else if (route.name == 'UserProfile') {
              return (
                <UserProfile navigator={navigator} {...this.props}/>
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
