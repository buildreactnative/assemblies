import React, { Component } from 'react';
import { Navigator } from 'react-native';
import { extend } from 'underscore';

import Activity from './Activity';
import Conversation from '../messages/Conversation';
import Profile from '../profile/Profile';
import Event from '../groups/Event';
import { API, DEV } from '../../config';
import { globals } from '../../styles';

class ActivityView extends Component{
  constructor(){
    super();
    this.state = {
      nextEvents      : [],
      notifications   : [],
    }
  }
  componentDidMount(){
    this._loadNotifications();
  }
  _loadNotifications(){
    let query = {
      participants: {
        $elemMatch: {
          userId: this.props.currentUser.id
        }
      }
    };
    fetch(`${API}/notifications?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(notifications => this._loadNextEvents(notifications))
    .catch(err => {})
    .done();
  }
  _loadNextEvents(notifications){
    this.setState({ notifications });
    let dateQuery = { end: { $gt: new Date().valueOf() }};
    let query = {
      $or: [
        extend({}, dateQuery, { going: { $elemMatch: { $eq: this.props.currentUser.id }}}),
        extend({}, dateQuery, { 'location.city.long_name': this.props.currentUser.location.city.long_name })
      ],
      $limit: 1,
      $sort: { createdAt: 1 }
    };
    fetch(`${API}/events?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(nextEvents => this.setState({ nextEvents }))
    .catch(err => {console.log('ERR', err)})
    .done();
  }
  render(){
    return (
      <Navigator
        style={globals.flex}
        initialRoute={{ name: 'Activity' }}
        renderScene={(route, navigator) => {
          switch(route.name){
            case 'Activity':
              return (
                <Activity
                  {...this.props}
                  {...route}
                  {...this.state}
                  navigator={navigator}
                />
            );
            case 'Event':
              return (
                <Event
                  {...this.props}
                  {...route}
                  {...this.state}
                  navigator={navigator}
                />
            );
            case 'Conversation':
              return (
                <Conversation
                  {...this.props}
                  {...route}
                  navigator={navigator}
                />
            );
            case 'Profile':
              return (
                <Profile
                  {...this.props}
                  {...route}
                  navigator={navigator}
                />
            );
          }
        }}
      />
    )
  }
}

export default ActivityView;
