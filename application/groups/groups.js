import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import {groupsFixture, suggestedGroups,} from '../fixtures/group_fixtures';
import {profileFixture} from '../fixtures/users';
import _ from 'underscore';
import GroupBox from './group_box';

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

let splitSuggestions = []
suggestedGroups.forEach((group, idx) => {
  if (idx & 1) { _.last(splitSuggestions).push(group);}
  else { splitSuggestions.push([group]); }
})

class Groups extends React.Component{
  _renderAddButton(){
    return (
      <TouchableOpacity style={styles.forwardButton} onPress={()=>{
        this.props.navigator.push({
          name: 'CreateGroup'
        })
      }}>
        <Icon name="ios-plus-outline" size={25} color="#ccc" />
      </TouchableOpacity>
    )
  }
  render(){
    let splitGroups = [];
    this.props.groups.forEach((group, idx)=>{
      if (idx & 1) { _.last(splitGroups).push(group);}
      else { splitGroups.push([group]) }
    })
    let rightButtonConfig = this._renderAddButton()
    let titleConfig = {title: 'My Groups', tintColor: 'white'}
    return (
      <View style={styles.container}>
        <NavigationBar
          title={titleConfig}
          tintColor={Colors.brandPrimary}
          rightButton={rightButtonConfig}
        />
        <ScrollView style={styles.assembliesContainer}>
          <Text style={styles.h2}>Your Assemblies:</Text>
          <View style={styles.assemblyBoxContainer}>
            {splitGroups.map((groupDouble, idx) => {
              return (
                  <View style={styles.groupsContainer} key={idx}>
                    {groupDouble.map((group, idx) => {
                      return (
                        <TouchableOpacity key={idx} onPress={()=>{
                          this.props.navigator.push({
                            name: 'Group',
                            group: group,
                          })
                        }}>
                          <GroupBox group={group}/>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
              )
            })}
          </View>
          <Text style={styles.h2}>You Might Like:</Text>
          <View style={styles.assemblyBoxContainer}>
            {splitSuggestions.map((groupDouble, idx) => {
              return (
                <View style={styles.groupsContainer} key={idx}>
                  {groupDouble.map((group, idx) => {
                    return (
                      <TouchableOpacity key={idx}>
                        <GroupBox group={group} />
                      </TouchableOpacity>
                    )
                  })}
                </View>
              )
            })}
          </View>
        </ScrollView>
      </View>
    )
  }
}

let styles = {
  container: {
    flex: 1,
  },
  groupsContainer: {
    flexDirection: 'row'
  },
  group: {
    opacity: 0.9,
    flex: 1,
    height: 150,
  },
  groupImage: {
    height: 150,
    width: (deviceWidth / 2) - 20,
    margin: 10,
    opacity: 0.8,
  },
  h2: {
    fontSize: 22,
    fontWeight: '300',
    paddingHorizontal: 10,
  },
  groupText: {
    color: 'white',
    margin: 20,
    fontSize: 20,
    position: 'absolute',
    fontWeight: '500',
  },
  forwardButton: {
    paddingBottom: 8,
    paddingRight: 20,
    backgroundColor: 'transparent',
  }
}

module.exports = Groups
