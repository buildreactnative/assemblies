import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import ActivityView from '../activity/activity_view';

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

class UpcomingAssemblies extends React.Component{
  render(){
    return (
      <View>
        <Text>UPCOMING ASSEMBLIES</Text>
      </View>
    )
  }
}

module.exports = UpcomingAssemblies;
