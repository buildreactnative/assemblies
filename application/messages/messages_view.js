import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

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
  Dimensions,
  NativeModules,
} from 'react-native';

const MESSAGES = [
  {from: 'Alim', sent: new Date(), message: 'Hello world'},
  {from: 'Alim', sent: new Date(), message: 'Hello world'},
  {from: 'Alim', sent: new Date(), message: 'Hello world'},
  {from: 'Alim', sent: new Date(), message: 'Hello world'},
  {from: 'Alim', sent: new Date(), message: 'Hello world'},
  {from: 'Alim', sent: new Date(), message: 'Hello world'},
  {from: 'Alim', sent: new Date(), message: 'Hello world'},
  {from: 'Alim', sent: new Date(), message: 'Hello world'},
  {from: 'Alim', sent: new Date(), message: 'Hello world'},
  {from: 'Alim', sent: new Date(), message: 'Hello world'},
]
class MessagesView extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
      })
      .cloneWithRows(MESSAGES)
    }
  }
  _renderRow(rowData){
    console.log('DATA', rowData);
    return (
      <View style={styles.messageContainer}>
        <Image style={styles.profile} source={{uri: 'https://avatars1.githubusercontent.com/u/10930134?v=3&s=400'}}/>
        <View style={styles.messageTextContainer}>
          <View style={styles.fromContainer}>
            <Text style={styles.fromText}>{rowData.from}</Text>
            <Text style={styles.sentText}>{moment(rowData.sent).fromNow()}</Text>
          </View>
          <Text style={styles.messageText}>{rowData.message}</Text>
        </View>
      </View>
    )
  }
  render(){
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Messages</Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          contentInset={{bottom: 49}}
          automaticallyAdjustContentInsets={false}
          ref="messagesList"
          renderRow={this._renderRow.bind(this)}
        />
      </View>
    )
  }
}

let styles = {
  sentText:{
    fontSize: 14,
    padding: 10,
    marginRight: 15,
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

module.exports = MessagesView;
