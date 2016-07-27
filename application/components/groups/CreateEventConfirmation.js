import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import Picker from 'react-native-picker';
import React, { Component, PropTypes } from 'react';
import { ScrollView, View, Text, TextInput, DatePickerIOS, Modal, TouchableOpacity } from 'react-native';

import Colors from '../../styles/colors';
import { Headers } from '../../fixtures';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BackButton from '../shared/BackButton';
import { API, DEV } from '../../config';
import { globals, formStyles } from '../../styles';

const styles = formStyles;

function setErrorMsg({ location, name }){
  if (! location ){
    return 'You must provide a location.';
  } else if (! name ){
    return 'You must provide a name.';
  } else {
    return '';
  }
};

class CreateEventConfirm extends Component{
  constructor(){
    super();
    this.goBack = this.goBack.bind(this);
    this.saveStart = this.saveStart.bind(this);
    this.saveEnd = this.saveEnd.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.toggleStartModal = this.toggleStartModal.bind(this);
    this.toggleEndModal = this.toggleEndModal.bind(this);
    this.state = {
      description       : '',
      end               : new Date(),
      errorMsg          : '',
      finalEnd          : new Date(),
      finalStart        : new Date(),
      showEndModal      : false,
      showStartModal    : false,
      start             : new Date(),
    };
  }
  submitForm(){
    let errorMsg = setErrorMsg({...this.props, ...this.state});
    console.log('SUBMIT', errorMsg);
    if (errorMsg !== ''){
      this.setState({ errorMsg }); return;
    }
    let event = {
      capacity    : this.props.capacity,
      description : this.state.description,
      createdAt   : new Date().valueOf(),
      end         : this.state.finalEnd.valueOf(),
      going       : [ this.props.currentUser.id ],
      groupId     : this.props.group.id,
      location    : this.props.location || {},
      name        : this.props.eventName,
      start       : this.state.finalStart.valueOf(),
    };
    fetch(`${API}/events`, {
      method: 'POST',
      headers: Headers,
      body: JSON.stringify(event)
    })
    .then(response => response.json())
    .then(data => this.props.navigator.push({ name: 'Group', group: this.props.group }))
    .catch(err => {
      console.log('ERR', err);
      this.setState({ errorMsg: err.reason })
    })
    .done();
  }
  goBack(){
    this.props.navigator.pop();
  }
  toggleStartModal(){
    this.setState({ showStartModal: ! this.state.showStartModal })
  }
  toggleEndModal(){
    this.setState({ showEndModal: ! this.state.showEndModal })
  }
  saveStart(){
    this.setState({ showStartModal: false, finalStart: this.state.start, end: this.state.start, finalEnd: this.state.start })
  }
  saveEnd(){
    this.setState({ showEndModal: false, finalEnd: this.state.end })
  }
  render(){
    let { finalStart, finalEnd } = this.state;
    return (
      <View style={[globals.flexContainer, globals.inactive]}>
        <NavigationBar
          title={{ title: 'Confirm Event', tintColor: 'white' }}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        <KeyboardAwareScrollView style={[styles.formContainer, globals.pv1]} contentInset={{bottom: 49}}>
          <Text style={styles.h4}>{"* When does the event start?"}</Text>
          <View style={styles.formField}>
            <TouchableOpacity style={styles.flexRow} onPress={this.toggleStartModal}>
              <Text style={styles.input}>{finalStart ? moment(finalStart).format('dddd MMM Do, h:mm a') : 'Choose a starting time'}</Text>
              <Icon name="ios-arrow-forward" color='#777' size={30} style={globals.mr1}/>
            </TouchableOpacity>
          </View>
          <Text style={styles.h4}>* When does the event end?</Text>
          <View style={styles.formField}>
            <TouchableOpacity style={styles.flexRow} onPress={this.toggleEndModal}>
              <Text style={styles.input}>{finalEnd ? moment(finalEnd).format('dddd MMM Do, h:mm a') : 'Choose an ending time'}</Text>
              <Icon name="ios-arrow-forward" color='#777' size={30} style={globals.mr1}/>
            </TouchableOpacity>
          </View>
          <Text style={styles.h4}>Leave a note for your attendees</Text>
          <TextInput
            ref={(el) => this.description = el }
            returnKeyType="next"
            blurOnSubmit={true}
            clearButtonMode='always'
            onChangeText={(description) => this.setState({ description })}
            placeholderTextColor='#bbb'
            style={styles.largeInput}
            multiline={true}
            placeholder="Type a summary of the event..."
          />
          <View style={[styles.error, globals.ma1]}>
            <Text style={styles.errorText}>{this.state.errorMsg}</Text>
          </View>
        </KeyboardAwareScrollView>
        <TouchableOpacity onPress={this.submitForm} style={[styles.submitButton, styles.buttonMargin]}>
          <Text style={globals.largeButtonText}>Save</Text>
        </TouchableOpacity>
        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.showStartModal}
          onRequestClose={this.saveStart}
          >
         <View style={styles.modal}>
           <View style={styles.datepicker}>
             <DatePickerIOS
               date={this.state.start}
               minimumDate={new Date()}
               minuteInterval={15}
               mode='datetime'
               onDateChange={(start) => this.setState({ start })}
             />
             <View style={styles.btnGroup}>
               <TouchableOpacity style={styles.pickerButton} onPress={() => this.setState({ showStartModal: false })}>
                 <Text style={styles.btnText}>Cancel</Text>
               </TouchableOpacity>
               <TouchableOpacity style={[styles.pickerButton, globals.brandPrimary]} onPress={this.saveStart}>
                 <Text style={[styles.btnText, { color: 'white' }]}>Save</Text>
               </TouchableOpacity>
             </View>
           </View>
         </View>
        </Modal>
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.showEndModal}
          onRequestClose={this.saveEnd}
          >
         <View style={styles.modal}>
           <View style={styles.datepicker}>
             <DatePickerIOS
               date={this.state.end}
               minimumDate={new Date()}
               minuteInterval={15}
               mode='datetime'
               onDateChange={(end) => this.setState({ end })}
             />
             <View style={styles.btnGroup}>
               <TouchableOpacity style={styles.pickerButton} onPress={() => this.setState({ showEndModal: false })}>
                 <Text style={styles.btnText}>Cancel</Text>
               </TouchableOpacity>
               <TouchableOpacity style={[styles.pickerButton, globals.brandPrimary]} onPress={this.saveEnd}>
                 <Text style={[styles.btnText, globals.buttonText]}>Save</Text>
               </TouchableOpacity>
             </View>
           </View>
         </View>
        </Modal>
      </View>
    )
  }
}

export default CreateEventConfirm;
