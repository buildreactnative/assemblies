import _              from 'underscore';
import moment         from 'moment';
import Icon           from 'react-native-vector-icons/Ionicons';
import NavigationBar  from 'react-native-navbar';
import Picker         from 'react-native-picker';
import Colors         from '../styles/colors';
import Globals        from '../styles/globals';
import CalendarPicker from '../third_party/calendar/CalendarPicker';
import ErrorMessage   from '../ui_helpers/error_message';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {autocompleteStyles} from '../utilities/style_utilities';
import {TECHNOLOGIES, BASE_URL, TIMES_RANGE, DEV, HEADERS} from '../utilities/fixtures';
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
  TouchableOpacity,
  Dimensions,
  NativeModules,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
let UIImagePickerManager = require('NativeModules').UIImagePickerManager;

export default class CreateEventConfirm extends Component{
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
      showSubmit: true,
      error: '',
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
    if (DEV) {console.log('NEW DATE', this.state.date, date, nextDate, prevDate);}
    if (date.valueOf() != nextDate.valueOf() && date.valueOf() != prevDate.valueOf()){
      this.setState({
        date: date,
        choseDate: true,
        showCalendar: false
      });
      this._scroll(108);
    } else {
      this.setState({date: date})
    }
  }
  _createNotification(event){
    let {currentUser, group} = this.props;
    let url = `${BASE_URL}/notifications`;
    let relatedUserIds = {};
    _.keys(group.members).forEach((m) => {
      relatedUserIds[m] = {seen: false}
    });
    relatedUserIds[currentUser.id] = {seen: true};
    let notification = {
      type            : 'event',
      relatedUserIds  : relatedUserIds,
      userIdString    : _.reject(_.keys(group.members), (m) => m == currentUser.id).join(':'),
      message         : `New event in ${group.name}`,
      timestamp       : new Date().valueOf(),
      eventId         : event.id,
      groupId         : group.id,
    };
    if (DEV) {console.log('NOTIFICATION PARAMS', notification);}
    fetch(url, {
      method    : 'POST',
      headers   : HEADERS,
      body      : JSON.stringify(notification)
    })
    .then((response) => response.json())
    .then((data) => {
      if (DEV) {console.log('NOTIFICATION', data);}
      group.events.push(event.id)
      this.props.addEvent(event, group);
      this.props.navigator.push({
        name: 'Group',
        group: group,
      })
    })
    .catch((err) => {
      if (DEV) {console.log('ERR: ', err)}
    }).done();
  }

  _renderBackButton(){
    return (
      <TouchableOpacity style={Globals.backButton} onPress={()=>{
        this.props.navigator.pop();
      }}>
        <Icon name="ios-arrow-back" size={25} color="#ccc" />
      </TouchableOpacity>
    )
  }
  _renderDuration(){
    return (
      <Picker
        ref="durationPicker"
        pickerHeight={300}
        showDuration={300}
        style={{height: 220, position: 'absolute', bottom: 0}}
        pickerCancelBtnText="cancel"
        pickerBtnText='confirm'
        onValueChange={(val)=>this.setState({duration: val})}
        pickerTitle="Event Duration"
        pickerData={['1 hour', '1.5 hours', '2 hours', '2.5 hours', '3 hours', '3.5 hours', '4 hours', '4.5 hours', '5 hours']}//picker`s value List
        selectedValue={this.state.duration}//default to be selected value
        onPickerDone={()=>{
          this.setState({
            showDuration: false,
            choseDuration: true,
          });
          this._scroll(260);
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
        pickerCancelBtnText="cancel"
        pickerBtnText='confirm'
        style={{height: (deviceHeight / 2), position: 'absolute', bottom: 0}}
        onValueChange={(val)=>this.setState({capacity: val})}
        pickerTitle="Event Capacity"
        pickerData={_.range(30).map((num) => `${(num+1)*10} people`)}//picker`s value List
        selectedValue={this.state.capacity}//default to be selected value
        onPickerDone={()=>{
          this.setState({
            showCapacity: false,
            choseCapacity: true,
          });
          this._scroll(260);
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
    return (
      <Picker
        ref="time"
        style={{height: (deviceHeight / 2), position: 'absolute', bottom: 0}}
        pickerHeight={300}
        showDuration={300}
        pickerCancelBtnText="cancel"
        pickerBtnText='confirm'
        onValueChange={(val)=>{
          if (DEV) {console.log('VAL', val);}
          this.setState({time: val[0]})
        }}
        pickerTitle="Event Start"
        pickerData={TIMES_RANGE}//picker`s value List
        selectedValue={this.state.time}//default to be selected value
        onPickerDone={()=>{
          this.setState({
            showTime: false,
            choseTime: true,
          });
          this.refs.scrollView.scrollTo(190);
        }}
        onPickerCancel={()=>{
          this.setState({showTime: false})
        }}
      />
    )
  }
  _scroll(dist){
    this.refs.scrollView.scrollTo(dist);
  }
  render(){
    if (DEV) {console.log('RENDER')}
    let titleConfig = {title: 'Create Assembly', tintColor: 'white'}
    let leftButtonConfig = this._renderBackButton();
    return (
      <View style={styles.container}>
        <NavigationBar
          statusBar={{style: 'light-content', hidden: false}}
          title={titleConfig}
          tintColor={Colors.brandPrimary}
          leftButton={leftButtonConfig}
        />
        <ScrollView
          style={styles.formContainer}
          contentContainerStyle={{paddingBottom: 100}}
          ref="scrollView"
          >
          <Text style={styles.h4}>* When is the event date?</Text>
          <View style={styles.formField}>
            <TouchableOpacity
              onPress={()=>{
                this.setState({showCalendar: ! this.state.showCalendar, showSubmit: ! this.state.showSubmit});
                this._scroll(60);
              }}
              style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={styles.input}>{this.state.choseDate ? moment(this.state.date).format('dddd, MMM Do') : 'Choose a date'}</Text>
              <Icon name="ios-arrow-forward" color='#777' size={30} style={{marginRight: 15}}/>
            </TouchableOpacity>
          </View>
          {this.state.showCalendar ? this._renderCalendar() : null}
          <Text style={styles.h4}>* When does it start?</Text>
          <View style={styles.formField}>
            <TouchableOpacity
              onPress={()=>this.setState({showTime: ! this.state.showTime, showSubmit: ! this.state.showSubmit})}
              style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={styles.input}>{this.state.choseTime ? this.state.time : 'Choose a time'}</Text>
              <Icon name="ios-arrow-forward" color='#777' size={30} style={{marginRight: 15}}/>
            </TouchableOpacity>
          </View>


          <Text style={styles.h4}>How long will it last?</Text>
          <View style={styles.formField}>
            <TouchableOpacity
              onPress={()=>this.setState({showDuration: ! this.state.showDuration, showSubmit: ! this.state.showSubmit})}
              style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={styles.input}>{this.state.choseDuration ? this.state.duration: 'Choose a duration'}</Text>
              <Icon name="ios-arrow-forward" color='#777' size={30} style={{marginRight: 15}}/>
            </TouchableOpacity>
          </View>

          <Text style={styles.h4}>Attendee capacity</Text>
          <View style={styles.formField}>
            <TouchableOpacity
              onPress={()=>this.setState({showCapacity: ! this.state.showCapacity, showSubmit: ! this.state.showSubmit})}
              style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={styles.input}>{this.state.choseCapacity ? this.state.capacity : 'Choose a duration'}</Text>
              <Icon name="ios-arrow-forward" color='#777' size={30} style={{marginRight: 15}}/>
            </TouchableOpacity>
          </View>
          <ErrorMessage error={this.state.error}/>
        </ScrollView>

        <TouchableOpacity
          onPress={()=>{
            let {date, duration, capacity, time} = this.state;
            if (! this.state.choseTime || ! this.state.choseDate){
              this.setState({error: 'Missing required fields *.'});
              return;
            }
            let {location, summary, eventName, group, currentUser,} = this.props;
            let dateVal = date.valueOf();
            if (DEV) {console.log('TIME', time);}
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
              start         : start.valueOf(),
              end           : end.valueOf(),
              name          : eventName,
              summary       : summary,
              attending     : {},
              notAttending  : {},
              maybe         : {},
              location      : location || {},
              groupId       : group.id,
              comments      : [],
              capacity        : parseInt(capacity),
            };
            event.attending[currentUser.id] = true;
            if (DEV) {console.log('EVENT', event);}
            fetch(`${BASE_URL}/events`, {
              method    : 'POST',
              headers   : HEADERS,
              body      : JSON.stringify(event)
            })
            .then((response) => response.json())
            .then((data) => {
              if (DEV) {console.log('EVENT CREATION DATA', data);}
              this._createNotification(data);
            })
            .catch((err) => {
              if (DEV) {console.log('ERR: ', err)}
            })
          }}
          style={[Globals.submitButton, {marginBottom: 50}]}
        >
          <Text style={Globals.submitButtonText}>Create Event</Text>
        </TouchableOpacity>
        {this.state.showTime ? this._renderTime() : null}
        {this.state.showDuration ? this._renderDuration() : null}
        {this.state.showCapacity ? this._renderCapacity() : null}
      </View>
    )
  }
}

let styles = StyleSheet.create({
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
});
