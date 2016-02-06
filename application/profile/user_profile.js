import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';

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
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

class UserProfile extends React.Component{
  _renderBackButton(){
    return (
      <TouchableOpacity onPress={()=>{
        this.props.navigator.pop();
      }}>
        <Icon name="ios-arrow-back" size={25} color="white" style={{paddingBottom: 3, paddingLeft: 20,}}/>
      </TouchableOpacity>
    )
  }
  render(){
    let titleConfig = {title: 'Profile', tintColor: 'white'}
    let back = this._renderBackButton();
    return (
      <View style={styles.container}>
        <NavigationBar
          tintColor={Colors.brandPrimary}
          title={titleConfig}
          leftButton={back}
        />
      </View>
    )
  }
}

let styles = {
  container: {
    flex: 1,
  },
}

module.exports = UserProfile;
