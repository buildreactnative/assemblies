import _                from 'underscore';
import NavigationBar    from '../third_party/react-native-navbar/index';
import Icon             from 'react-native-vector-icons/Ionicons';
import moment           from 'moment';
import CalendarSection  from './calendar_section';
import Colors           from '../styles/colors';
import UpcomingAssembly from '../activity/upcoming_assembly';
import {calendarFixture} from '../fixtures/calendar_fixtures';
import {DEV, HEADERS, BASE_URL} from '../utilities/fixtures';
import NoMessages       from '../messages/no_messages';

import React, {
  Component,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  ActivityIndicatorIOS,
  Dimensions,
  NativeModules,
} from 'react-native';

let getSectionData = (dataBlob, sectionID) => {
  return dataBlob[sectionID];
};
let getRowData = (dataBlob, sectionID, rowID) => {
  return dataBlob[`${sectionID}:${rowID}`]
};

class CalendarList extends React.Component{
  constructor(props){
    super(props);
    this.state = this._loadData(this.props.allEvents)
  }
  componentDidMount(){
    if (DEV) {console.log('EVENTS', this.props.allEvents);}
    if (! this.props.fetchedAllEvents || ! this.props.fetchedAllEventsGroups){
      this._fetchAllEvents();
    }
  }
  _fetchAllEvents(){
    let {currentUser} = this.props;
    let d = new Date();
    d.setHours(0);
    let url = `${BASE_URL}/events?{"$and": [{"start": {"$gt": ${JSON.stringify(d.valueOf())} }}]}`;
    fetch(url, {
      method: "GET",
      headers: HEADERS,
    })
    .then((response) => response.json())
    .then((data) => {
      if (DEV) {console.log('EVENTS ALL', data);}
      let allEvents = data;
      let groupIds = data.map((evt) => evt.groupId);

      let url = `${BASE_URL}/groups?{"id": {"$in": ${JSON.stringify(groupIds)}}}`
      if (DEV) {console.log('URL', url)}
      fetch(url, {
        method: "GET",
        headers: HEADERS,
      })
      .then((response) => response.json())
      .then((data) => {
        if (DEV) {console.log('DATA GROUPS', data)}
        this.props.sendData({
          allEvents               : allEvents,
          allEventsGroups         : data,
          fetchedAllEvents        : true,
          fetchedAllEventsGroups  : true,
        });
      })
      .catch((error) => {
        if (DEV) {console.log(error)}
      }).done();
    })
    .catch((err) => {
      if (DEV) {console.log('ERR:', err);}
    }).done();
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.allEvents != this.props.allEvents ||
        nextProps.allEventsGroups != this.props.allEventsGroups
    ) {
      let newState = this._loadData(nextProps.allEvents)
      if (newState){
        this.setState(newState);
      }
    }
  }
  _loadData(events){
    if (DEV) {console.log('EVENTS DATA', events);}
    if (! events ) {
      return;
    }
    let dates = {};
    events.forEach((evt) => {
      let evtDate = new Date(parseInt(evt.start));
      let month = evtDate.getMonth()+1;
      let date = evtDate.getDate();
      let year = evtDate.getFullYear();
      let dateString = `${month}/${date}/${year}`;
      if (dates[dateString]) {
        dates[dateString].push(evt);
      } else {
        dates[dateString] = [evt];
      }
    })
    if (DEV) {console.log('DATES', dates);}
    let sections = Object.keys(dates),
    length = Object.keys(dates).length,
    dataBlob = {},
    sectionIDs = [],
    rowIDs = [],
    section,
    assemblies,
    assemblyLength,
    assembly,
    i,
    j;

    for (i=0; i < length; i++) {
      section = {date: new Date(sections[i]), id: i.toString(), assemblies: dates[sections[i]]};
      if (DEV) {console.log('SECTION', section);}
      sectionIDs.push(i.toString());
      dataBlob[section.id] = section.date;
      assemblies = section.assemblies;
      assemblyLength = assemblies.length;
      rowIDs[i] = [];
      for (j=0; j < assemblyLength; j++) {
        assembly = assemblies[j];
        rowIDs[i].push(j.toString())
        dataBlob[section.id + ':' + j] = assembly;
      }
    }
    if (DEV) {console.log('DATA BLOB PRE', dataBlob, sectionIDs, rowIDs);}
    return {
      dataSource: new ListView.DataSource({
        getSectionData: getSectionData,
        getRowData: getRowData,
        rowHasChanged: (r1, r2) => r1 != r2,
        sectionHeaderHasChanged: (s1, s2) => s1 != s2
      })
      .cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs)
    };
  }
  _renderSectionHeader(sectionData, sectionID){
    if (DEV) {console.log('SECTION DATA', sectionData, sectionID)}
    return (
      <CalendarSection sectionData={sectionData}/>
    )
  }
  _renderRow(rowData, sectionID, rowID){
    if (DEV) {console.log('ROW DATA', rowData, this.props.groups);}
    let group = _.find(this.props.allEventsGroups, (g) => {
      return g.id == rowData.groupId
    })
    if (DEV) {console.log('GROUP', group);}
    return (
      <TouchableOpacity onPress={()=>{
        this.props.navigator.push({
          name: 'Event',
          event: rowData,
          group: group,
        })
      }}>
        <UpcomingAssembly event={rowData} groups={this.props.allEventsGroups} currentUser={this.props.currentUser}/>
      </TouchableOpacity>
    )
  }
  _renderListView(){
    return (
      <ListView
        style={styles.listView}
        initialListSize={7}
        ref="assemblyList"
        contentInset={{bottom: 49}}
        automaticallyAdjustContentInsets={false}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)}
        renderSectionHeader={this._renderSectionHeader.bind(this)}
      />
    );
  }
  _renderEmptyCalendar(){
    if ( this.props.fetchedAllEvents && this.props.fetchedAllEventsGroups){
      return (
        <NoMessages text='No events scheduled. Explore groups in the groups tab or create your own to start an event.'/>
      );
    } else {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicatorIOS size='large' />
        </View>
      )
    }
  }
  render(){
    let titleConfig = {title: 'Calendar', tintColor: 'white'}
    if (DEV) {console.log('DATA SOURCES', this.state, this.props)}
    return (
      <View style={styles.container}>
        <NavigationBar
          statusBar={{style: 'light-content', hidden: false}}
          tintColor={Colors.brandPrimary}
          title={titleConfig}/>
        {this.props.allEvents.length ? this._renderListView() : this._renderEmptyCalendar()}
      </View>
    )
  }
}

let styles = {
  container: {
    flex: 1,
  },
  sectionHeader: {
    backgroundColor: Colors.inactive,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  sectionHeaderText: {
    color: Colors.brandPrimaryDark,
    fontSize: 20,
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
  listView: {},
}
module.exports = CalendarList;
