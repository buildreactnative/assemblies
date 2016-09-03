import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';

import Colors from '../../styles/colors';
import Loading from '../shared/Loading';
import { globals, groupsStyles } from '../../styles';

const styles = groupsStyles;

export function formatGroups(groups){
  if (groups.length % 2 === 1 ){
    return groups.concat(null);
  } else {
    return groups;
  }
};

const AddGroupBox = ({ handlePress }) => (
  <TouchableOpacity
    onPress={handlePress}
    style={styles.groupImage}>
    <View style={[styles.groupBackground, globals.inactive]} >
      <Icon name="add-circle" size={60} color={Colors.brandPrimary} />
    </View>
  </TouchableOpacity>
);

export const EmptyGroupBox = () => (
  <View style={styles.groupsContainer}>
    <View style={styles.groupImage}>
      <View style={[styles.groupBackground, globals.inactive]} />
    </View>
  </View>
);

const EmptyGroupBoxes = ({ handlePress }) => (
  <View style={styles.boxContainer}>
    <View style={globals.flexRow}>
      <AddGroupBox handlePress={handlePress}/>
      <EmptyGroupBox />
    </View>
  </View>
);

const EmptySuggestedGroupBoxes = () => (
  <View style={styles.boxContainer}>
    <View style={globals.flexRow}>
      <EmptyGroupBox />
      <EmptyGroupBox />
    </View>
  </View>
)

export const GroupBoxes = ({ groups, visitGroup, visitCreateGroup }) => {
  console.log('GROUPS', groups);
  if (! groups.length ) { return <EmptyGroupBoxes handlePress={visitCreateGroup}/> }
  return (
    <View style={styles.boxContainer}>
      {groups.map((group, idx) => {
        if (!group) { return <EmptyGroupBox key={idx}/>}
        return (
          <TouchableOpacity key={idx} style={globals.flexRow} onPress={() => visitGroup(group)}>
            <Image source={{uri: group.image}} style={styles.groupImage}>
              <View style={[styles.groupBackground, {backgroundColor: group.color,}]} >
                <Text style={styles.groupText}>{group.name}</Text>
              </View>
            </Image>
          </TouchableOpacity>
        )
      })}
    </View>
  );
}

const SuggestedGroupBoxes = ({ groups, visitGroup }) => {
  if (! groups.length ) { return <EmptySuggestedGroupBoxes /> }
  return (
    <View style={styles.boxContainer}>
      {groups.map((group, idx) => {
        if (!group) { return <EmptyGroupBox key={idx}/>}
        return (
          <TouchableOpacity key={idx} style={globals.flexRow} onPress={() => visitGroup(group)}>
            <Image source={{uri: group.image}} style={styles.groupImage}>
              <View style={[styles.groupBackground, {backgroundColor: group.color,}]} >
                <Text style={styles.groupText}>{group.name}</Text>
              </View>
            </Image>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const AddButton = ({ handlePress }) => (
  <TouchableOpacity style={globals.pa1} onPress={handlePress}>
    <Icon name="add-circle" size={25} color="#ccc" />
  </TouchableOpacity>
)

class Groups extends Component{
  constructor(){
    super();
    this.visitCreateGroup = this.visitCreateGroup.bind(this);
    this.visitGroup = this.visitGroup.bind(this);
  }
  visitGroup(group){
    this.props.navigator.push({
      name: 'Group',
      group
    })
  }
  visitCreateGroup(){
    this.props.navigator.push({ name: 'CreateGroup' })
  }
  render(){
    let { groups, suggestedGroups, ready, navigator } = this.props;
    if (! ready ) { return <Loading /> }
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          title={{title: 'My Groups', tintColor: 'white'}}
          tintColor={Colors.brandPrimary}
          rightButton={<AddButton handlePress={this.visitCreateGroup}/>}
        />
        <ScrollView style={[globals.flex, globals.mt1]}>
          <Text style={[globals.h4, globals.mh2]}>Your Assemblies</Text>
          <GroupBoxes
            groups={formatGroups(groups)}
            navigator={navigator}
            visitGroup={this.visitGroup}
            visitCreateGroup={this.visitCreateGroup}
          />
          <Text style={[globals.h4, globals.mh2]}>You Might Like</Text>
          <SuggestedGroupBoxes
            groups={formatGroups(suggestedGroups)}
            navigator={navigator}
            visitGroup={this.visitGroup}
          />
        </ScrollView>
      </View>
    )
  }
};

export default Groups;
