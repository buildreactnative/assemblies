import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

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
  InteractionManager,
  Navigator,
  Dimensions,
  NativeModules,
  ActivityIndicatorIOS,
} from 'react-native';

let { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const MESSAGES = [
  {from: 'Tom', message: 'Hey', timestamp: new Date(), profileUrl: 'https://avatars1.githubusercontent.com/u/10930134?v=3&s=400'},
  {from: 'Tom', message: "What's up?", timestamp: new Date(), profileUrl: 'https://avatars1.githubusercontent.com/u/10930134?v=3&s=400'},
  {from: 'Tom', message: "What's good", timestamp: new Date(), profileUrl: 'https://avatars1.githubusercontent.com/u/10930134?v=3&s=400'},
]

class MessageBox extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true,
    }
  }
  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this.setState({loading: false});
    });
  }
  _renderLoading(){
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
      </View>
    )
  }
  render(){
    let {message} = this.props;
    let messages = MESSAGES;
    messages.push({from: message.from, message: message.message, profileUrl: message.profileUrl, timestamp: message.sent})

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={()=>{
              this.props.navigator.pop();
            }}
          >
            <Icon name="ios-arrow-back" size={30} color='white'/>
          </TouchableOpacity>
          <Text style={styles.headerText}>{message.from}</Text>
        </View>
        <InvertibleScrollView>
          {MESSAGES.map((msg, idx) => {
            return (
              <View key={idx}>
                <Text>{msg.message}</Text>
              </View>
            )
          })}
        </InvertibleScrollView>
      </View>
    )
  }
}

let styles = {
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    height: deviceHeight,
  },
  sentText:{
    fontSize: 14,
    padding: 10,
    marginRight: 15,
    fontWeight: '300',
  },
  backButton: {
    position: 'absolute',
    left: 20,
  },
  backButtonText: {
    color: 'white',
  },
  fromContainer:{
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fromText:{
    fontSize: 16,
    fontWeight: '500',
  },
  messageTextContainer:{
    flex: 1,
  },
  messageText:{
    fontSize: 18,
    fontWeight: '300',
    paddingHorizontal: 15,
  },
  messageContainer:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile:{
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 10,
    marginVertical: 10,
  },

  container: {
    flex: 1,
  },
  header: {
    height: 70,
    backgroundColor: Colors.brandPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 22,
  },
}

module.exports = MessageBox;
