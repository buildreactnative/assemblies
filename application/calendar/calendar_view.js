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
  Image,
  ListView,
  TouchableOpacity,
  Dimensions,
  NativeModules,
} from 'react-native';

const CALENDAR = [
  {date: new Date(), id: 0, assemblies: [
    {
      id: 0,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 1,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 2,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
  ]},
  {date: new Date(), id: 1, assemblies: [
    {
      id: 0,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 1,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 2,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
  ]},
  {date: new Date(), id: 2, assemblies: [
    {
      id: 0,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 1,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 2,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
  ]},
  {date: new Date(), id: 3, assemblies: [
    {
      id: 0,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 1,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 2,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
  ]},
  {date: new Date(), id: 4, assemblies: [
    {
      id: 0,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 1,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 2,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
  ]},
  {date: new Date(), id: 5, assemblies: [
    {
      id: 0,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 1,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 2,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
  ]},
  {date: new Date(), id: 6, assemblies: [
    {
      id: 0,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 1,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 2,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
  ]},
]

class CalendarView extends React.Component{
  constructor(props){
    super(props);
    let getSectionData = (dataBlob, sectionID) => {
      return dataBlob[sectionID];
    };
    let getRowData = (dataBlob, sectionID, rowID) => {
      return dataBlob[`${sectionID}:${rowID}`]
    };
    let sections = CALENDAR,
    length = CALENDAR.length,
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
    console.log('DATA BLOB', dataBlob);
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
    return (
      <View>
        <Text>{moment(sectionData.date).format('dddd, MMM DDDo')} at {moment(sectionData.date).format('h:m')}</Text>
      </View>
    )
  }
  _renderRow(rowData, sectionID, rowID){
    return (
      <View>
        <Text>ROW DATA</Text>
      </View>
    )
  }
  render(){
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Calendar</Text>
        </View>
        <ListView
          style={styles.listView}
          ref="assemblyList"
          contentInset={{bottom: 69}}
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
  container: {},
  header: {},
  headerText: {},
  listView: {},
}
module.exports = CalendarView;
