import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'underscore';
import {BASE_URL, DEV, HEADERS} from '../utilities/fixtures';

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

class SuggestedGroupBox extends React.Component{
  _renderSaved(){
    return <Icon name="checkmark-circled" color="white" size={30} />
  }
  _renderSuggested(){
    let {group, currentUser} = this.props;
    return (
      <TouchableOpacity style={styles.groupAdd} onPress={()=>{
        let members = group.members;
        members[currentUser.id] = {
          confirmed     : true,
          admin         : false,
          owner         : false,
          notifications : true,
        };
        fetch(`${BASE_URL}/groups/${group.id}`, {
          method: 'PUT',
          headers: HEADERS,
          body: JSON.stringify({members: members})
        })
        .then((response) => response.json())
        .then((data) => {
          let group = data;
          if (DEV) {console.log('ADD USER TO GROUP', data);}
          fetch(`${BASE_URL}/users/${currentUser.id}`, {
            method: 'PUT',
            headers: HEADERS,
            body: JSON.stringify({groupIds: currentUser.groupIds.concat(group.id)})
          })
          .then((response) => response.json())
          .then((data) => {
            let currentUser = data;
            if (DEV) {console.log('ADD GROUP_ID TO USER', data);}
            this.props.addUserToGroup(group, currentUser);
          });
        });
      }}>
        <Icon name="ios-plus-outline" size={30} color="white" />
      </TouchableOpacity>
    )
  }
  render(){
    let {group, currentUser,} = this.props;
    let isSaved = _.contains(currentUser.groupIds, group.id)
    if (! group ) {
      return (
        <View style={styles.groupImage}>
          <View style={[styles.group, {backgroundColor: Colors.inactive,}]} >
          </View>
        </View>
      )
    }
    return (
      <Image source={{uri: group.imageUrl}} style={styles.groupImage}>
        <View style={[styles.group, {backgroundColor: group.backgroundColor,}]} >
          <Text style={styles.groupText}>{group.name}</Text>
          <TouchableOpacity style={styles.groupAdd}>
            {isSaved ? this._renderSaved() : this._renderSuggested()}
          </TouchableOpacity>
        </View>
      </Image>
    )
  }
}

let styles = {
  group: {
    opacity: 0.9,
    flex: 1,
    height: 150,
    width: (deviceWidth / 2) - 15,
  },
  groupImage: {
    height: 150,
    width: (deviceWidth / 2) - 15,
    margin: 5,
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

module.exports = SuggestedGroupBox;
