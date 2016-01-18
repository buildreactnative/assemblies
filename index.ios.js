/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import Colors from './application/styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import Welcome from './application/welcome/welcome';
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
  render() {
    return (
      <View style={styles.container}>
        <Navigator
          initialRoute={{
            name: 'Welcome'
          }}
          renderScene={(route, navigator) => {
            return (
              <Welcome navigator={navigator} title={route.title} />
            )
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
