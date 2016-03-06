import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import NavigationBar from 'react-native-navbar';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import _ from 'underscore';
import {autocompleteStyles} from '../utilities/style_utilities';
import CalendarPicker from '../third_party/calendar/CalendarPicker';
import Picker from 'react-native-picker';
import {TECHNOLOGIES, BASE_URL, TIMES_RANGE} from '../utilities/fixtures';
import {
  overlayStyles,
  optionTextStyles,
  optionStyles,
  selectStyles,
} from '../utilities/style_utilities'
import DropDown, {
  Select,
  Option,
  OptionList,
} from '../select/index';
import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  TextInput,
  View,
  TabBarIOS,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeModules,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
let UIImagePickerManager = require('NativeModules').UIImagePickerManager;

class CreateEventConfirm extends React.Component{
  constructor(props){
    super(props);
    let today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    this.state = {
      date: today,
      duration: '2 hours',
      capacity: '100 people',
      time: '6:00 pm',
      showCalendar: false,
      showTime: false,
      showDuration: false,
      showCapacity: false,
      choseDate: false,
      choseTime: false,
      choseDuration: false,
      choseCapacity: false,
    }
  }
  onDateChange(date){
    let oldDate = this.state.date;
    let month = oldDate.getMonth();
    let year = oldDate.getFullYear();
    let day = oldDate.getDate();
    let nextDate = new Date(year, month, day);
    nextDate.setMonth(nextDate.getMonth() + 1);
    let prevDate = new Date(year, month, day);
    prevDate.setMonth(prevDate.getMonth() - 1);
    console.log('NEW DATE', this.state.date, date, nextDate, prevDate);
    if (date.valueOf() != nextDate.valueOf() && date.valueOf() != prevDate.valueOf()){
      this.setState({date: date, choseDate: true, showCalendar: false})
    } else {
      this.setState({date: date})
    }
  }
  _createNotification(data){
    let {currentUser, group} = this.props;
    let url = `${BASE_URL}/notifications`;
    let relatedUserIds = {};
    Object.keys(group.members).forEach((m) => {
      relatedUserIds[m] = {seen: false}
    })
    relatedUserIds[currentUser.id] = {seen: true};
    let notification = {
      type: 'event',
      relatedUserIds: relatedUserIds,
      message: `New event in ${group.name}`,
      timestamp: new Date().valueOf(),
      eventId: data.id,
      seen: false,
    };
    console.log('NOTIFICATION PARAMS', notification);
    fetch(url, {
      method: "POST",
      headers: {
        'Accept':'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notification)
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('NOTIFICATION', data);
    })
    .catch((err) => {console.log('ERR: ', err)})
  }

  _renderBackButton(){
    return (
      <TouchableOpacity style={styles.backButton} onPress={()=>{
        this.props.navigator.pop();
      }}>
        <Icon name="ios-arrow-back" size={25} color="#ccc" />
      </TouchableOpacity>
    )
  }
  _renderDuration(){
    return (
      <Picker
        ref="picker"
        pickerHeight={300}
        showDuration={300}
        pickerCancelBtnText='Cancel'
        pickerBtnText='Confirm'
        onValueChange={(val)=>this.setState({duration: val})}
        pickerTitle="Event Duration"
        pickerData={['1 hour', '2 hours', '3 hours', '4 hours', '5 hours']}//picker`s value List
        selectedValue={this.state.duration}//default to be selected value
        onPickerDone={()=>{
          this.setState({showDuration: false, choseDuration: true,})
        }}
        onPickerCancel={()=>{
          this.setState({showDuration: false,})
        }}
      />
    )
  }
  _renderCapacity(){
    return (
      <Picker
        ref="capacity"
        pickerHeight={300}
        showDuration={300}
        pickerCancelBtnText='Cancel'
        pickerBtnText='Confirm'
        onValueChange={(val)=>this.setState({capacity: val})}
        pickerTitle="Event Duration"
        pickerData={_.range(30).map((num) => `${(num+1)*10} people`)}//picker`s value List
        selectedValue={this.state.capacity}//default to be selected value
        onPickerDone={()=>{
          this.setState({showCapacity: false, choseCapacity: true,})
        }}
        onPickerCancel={()=>{
          this.setState({showCapacity: false,})
        }}
      />
    )
  }
  _renderCalendar(){
    return (
      <CalendarPicker
        selectedDate={this.state.date}
        onDateChange={this.onDateChange.bind(this)}
      />
    )
  }
  _renderTime(){
    // console.log('TIMES', TIMES_RANGE);
    return (
      <Picker
        ref="time"
        pickerHeight={300}
        showDuration={300}
        pickerCancelBtnText='Cancel'
        pickerBtnText='Confirm'
        onValueChange={(val)=>{
          console.log('VAL', val);
          this.setState({time: val[0]})
        }}
        pickerTitle="Event Duration"
        pickerData={TIMES_RANGE}//picker`s value List
        selectedValue={this.state.time}//default to be selected value
        onPickerDone={()=>{
          this.setState({showTime: false, choseTime: true,})
        }}
        onPickerCancel={()=>{
          this.setState({showTime: false})
        }}
      />
    )
  }
  render(){
    console.log('RENDER')
    let titleConfig = {title: 'Create Assembly', tintColor: 'white'}
    let leftButtonConfig = this._renderBackButton();
    return (
      <View style={styles.container}>
        <NavigationBar
          title={titleConfig}
          tintColor={Colors.brandPrimary}
          leftButton={leftButtonConfig}
        />
        <ScrollView style={styles.formContainer}>
          <Text style={styles.h4}>When is the event date?</Text>
          <View style={styles.formField}>
            <TouchableOpacity
              onPress={()=>this.setState({showCalendar: ! this.state.showCalendar})}
              style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={styles.input}>{this.state.choseDate ? moment(this.state.date).format('dddd, MMM Do') : 'Choose a date'}</Text>
              <Icon name="ios-arrow-forward" color='#777' size={30} style={{marginRight: 15}}/>
            </TouchableOpacity>
          </View>
          {this.state.showCalendar ? this._renderCalendar() : null}
          <Text style={styles.h4}>When does it start?</Text>
          <View style={styles.formField}>
            <TouchableOpacity
              onPress={()=>this.setState({showTime: ! this.state.showTime})}
              style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={styles.input}>{this.state.choseTime ? this.state.time : 'Choose a time'}</Text>
              <Icon name="ios-arrow-forward" color='#777' size={30} style={{marginRight: 15}}/>
            </TouchableOpacity>
          </View>
          {this.state.showTime ? this._renderTime() : null}
          <Text style={styles.h4}>How long will it last?</Text>
          <View style={styles.formField}>
            <TouchableOpacity
              onPress={()=>this.setState({showDuration: ! this.state.showDuration})}
              style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={styles.input}>{this.state.choseDuration ? this.state.duration: 'Choose a duration'}</Text>
              <Icon name="ios-arrow-forward" color='#777' size={30} style={{marginRight: 15}}/>
            </TouchableOpacity>
          </View>
          {this.state.showDuration ? this._renderDuration() : null}
          <Text style={styles.h4}>Attendee capacity</Text>
          <View style={styles.formField}>
            <TouchableOpacity
              onPress={()=>this.setState({showCapacity: ! this.state.showCapacity})}
              style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={styles.input}>{this.state.choseCapacity ? this.state.capacity : 'Choose a duration'}</Text>
              <Icon name="ios-arrow-forward" color='#777' size={30} style={{marginRight: 15}}/>
            </TouchableOpacity>
          </View>
          {this.state.showCapacity ? this._renderCapacity() : null}
        </ScrollView>
        <TouchableOpacity
          onPress={()=>{
            let {date, duration, capacity, time} = this.state;
            let {location, summary, eventName, group, currentUser,} = this.props;
            let dateVal = date.valueOf();
            console.log('TIME', time);
            let timeParts = time.split(" ");
            let timeType = timeParts[1];
            let timeVal = parseInt(timeParts[0].split(":")[0]);
            let minutes = parseInt(timeParts[0].split(":")[1]);
            if (timeType == "pm"){
              timeVal += 12;
            }
            if (timeType == "am" && timeVal == 12){
              timeVal = 0;
            }
            if (minutes == 30){
              timeVal += 0.5;
            }
            let start = new Date(dateVal + timeVal*1000*60*60);
            let end = new Date(dateVal + timeVal*1000*60*60 + parseInt(duration)*1000*60*60)
            let event = {
              start: start.valueOf(),
              end: end.valueOf(),
              name: eventName,
              summary: summary,
              attending: {},
              notAttending: {},
              maybe: {},
              location: location || {},
              groupId: group.id,
              comments: [],
              capacity: parseInt(capacity),
            };
            event.attending[currentUser.id] = true;
            console.log('EVENT', event);
            fetch(`${BASE_URL}/events`, {
              method: "POST",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(event)
            })
            .then((response) => response.json())
            .then((data) => {
              console.log('EVENT CREATION DATA', data);
              this._createNotification(data);
              this.props.addEvent(data);
              this.props.navigator.push({
                name: 'Group',
                group: group,
              })
            })
            .catch((err) => {console.log('ERR: ', err)})
          }}
          style={styles.submitButton}
        >
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

let styles = {
  container: {
    flex: 1,
  },
  backButton: {
    paddingLeft: 20,
    backgroundColor: 'transparent',
    paddingBottom: 10,
  },
  formContainer: {
    backgroundColor: Colors.inactive,
    flex: 1,
    paddingTop: 25,
  },
  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brandPrimary,
    height: 80,
    marginBottom: 50,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: '400'
  },
  h4: {
    fontSize: 20,
    fontWeight: '300',
    color: 'black',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  formField: {
    backgroundColor: 'white',
    height: 50,
    paddingTop: 5,
  },
  largeFormField: {
    backgroundColor: 'white',
    height: 100,
  },
  addPhotoContainer: {
    backgroundColor: 'white',
    marginVertical: 15,
    marginHorizontal: (deviceWidth - 200) / 2,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    fontSize: 18,
    paddingHorizontal: 10,
    color: Colors.brandPrimary
  },
  technologyList:{
    textAlign: 'left',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.brandPrimary,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  input: {
    color: '#777',
    fontSize: 18,
    fontWeight: '300',
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  avatar: {
    height: 200,
    width: deviceWidth,
    borderRadius: 3,
    padding: 20,
  },
  largeInput: {
    color: '#777',
    fontSize: 18,
    backgroundColor: 'white',
    fontWeight: '300',
    height: 120,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
}

module.exports = CreateEventConfirm
