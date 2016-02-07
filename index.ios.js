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

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Navigator,
} from 'react-native';

let { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class assembly extends Component {
  constructor(props){
    super(props);
    this.state = {
      foundUser: false,
      currentUser: null,
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Navigator
          configureScene={() => {
            return Navigator.SceneConfigs.FadeAndroid;
          }}
          initialRoute={{
            name: 'Welcome'
          }}
          renderScene={(route, navigator) => {
            switch(route.name) {
              case 'Welcome':
                return <Welcome navigator={navigator} />
                break;
              case 'Dashboard':
                return <Dashboard navigator={navigator} />
                break;
              case 'Register':
                return <Register navigator={navigator} />
                break;
              case 'RegisterConfirm':
                return <RegisterConfirm navigator={navigator} />
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
