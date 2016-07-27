import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import NavigationBar from 'react-native-navbar';
import Dropdown, {
  Select,
  Option,
  OptionList
} from 'react-native-selectme';
import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { uniq } from 'underscore';

import Colors from '../../styles/colors';
import BackButton from '../shared/BackButton';
import { API, DEV } from '../../config';
import { Technologies, ImageOptions, DefaultAvatar, Headers } from '../../fixtures';
import { SolidColors, BackgroundImage } from '../../fixtures';
import { globals, formStyles, selectStyles, optionTextStyles, overlayStyles } from '../../styles';
const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const styles = formStyles;

function setErrorMsg({ location, name }){
  if (! location ){
    return 'You must provide a location.';
  } else if (! name ){
    return 'You must provide a name.';
  } else {
    return '';
  }
}

const TechnologyList = ({ technologies, handlePress }) => (
  <View style={styles.textContainer}>
    {technologies.map((technology, idx) => (
      <TouchableOpacity key={idx} onPress={() => handlePress(idx)} style={styles.technology}>
        <Text style={[styles.h6, globals.primaryText]}>{technology}</Text>
      </TouchableOpacity>
    ))}
  </View>
)

class CreateGroupConfirmation extends Component{
  constructor(){
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showImagePicker = this.showImagePicker.bind(this);
    this.selectTechnology = this.selectTechnology.bind(this);
    this.goBack = this.goBack.bind(this);
    this.removeTechnology = this.removeTechnology.bind(this);
    this.state = {
      color         : '#3F51B5',
      errorMsg      : '',
      image         : BackgroundImage,
      technologies  : [],
    }
  }
  handleSubmit(){
    let errorMsg = setErrorMsg(this.props);
    if (errorMsg !== '') { /* return error if missing information */
      this.setState({ errorMsg: errorMsg }); return;
    }
    let group = {
      color: this.state.color,
      image: this.state.image,
      technologies: this.state.technologies,
      description: this.props.description,
      location: this.props.location,
      name: this.props.groupName,
      members: [{
        userId: this.props.currentUser.id,
        role: 'owner',
        joinedAt: new Date().valueOf(),
        confirmed: true
      }],
      createdAt: new Date().valueOf()
    };
    fetch(`${API}/groups`, {
      method: 'POST',
      headers: Headers,
      body: JSON.stringify(group)
    })
    .then(response => response.json())
    .then(group => this.addGroup(group))
    .catch(err => { console.log('ERR', err)})
    .done();
  }
  addGroup(group){
    console.log('GROUP', group)
    this.props.addGroup(group);
    this.props.navigator.popToTop();
  }
  showImagePicker(){ /* select image from camera roll for groupImage */
    ImagePicker.showImagePicker(ImageOptions, (response) => {
      if (response.didCancel || response.error) { return; }
      const image = 'data:image/png;base64,' + response.data;
      this.setState({ image });
    });
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
  render(){
    let { navigator } = this.props;
    let { technologies, image, color, errorMsg } = this.state;
    return (
      <View style={[globals.flexContainer, globals.inactive]}>
        <NavigationBar
          title={{ title: 'Create Assembly', tintColor: 'white' }}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        <ScrollView style={styles.formContainer} contentInset={{ bottom: 49 }}>
          <Text style={styles.h4}>{"My technologies"}</Text>
          <Select
            width={deviceWidth}
            height={55}
            ref="select"
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
          <OptionList
            ref={(el) => this.options = el }
            overlayStyles={overlayStyles}
          />
          <View>
            <TechnologyList technologies={technologies} handlePress={this.removeTechnology}/>
          </View>
          <TouchableOpacity style={styles.avatarContainer} onPress={this.showImagePicker.bind(this)}>
            <Icon name="ios-camera" size={30} color={Colors.brandPrimary}/>
            <Text style={[styles.h4, globals.primaryText]}>Add a Photo</Text>
          </TouchableOpacity>
          <View style={styles.groupImageContainer}>
            <Image source={{ uri: image ? image : BackgroundImage }} style={styles.groupImage}/>
          </View>
          <Text style={styles.h4}>What background color would you like?</Text>
          <View style={styles.colorsContainer}>
            {SolidColors.map((color, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.colorBox, {backgroundColor: Colors[color], borderColor: this.state.color == Colors[color] ? Colors.highlight : 'transparent' }]}
                onPress={() => this.setState({color: Colors[color]})}
              >
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.error, globals.ma1]}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        </ScrollView>
        <TouchableOpacity style={[styles.submitButton, styles.buttonMargin]} onPress={this.handleSubmit}>
          <Text style={globals.largeButtonText}>Create group</Text>
        </TouchableOpacity>
      </View>
    )
  }
};

export default CreateGroupConfirmation;
