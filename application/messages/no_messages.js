import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import NavigationBar from 'react-native-navbar';
import Animatable from 'react-native-animatable';
import _ from 'underscore';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  ListView,
  Image,
  TouchableOpacity,
  Navigator,
  Dimensions,
  NativeModules,
} from 'react-native';

export default class NoMessages extends Component{
  render(){
    let {text} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: '#f7f7f7',}}>
        <Animatable.View animation="fadeIn" duration={500} style={{flex: 1, alignItems: 'stretch', backgroundColor: '#f7f7f7'}}>
          <Animatable.View animation="slideInUp" duration={500} easing="ease-out" style={{flex: 1, alignItems: 'stretch', height: 50, backgroundColor: '#f7f7f7'}}>
            <View style={[{flex: 1, paddingTop: 100, paddingHorizontal: 40, alignItems: 'stretch',}, this.props.viewStyle]}>
              <Text style={[{textAlign: 'center', fontSize: 20, color: Colors.bodyTextLight, lineHeight: 26}, this.props.textStyle]}>
                {text}
              </Text>
            </View>
          </Animatable.View>
        </Animatable.View>
        <View style={{flex: 3, backgroundColor: '#f7f7f7', opacity: 0,}}></View>
      </View>
    );
  }
};

NoMessages.defaultProps = {
  textStyle: {},
  viewStyle: {},
}
