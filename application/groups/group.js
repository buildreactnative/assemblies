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

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class Group extends React.Component{
  _renderBackButton(){
    return (
      <TouchableOpacity style={styles.backButton} onPress={()=> {
        this.props.navigator.pop();
      }}>
        <Icon name="ios-arrow-back" size={25} color="#ccc" />
      </TouchableOpacity>
    )
  }
  render(){
    let {group} = this.props;
    let backButton = this._renderBackButton();
    return (
      <View style={styles.container}>
      <NavigationBar
        title={{title: group.name, tintColor: 'white'}}
        tintColor={Colors.brandPrimary}
        leftButton={backButton}
      />
        <Image source={{uri: group.backgroundImage}} style={styles.topImage}>
          <View style={styles.overlayBlur}>
            <Text style={styles.h1}>{group.name}</Text>
          </View>
          <View style={styles.bottomPanel}>
            <Text style={styles.memberText}>{group.memberCount} member</Text>
          </View>
        </Image>
      </View>
    )
  }
}

let styles = {
  backButton: {
    paddingLeft: 20,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
  },
  topImage: {
    width: deviceWidth,
    height: 200,
    flexDirection: 'column',
  },
  overlayBlur: {
    backgroundColor: '#333',
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  h1: {
    fontSize: 22,
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomPanel: {
    flex: 0.3,
    backgroundColor: 'white',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberText: {
    textAlign: 'center',
    color: Colors.brandPrimary,
    fontSize: 18,
    fontWeight: '400',
  },



}

module.exports = Group;
