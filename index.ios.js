'use strict';

import Icon             from 'react-native-vector-icons/Ionicons';
import Colors           from './application/styles/colors';
import Welcome          from './application/welcome/welcome';
import Dashboard        from './application/dashboard/dashboard';
import Register         from './application/welcome/register';
import RegisterConfirm  from './application/welcome/register_confirm';
import Login            from './application/welcome/login';
import Logging          from './application/welcome/logging';
import DeviceInfo       from 'react-native-device-info';
import _                from 'underscore';
import {BASE_URL, DEV, HEADERS} from './application/utilities/fixtures';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  View,
  Dimensions,
  AsyncStorage,
  NativeModules,
  Navigator,
  ActivityIndicatorIOS,
} from 'react-native';

let { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
let clientId = DeviceInfo.getUniqueID();

class assembly extends Component {
  constructor(props){
    super(props);
    this.state = {
      foundUser     : false,
      currentUser   : null,
      initialRoute  : 'Welcome',
      sessionId     : null,
    }
  }
  componentDidMount(){
    if (DEV) {console.log('CLIENT ID', DeviceInfo)}
    NativeModules.SegmentAnalytics.identify(clientId);
    this._loadUser()
  }
  async _loadUser(){
    try {
      var userParams = await AsyncStorage.getItem('USER_PARAMS');
      if (userParams !== null){
        if (DEV) {console.log('USER PARAMS', userParams);}
        let parsedUser = JSON.parse(userParams);
        if (DEV) {console.log('USER PARAMS', parsedUser);}
        if (!! parsedUser && parsedUser.username && parsedUser.password){
          let errors = null;
          if (DEV) {console.log("LOGIN", `${BASE_URL}/users/login`)}
          fetch(`${BASE_URL}/users/login`, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify(parsedUser)
          })
          .then((response) => response.json())
          .then((data) => {
            if (data.errors || data.status == 401) {
              if (DEV) {console.log('LOGIN FAILED', data);}
              this.setState({foundUser: true});
            } else {
              if (DEV) {console.log('DATA', data);}
              fetch(`${BASE_URL}/users/me`, {
                method: "GET",
                headers: _.extend({'Set-Cookie': `sid=${data.id}`}, HEADERS),
              })
              .then((response) => response.json())
              .then((data) => {
                this.updateUser(data);
                this.setState({foundUser: true, initialRoute: 'Dashboard'});
              })
              .catch((error) => {
                if (DEV) {console.log(error)}
                this.setState({foundUser: true})
              })
              .done();
            }
          })
          .catch((error) => {
            if (DEV) {console.log(error)}
            this.setState({connectionError: 'Email or password was incorrect.'})
          })
          .done();
        } else {
          this.setState({foundUser: true})
        }
      } else {
        if (DEV) {console.log('COULD NOT FIND USER');}
        this.setState({foundUser: true})
      }
    } catch (error) {
      if (DEV) {console.log('ERR: ', error)}
    }
  }
  updateUser(user){
    this.setState({currentUser: user})
  }
  _loading(){
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicatorIOS size="large"/>
      </View>
    )
  }
  render(){
    let {foundUser, currentUser, sessionId,} = this.state;
    if (! foundUser) {
      return this._loading();
    }
    if (DEV) {console.log('INITIAL ROUTE', this.state.initialRoute);}
    return (
      <View style={styles.container}>
        <Navigator
          ref="navigator"
          configureScene={() => {
            return Navigator.SceneConfigs.FadeAndroid;
          }}
          initialRoute={{
            name: this.state.initialRoute
          }}
          renderScene={(route, navigator) => {
            switch(route.name) {
              case 'Welcome':
                return <Welcome navigator={navigator} />
                break;
              case 'Dashboard':
                return (
                  <Dashboard
                    {...this.state}
                    navigator={navigator}
                    updateUser={this.updateUser.bind(this)}
                  />
                )
                break;
              case 'Register':
                return <Register navigator={navigator} />
                break;
              case 'Login':
                return <Login navigator={navigator} updateUser={this.updateUser.bind(this)}/>
                break;
              case 'RegisterConfirm':
                return (
                  <RegisterConfirm
                    navigator={navigator}
                    updateUser={this.updateUser.bind(this)}
                    {...route}
                  />
                );
                break;
            }
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
});

AppRegistry.registerComponent('assembly', () => assembly);
