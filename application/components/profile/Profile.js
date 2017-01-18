import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import React, { Component } from 'react';
import { ScrollView, Text, View, Image, TouchableOpacity } from 'react-native';

import Colors from '../../styles/colors';
import BackButton from '../shared/BackButton';
import {API, DEV} from '../../config';
import { globals, groupsStyles, profileStyles } from '../../styles';
import { EmptyGroupBox } from '../groups/Groups';

const styles = profileStyles;

function formatGroups(groups){
  if (groups.length % 2 === 1 ){
    return groups.concat(null);
  } else {
    return groups;
  }
};

const GroupBoxes = ({ groups}) => {
  return (
    <View style={groupsStyles.boxContainer}>
      {groups.map((group, idx) => {
        if (!group) { return <EmptyGroupBox key={idx}/>}
        return (
          <View key={idx} style={globals.flexRow}>
            <Image source={{uri: group.image}} style={groupsStyles.groupImage}>
              <View style={[groupsStyles.groupBackground, {backgroundColor: group.color,}]} >
                <Text style={groupsStyles.groupText}>{group.name}</Text>
              </View>
            </Image>
          </View>
        );
      })}
    </View>
  );
}

class Profile extends React.Component{
  constructor(props){
    super(props);
    this.goBack = this.goBack.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.state = {
      groups: []
    }
  }
  componentDidMount(){
    let query = {
      members: {
        $elemMatch: {userId: this.props.user.id}
      }
    };
    fetch(`${API}/groups?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(groups => this.setState({ groups }))
    .catch(err => console.log('ERR:', err))
    .done();
  }
  sendMessage(){
    this.props.navigator.push({
      name: 'Conversation',
      user: this.props.user
    });
  }
  goBack(){
    this.props.navigator.pop();
  }
  render(){
    let { user } = this.props;
    let title = `${user ? user.firstName : "User"}'s Profile`;
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          tintColor={Colors.brandPrimary}
          title={{title: title, tintColor: 'white'}}
          leftButton={<BackButton handlePress={this.goBack}/> }
        />
        <ScrollView style={[globals.flex, globals.mt1]}>
          <View style={styles.avatarContainer}>
            <Image source={{uri: user.avatar}} style={styles.avatar}/>
          </View>
          <Text style={[globals.h4, globals.centerText]}>{user.firstName} {user.lastName}</Text>
          <Text style={[globals.h5, globals.centerText]}>
            {user && user.location && user.location.city ? user.location.city.long_name : ''},
            {" "}
            {user && user.location && user.location.state ? user.location.state.long_name : ''}
          </Text>
          <TouchableOpacity style={[globals.row, globals.mv2]} onPress={this.sendMessage}>
            <Icon name="ios-chatboxes" size={40} style={globals.mr1} color={Colors.brandPrimary}/>
            <Text style={globals.h5}>Send a Message</Text>
          </TouchableOpacity>
          <View style={globals.lightDivider}></View>
          <View style={globals.ph1}>
            <Text style={[globals.h4, globals.ma1]}>Technologies</Text>
            <Text style={[globals.h5, globals.primaryText, globals.ma1]}>{user.technologies.join(', ')}</Text>
            <Text style={[globals.h4, globals.ma1]}>Assemblies</Text>
          </View>

          <View style={globals.flex}>
            <GroupBoxes groups={formatGroups(this.state.groups)} />
          </View>
        </ScrollView>
      </View>
    )
  }
};

export default Profile;
