import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import NavigationBar from 'react-native-navbar';
import Animatable from 'react-native-animatable';

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

class MessagesList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 != r2
      })
      .cloneWithRows(props.dataSource)
    }
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.dataSource != this.props.dataSource){
      this.setState({
        dataSource: new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 != r2
        })
        .cloneWithRows(nextProps.dataSource)
      })
    }
  }
  _renderRow(rowData){
    console.log('DATA', rowData);
    return (
      <TouchableOpacity onPress={()=>{
        this.props.navigator.push({
          name: 'Message',
          userIds: rowData.participants,
        })
      }}>
        <View style={styles.messageContainer}>
          <Image style={styles.profile} source={{uri: rowData.senderAvatar}}/>
          <View style={styles.messageTextContainer}>
            <View style={styles.fromContainer}>
              <Text style={styles.fromText}>{rowData.senderName}</Text>
              <Text style={styles.sentText}>{moment(new Date(parseInt(rowData.createdAt))).fromNow()}</Text>
            </View>
            <Text style={styles.messageText}>{rowData.text}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  _renderBackButton(){
    return (
      <TouchableOpacity onPress={()=>{
        this.props.navigator.pop();
      }}>
        <Icon name="ios-arrow-back" size={25} color="white" style={{paddingBottom: 3, paddingLeft: 20,}}/>
      </TouchableOpacity>
    )
  }
  _renderListView(){
    return (
      <ListView
        dataSource={this.props.dataSource}
        contentInset={{bottom: 49}}
        automaticallyAdjustContentInsets={false}
        ref="messagesList"
        renderRow={this._renderRow.bind(this)}
      />
    )
  }
  _renderNoMessages(){
    return(
      <View style={{flex: 1, backgroundColor: '#f7f7f7',}}>
        <Animatable.View animation="fadeIn" duration={500} style={{flex: 1, alignItems: 'stretch', backgroundColor: '#f7f7f7'}}>
          <Animatable.View animation="slideInUp" duration={500} easing="ease-out" style={{flex: 1, alignItems: 'stretch', height: 50, backgroundColor: '#f7f7f7'}}>
            <View style={{flex: 1, paddingTop: 100, paddingHorizontal: 40, alignItems: 'stretch',}}>
              <Text style={{textAlign: 'center', fontSize: 20, color: Colors.bodyTextLight, lineHeight: 26}}>You havent added any favorite verses yet. Tap the heart icon next to a verse to save it here.</Text>
            </View>
          </Animatable.View>
        </Animatable.View>
        <View style={{flex: 3, backgroundColor: '#f7f7f7', opacity: 0,}}></View>
      </View>
    )
  }
  render(){
    let titleConfig = {title: 'Messages', tintColor: 'white'};
    let back = this._renderBackButton();
    let listView = this._renderListView();
    return (
      <View style={styles.container}>
        <NavigationBar
          tintColor={Colors.brandPrimary}
          title={titleConfig}
        />

        {this.props.dataSource.length ? this._renderListView() : this._renderNoMessages()}
      </View>
    )
  }
}

let styles = {
  sentText:{
    fontSize: 14,
    padding: 10,
    marginRight: 15,
    fontWeight: '300',
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

module.exports = MessagesList;
