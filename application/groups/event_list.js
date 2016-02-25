import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import moment from 'moment';
import {truncate} from 'underscore.string';
import _ from 'underscore';
import EventItem from './event_item';
import Swipeout from 'react-native-swipeout';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  View,
  ListView,
  TabBarIOS,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeModules,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class EventList extends React.Component{
  constructor(props){
    super(props);
    let rows = props.events.map((evt) => {
      return {
        event: evt,
        right: [
          {
            text: 'Going',
            type: 'primary',
            onPress: ()=>{
              this._updateEvent(evt, 'going');
            },
          },
          {
            text: 'Maybe',
            type: 'secondary',
            onPress: ()=>{
              this._updateEvent(evt, 'maybe');
            },
          },
          {
            text: 'Not Going',
            type: 'delete',
            onPress: ()=>{
              this._updateEvent(evt, 'not going');
            },
           }
        ]
      }
    })
    console.log('ROWS', rows, props.events);
    let ds = new ListView.DataSource({rowHasChanged: (row1, row2) => true})
    this.state = {
      dataSource: ds.cloneWithRows(rows),
      scrollEnabled: true
    }
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.events != this.props.events){
      let rows = nextProps.events.map((evt) => {
        return {
          event: evt,
          right: [
            {
              text: 'Going',
              type: 'primary',
              onPress: ()=>{
                this._updateEvent(evt, 'going');
              },
            },
            {
              text: 'Maybe',
              type: 'secondary',
              onPress: ()=>{
                this._updateEvent(evt, 'maybe');
              },
            },
            {
              text: 'Not Going',
              type: 'delete',
              onPress: ()=>{
                this._updateEvent(evt, 'not going');
              },
             }
          ]
        }
      })
      console.log('ROWS', rows, nextProps.events);
      this._updateDataSource(rows);
    }
  }
  _updateEvent(evt, type){
    console.log('UPDATE EVENT', evt, type);
  }
  _allowScroll(scrollEnabled){
    this.setState({scrollEnabled: scrollEnable})
  }
  _handleSwipeout(sectionID, rowID) {
    for (var i = 0; i < rows.length; i++) {
      if (i != rowID) rows[i].active = false
      else rows[i].active = true
    }
    this._updateDataSource(rows)
  }
  _updateDataSource(data) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(data)
    })
  }
  _renderRow(rowData: string, sectionID: number, rowID: number) {
    return (
      <Swipeout
        backgroundColor="white"
        rowID={rowID}
        right={rowData.right}
        sectionID={sectionID}>
        <View style={styles.eventContainer}>
          <TouchableOpacity style={styles.eventInfo}
            onPress={()=>{
              this.props.navigator.push({
                name: 'Event',
                event: rowData.event,
                group: this.props.group,
              })
            }}
          >
            <Text style={styles.h5}>{rowData.event.name}</Text>
            <Text style={styles.h4}>{moment(rowData.event.start).format('dddd, MMM Do')}</Text>
            <Text style={styles.h4}>{100} Going</Text>
          </TouchableOpacity>
          <View style={styles.goingContainer}>
            <Text style={styles.goingText}>{!! true ? "You're Going" : "Want to go?"}</Text>
            <Icon name="checkmark-circled" size={30} color="green" />
          </View>
        </View>
      </Swipeout>
    )
  }
  render(){
    let {group, currentUser, events, navigator} = this.props;
    console.log('EVENT LIST', this.state.dataSource);
    return (
      <View style={styles.container}>
        <View style={styles.statusbar}/>
        <ListView
          scrollEnabled={this.state.scrollEnabled}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          style={styles.listview}/>
      </View>
    )
  }
}

let styles = {
  backButton: {
    paddingLeft: 20,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  addButton: {
    backgroundColor: 'transparent',
    paddingRight: 20,
    paddingBottom: 10,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  topImage: {
    width: deviceWidth,
    height: 200,
    flexDirection: 'column',
  },
  overlayBlur: {
    backgroundColor: '#333',
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  container: {
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  listview: {
    flex: 1,
  },
  li: {
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  liContainer: {
    flex: 2,
  },
  liText: {
    color: '#333',
    fontSize: 16,
  },
  navbar: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    justifyContent: 'center',
    height: 44,
  },
  navbarTitle: {
    color: '#444',
    fontSize: 16,
    fontWeight: "500",
  },
  statusbar: {
    backgroundColor: '#fff',
    height: 22,
  },
  h1: {
    fontSize: 22,
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomPanel: {
    flex: 0.3,
    backgroundColor: 'white',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberText: {
    textAlign: 'center',
    color: Colors.brandPrimary,
    fontSize: 18,
    fontWeight: '400',
  },
  h4: {
    fontSize: 18,
    fontWeight: '300',
  },
  h3: {
    fontSize: 18,
    color: Colors.brandPrimary,
    paddingHorizontal: 18,
    paddingVertical: 5,
    fontWeight: '500',
  },
  break: {
    height: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginHorizontal: 15,
    marginVertical: 5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '300',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  eventContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  joinContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  joinButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: Colors.brandPrimary,
  },
  joinText: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlign: 'center',
  },
  joinIcon: {
    paddingVertical: 10,
  },
  eventInfo: {
    flex: 1,
  },
  h5: {
    fontSize: 18,
    fontWeight: '500',
  },
  goingContainer: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goingText: {
    fontSize: 17,
    color: Colors.brandPrimary
  },
  memberContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  avatar: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  memberInfo: {
    paddingLeft: 30,
  },
}

module.exports = EventList;
