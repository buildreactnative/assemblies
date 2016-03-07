import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'underscore';

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

class GroupBox extends React.Component{
  render(){
    let {group} = this.props;
    return (
      <TouchableOpacity
        onPress={()=>{
          this.props.navigator.push({
            name: 'CreateGroup'
          })
        }}
        style={styles.groupImage}>
        <View style={[styles.group, {backgroundColor: Colors.inactive,}]} >
          <Icon name="plus" size={80} color={Colors.brandPrimary} />
        </View>
      </TouchableOpacity>
    )
  }
}

let styles = {
  group: {
    opacity: 0.9,
    flex: 1,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    width: (deviceWidth / 2) - 18,
  },
  groupImage: {
    height: 150,
    width: (deviceWidth / 2) - 20,
    margin: 10,
    opacity: 0.8,
  },
  groupText: {
    color: 'white',
    margin: 20,
    fontSize: 20,
    position: 'absolute',
    fontWeight: '500',
  },
  groupAdd: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    padding: 15,
  }
}

module.exports = GroupBox;
