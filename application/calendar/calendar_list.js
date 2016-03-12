import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import UpcomingAssembly from '../activity/upcoming_assembly';
import NavigationBar from 'react-native-navbar';
import CalendarSection from './calendar_section';
import {calendarFixture} from '../fixtures/calendar_fixtures';
import {DEV} from '../utilities/fixtures';
import _ from 'underscore';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  Image,
  ListView,
  TouchableOpacity,
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
    this.state = this._loadData(this.props.events)
  }
  componentDidMount(){
    if (DEV) {console.log('EVENTS', this.props.events);}
    let newState = this._loadData(this.props.events);
    if (newState) {
      this.setState(newState);
    }
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.events != this.props.events) {
      let newState = this._loadData(nextProps.events)
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
    if (DEV) {console.log('ROW DATA', rowData);}
    let group = _.find(this.props.groups, (g) => {
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
        <UpcomingAssembly event={rowData} groups={this.props.groups}/>
      </TouchableOpacity>
    )
  }
  render(){
    let titleConfig = {title: 'Calendar', tintColor: 'white'}
    if (DEV) {console.log('DATA SOURCES', this.state.dataSource)}
    return (
      <View style={styles.container}>
        <NavigationBar
          statusBar={{style: 'light-content', hidden: false}}
          tintColor={Colors.brandPrimary}
          title={titleConfig}
        />
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
