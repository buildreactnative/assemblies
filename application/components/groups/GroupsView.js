import React, { Component } from 'react';
import { Navigator } from 'react-native';
import { find, isEqual } from 'underscore';

import Groups from './Groups';
import Headers from '../../fixtures';
import { API, DEV } from '../../config';
import { globals } from '../../styles';

class GroupsView extends Component{
  constructor(){
    super();
    this.state = {
      groups            : [],
      ready             : false,
      suggestedGroups   : [],
    }
  }
  componentWillMount(){
    this._loadGroups(this.props.currentUser);
  }
  _loadGroups(currentUser){ /* fetch all groups that the current user belongs to */
    let query = {
      members: {
        $elemMatch: { userId: currentUser.id }
      },
      $limit: 10
    };
    fetch(`${API}/groups/?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(groups => this._loadSuggestedGroups(groups))
    .catch(err => this.ready(err))
    .done();
  }
  _loadSuggestedGroups(groups){
    this.setState({ groups, ready: true });
    let query = { /* query groups that the user does not belong to but are nearby */
      id: { $nin: groups.map(group => group.id) },
      'location.city.long_name': this.props.currentUser.location.city.long_name,
      $limit: 4
    };
    fetch(`${API}/groups/?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(suggestedGroups => this.setState({ suggestedGroups }))
    .catch(err => this.ready(err))
    .done();
  }
  ready(err){
    this.setState({ ready: true })
  }
  render(){
    return (
      <Navigator
        style={globals.flex}
        initialRoute={{ name: 'Groups' }}
        renderScene={(route, navigator) => {
          switch(route.name){
            case 'Groups':
              return (
                <Groups
                  {...this.props}
                  {...this.state}
                  navigator={navigator}
                />
            );
          }
        }}
      />
    );
  }
};

export default GroupsView;
