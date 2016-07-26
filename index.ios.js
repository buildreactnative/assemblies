import React, { Component } from 'react';
import {
  AppRegistry,
  ActivityIndicator,
  View,
  Navigator,
  AsyncStorage
} from 'react-native';

import Landing from './application/components/Landing';
import Register from './application/components/accounts/Register';
import RegisterConfirmation from './application/components/accounts/RegisterConfirmation';
import Login from './application/components/accounts/Login';
import Dashboard from './application/components/Dashboard';
import { Headers } from './application/fixtures';
import { extend } from 'underscore';
import { API, DEV } from './application/config';
import { globals } from './application/styles';

const Loading = () => (
  <View style={globals.flexCenter}>
    <ActivityIndicator size='large'/>
  </View>
);

class assembliesTutorial extends Component {
  constructor(){
    super();
    this.logout = this.logout.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.state = {
      user          : null,
      ready         : false,
      initialRoute  : 'Landing',
    }
  }
  componentDidMount(){
    this._loadLoginCredentials()
  }
  async _loadLoginCredentials(){
    try {
      let sid = await AsyncStorage.getItem('sid');
      console.log('SID', sid);
      if (sid){
        this.fetchUser(sid);
      } else {
        this.ready();
      }
    } catch (err) {
      this.ready(err);
    }
  }
  ready(err){
    this.setState({ ready: true });
  }
  fetchUser(sid){
    fetch(`${API}/users/me`, { headers: extend(Headers, { 'Set-Cookie': `sid=${sid}`})})
    .then(response => response.json())
    .then(user => this.setState({ user, ready: true, initialRoute: 'Dashboard' }))
    .catch(err => this.ready(err))
    .done();
  }
  logout(){
    this.nav.push({ name: 'Landing' })
  }
  updateUser(user){
    this.setState({ user });
  }
  render() {
    if ( ! this.state.ready ) { return <Loading /> }
    return (
      <Navigator
        style={globals.flex}
        ref={(el) => this.nav = el }
        initialRoute={{ name: this.state.initialRoute }}
        renderScene={(route, navigator) => {
          switch(route.name){
            case 'Landing':
              return (
                <Landing navigator={navigator}/>
            );
            case 'Dashboard':
              return (
                <Dashboard
                  navigator={navigator}
                  logout={this.logout}
                  user={this.state.user}
                />
            );
            case 'Register':
              return (
                <Register navigator={navigator}/>
            );
            case 'RegisterConfirmation':
              return (
                <RegisterConfirmation
                  {...route}
                  updateUser={this.updateUser}
                  navigator={navigator}
                />
            );
            case 'Login':
              return (
                <Login
                  navigator={navigator}
                  updateUser={this.updateUser}
                />
            );
          }
        }}
      />
    );
  }
}

AppRegistry.registerComponent('assembliesTutorial', () => assembliesTutorial);
