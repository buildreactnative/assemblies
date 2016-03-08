import Colors from '../styles/colors';
import Globals from '../styles/globals';
import _ from 'underscore';
import {BASE_URL, DEV} from '../utilities/fixtures';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  AsyncStorage,
  TextInput,
  View,
  TabBarIOS,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeModules,
  Animated,
  DeviceEventEmitter,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class ErrorMessage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      height: new Animated.Value(0),
      opacity: new Animated.Value(0),
    };
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.error != '' && nextProps.error != this.props.error){
      this._animate();
    }
  }
  componentDidMount(){
    if (this.props.error != ''){
      this._animate();
    }
  }
  _animate(){
    Animated.timing(
      this.state.height, {
        toValue: 20,
      }
    ).start()
    Animated.timing(
      this.state.opacity, {
        toValue: 1,
      }
    ).start();
  }
  render(){
    let {error} = this.props;
    return (
      <Animated.View style={{opacity: this.state.opacity, height: this.state.height}}>
        <Text style={styles.error}>{error}</Text>
      </Animated.View>
    )
  }
};

let styles = {
  error: {
    color: Colors.brandDanger,
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: '300',
    paddingVertical: 5,
  }
}

module.exports = ErrorMessage;
