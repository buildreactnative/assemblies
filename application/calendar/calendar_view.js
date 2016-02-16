import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import UpcomingAssembly from '../activity/upcoming_assembly';
import NavigationBar from 'react-native-navbar';
import {calendarFixture} from '../fixtures/calendar_fixtures';

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

class CalendarView extends React.Component{
  constructor(props){
    super(props);
    let getSectionData = (dataBlob, sectionID) => {
      return dataBlob[sectionID];
    };
    let getRowData = (dataBlob, sectionID, rowID) => {
      return dataBlob[`${sectionID}:${rowID}`]
    };
    let sections = calendarFixture,
    length = calendarFixture.length,
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
      section = sections[i];
      sectionIDs.push(section.id);
      dataBlob[section.id] = section.date;
      assemblies = section.assemblies;
      assemblyLength = assemblies.length;
      rowIDs[i] = [];
      for (j=0; j < assemblyLength; j++) {
        assembly = assemblies[j];
        rowIDs[i].push(assembly.id)
        dataBlob[section.id + ':' + j] = assembly;
      }
    }
    // console.log('DATA BLOB', dataBlob);
    this.state = {
      dataSource: new ListView.DataSource({
        getSectionData: getSectionData,
        getRowData: getRowData,
        rowHasChanged: (r1, r2) => r1 != r2,
        sectionHeaderHasChanged: (s1, s2) => s1 != s2
      })
      .cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs)
    }
  }
  _renderSectionHeader(sectionData, sectionID){
    // console.log('SECTION DATA', sectionData, sectionID)
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{moment(sectionData).format('dddd, MMM Do')} at {moment(sectionData).format('h:m')}</Text>
      </View>
    )
  }
  _renderRow(rowData, sectionID, rowID){
    return (
      <UpcomingAssembly assembly={rowData} />
    )
  }
  render(){
    let titleConfig = {title: 'Calendar', tintColor: 'white'}
    return (
      <View style={styles.container}>
        <NavigationBar
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
module.exports = CalendarView;
