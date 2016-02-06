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
      <TouchableOpacity style={styles.backButton} onPress={()=>{
        this.props.navigator.pop();
      }}>
        <Icon name="ios-arrow-back" size={25} color="#ccc" />
      </TouchableOpacity>
    )
  }
  render(){
    let {group} = this.props;
    let leftButtonConfig = this._renderBackButton()
    let titleConfig = {title: group.name, tintColor: 'white'}
    return (
      <View style={styles.container}>
        <NavigationBar
          title={titleConfig}
          tintColor={Colors.brandPrimary}
          leftButton={leftButtonConfig}
        />
          <Image source={{uri: group.backgroundImage}} style={styles.topImage}>
            <View style={[styles.blurOverlay, {backgroundColor: '#333'}]}>
              <Text style={styles.h1}>{group.name}</Text>
            </View>
            <View style={styles.bottomPanel}>
              <Text style={styles.membersText}>{group.memberCount} members</Text>
            </View>
          </Image>
      </View>
    )
  }
}

let styles = {
  container: {
    flex: 1,
  },
  blurOverlay: {
    opacity: 0.5,
    flex: 1,
  },
  topImage: {
    width: deviceWidth,
    height: 200,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  bottomPanel: {
    backgroundColor: 'white',
    opacity: 0.9,
    flex: 0.5,
    width: deviceWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  membersText:{
    color: Colors.brandPrimary,
    opacity: 1,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  h1: {
    fontSize: 22,
    flex: 1,
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
    padding: 30,
  },
  backButton: {
    backgroundColor: 'transparent',
    paddingLeft: 20,
  }
}

module.exports = Group
