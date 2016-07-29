import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import Dropdown, { Select, Option, OptionList } from 'react-native-selectme';
import React, { Component } from 'react';
import { Text, View, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { uniq } from 'underscore';

import Colors from '../../styles/colors';
import BackButton from '../shared/BackButton';
import {DEV, API} from '../../config';
import { Technologies, Headers } from '../../fixtures';
import { globals, formStyles, selectStyles, optionTextStyles, overlayStyles } from '../../styles';
import { TechnologyList } from '../accounts/RegisterConfirmation';

const styles = formStyles;
const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

class UserTechnologies extends Component{
  constructor(props){
    super(props);
    this.goBack = this.goBack.bind(this);
    this.selectTechnology = this.selectTechnology.bind(this);
    this.removeTechnology = this.removeTechnology.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.state = {
      technologies: props.currentUser.technologies,
      errorMsg: '',
    }
  }
  selectTechnology(technology){
    this.setState({
      technologies: uniq(this.state.technologies.concat(technology))
    });
  }
  removeTechnology(index){
    let { technologies } = this.state;
    this.setState({
      technologies: [
      ...technologies.slice(0, index),
      ...technologies.slice(index + 1)
      ]
    })
  }
  goBack(){
    this.props.navigator.pop();
  }
  saveSettings(){
    fetch(`${API}/users/${this.props.currentUser.id}`, {
      method: 'PUT',
      headers: Headers,
      body: JSON.stringify({ technologies: this.state.technologies })
    })
    .then(response => response.json())
    .then(user => {
      this.props.updateUser(user);
      this.goBack();
    })
    .catch(err => {})
    .done();
  }
  render(){
    let { technologies } = this.state;
    return (
      <View style={[globals.flexContainer, globals.inactive]}>
        <NavigationBar
          title={{ title: 'User Technologies', tintColor: 'white' }}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        <KeyboardAwareScrollView style={[styles.formContainer, globals.mt1]} contentInset={{bottom: 49}}>
          <View style={globals.flex}>
            <Text style={styles.h4}>{"Select technologies"}</Text>
            <Select
              width={deviceWidth}
              height={55}
              styleText={optionTextStyles}
              style={selectStyles}
              optionListRef={() => this.options}
              defaultValue="Add a technology"
              onSelect={this.selectTechnology}>
              {Technologies.map((tech, idx) => (
                <Option styleText={optionTextStyles} key={idx}>
                  {tech}
                </Option>
              ))}
            </Select>
            <OptionList ref={(el) => this.options = el } overlayStyles={overlayStyles}/>
          </View>
          <TechnologyList technologies={technologies} handlePress={this.removeTechnology}/>
        </KeyboardAwareScrollView>
        <TouchableOpacity style={[styles.submitButton, styles.buttonMargin]} onPress={this.saveSettings}>
          <Text style={globals.largeButtonText}>SAVE</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default UserTechnologies;
