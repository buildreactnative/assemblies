import Colors from '../styles/colors';
import Globals from '../styles/globals';
import _ from 'underscore';
import {BASE_URL, DEV, HEADERS} from '../utilities/fixtures';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  AsyncStorage,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
  InteractionManager,
} from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export default class Logging extends Component{
  constructor(props){
    super(props);
    this.state = {
      connectionError: 'none',
    };
  }
  componentDidMount(){
    let sid = this.props.sessionId;
    let headers = _.extend({}, {'Set-Cookie': 'sid=' + sid}, HEADERS);
    if (DEV) {console.log('HEADERS', headers);}
    fetch(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: _.extend({'Set-Cookie': 'sid=' + sid}, HEADERS),
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({connectionError: data.id})
    })
    .catch((error) => {
      if (DEV) {console.log(error)}
      this.setState({connectionError: 'Connection error.'})
    })
    .done();
  }
  render(){
    console.log('LOGGING IN', this.props.sessionId);
    return (
      <View><Text>{this.state.connectionError}</Text></View>
    )
  }
}
