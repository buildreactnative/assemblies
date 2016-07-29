import React, { Component } from 'react';
import { Navigator } from 'react-native';

import Calendar from './Calendar';
import Event from '../groups/Event';
import { API, DEV } from '../../config';
import { extend } from 'underscore';
import { globals } from '../../styles';

class CalendarView extends Component{
  constructor(){
    super();
    this.state = {
      events  : [],
      ready   : false,
    }
  }
  _loadGroups(){
    let query = {
      members: {
        $elemMatch: {
          userId: this.props.currentUser.id
        }
      }
    };
    fetch(`${API}/groups?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(groups => this._loadEvents(groups))
    .catch(err => this.ready(err))
    .done()
  }
  ready(err){
    this.setState({ ready: true });
  }
  _loadEvents(groups){
    let dateQuery = { end: { $gt: new Date().valueOf() }};
    let query = {
      $or: [
        extend({}, dateQuery, { groupId: { $in: groups.map((g) => g.id) }}),
        extend({}, dateQuery, { going:  { $elemMatch: { $eq: this.props.currentUser.id }}}),
        extend({}, dateQuery, { 'location.city.long_name': this.props.currentUser.location.city.long_name })
      ],
      $limit: 20,
    };
    fetch(`${API}/events?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(events => this.setState({ events, ready: true }))
    .catch(err => this.ready(err))
    .done();
  }
  componentDidMount(){
    this._loadGroups();
  }
  render(){
    return (
      <Navigator
        initialRoute={{ name: 'Calendar' }}
        style={globals.flex}
        renderScene={(route, navigator) => {
          switch(route.name){
            case 'Calendar':
              return (
                <Calendar
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
          }
        }}
      />
    )
  }
};

export default CalendarView;
