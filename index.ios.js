/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import Colors from './application/styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Welcome from './application/welcome/welcome';
import Dashboard from './application/dashboard/dashboard';
import Register from './application/welcome/register';
import RegisterConfirm from './application/welcome/register_confirm';
import Login from './application/welcome/login';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
  Navigator,
} from 'react-native';

let { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class assembly extends Component {
  constructor(props){
    super(props);
    this.state = {
      foundUser: false,
      currentUser: null,
      initialRoute: 'Welcome',
      sessionId: null,
    }
  }
  componentDidMount(){
    this._loadUser()
  }
  async _loadUser(){
    try {
      var sid = await AsyncStorage.getItem('sid');
      console.log('SID', sid);
      if (sid !== null && sid !== 'false'){
        fetch("http://localhost:2403/users/me", {
          method: "GET",
          headers: {
              'Set-Cookie': `sid=${sid}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
        })
        .then((response) => response.json())
        .then((data) => {
          if (data.errors) {
            console.log(data.errors);
            this.setState({foundUser: true})
          }
          else {
            console.log('DATA', data);
            this.setState({
              foundUser: true,
              initialRoute: 'Dashboard',
              currentUser: data,
              sessionId: sid,
            })
          }
        })
        .catch((error) => {
          console.log(error)
          AsyncStorage.setItem('sid', 'false');
          this.setState({foundUser: true})
        })
        .done();
      } else {
        this.setState({foundUser: true})
        AsyncStorage.setItem('sid', 'false')
      }
    } catch (error) {
      console.log('ERR: ', error)
    }
  }
  render() {
    let {foundUser, currentUser, sessionId,} = this.state;
    if (! foundUser) {
      return <View></View>
    }
    return (
      <View style={styles.container}>
        <Navigator
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
                    navigator={navigator}
                    {...this.state}
                  />
                )
                break;
              case 'Register':
                return <Register navigator={navigator} />
                break;
              case 'Login':
                return <Login navigator={navigator} />
                break;
              case 'RegisterConfirm':
                return (
                  <RegisterConfirm
                    navigator={navigator}
                    {...route}
                  />
                )
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
