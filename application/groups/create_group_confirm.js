import Colors from '../styles/colors';
import Globals from '../styles/globals';
import COLOR_FIXTURES from '../styles/color_fixtures';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import _ from 'underscore';
import {autocompleteStyles} from '../utilities/style_utilities';
import {TECHNOLOGIES, IMAGE_OPTIONS, BASE_URL, DEV} from '../utilities/fixtures';
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

class CreateGroupConfirm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      technologies: [],
      name: '',
      location: null,
      summary: '',
      members: {},
      imageUrl: "http://devbootcamp.com/assets/img/locations/nyc-about-photo.jpg",
      events: {},
      backgroundColor: 'transparent',
    }
  }
  showImagePicker(){
    let options = _.extend({}, IMAGE_OPTIONS, {aspectX: 2, maxWidth: deviceWidth, maxHeight: 300});
    UIImagePickerManager.showImagePicker(options, (response) => {
      if (response.didCancel) {
        if (DEV) {console.log('User cancelled image picker');}
      } else if (response.error) {
        if (DEV) {console.log('UIImagePickerManager Error: ', response.error);}
      } else if (response.customButton) {
        if (DEV) {console.log('User tapped custom button: ', response.customButton);}
      } else {
        // const source = response.uri;
        const source = 'data:image/png;base64,' + response.data;
        this.setState({
          imageUrl: source
        });
      }
    });
  }
  _technologies(tech){
    this.setState({
      technologies: this.state.technologies.concat(tech)
    })
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
  _renderTechnologies(){
    return (
      <Text style={styles.technologyList}>{this.state.technologies.join(', ')}</Text>
    )
  }
  _getOptionList(){
    return this.refs['OPTIONLIST']
  }
  render(){
    let {technologies,} = this.state;
    let titleConfig = {title: 'Create Assembly', tintColor: 'white'}
    let leftButtonConfig = this._renderBackButton();
    let techAreas = technologies.length ? this._renderTechnologies() : null;
    return (
      <View style={styles.container}>
        <NavigationBar
          statusBar={{style: 'light-content', hidden: false}}
          title={titleConfig}
          tintColor={Colors.brandPrimary}
          leftButton={leftButtonConfig}
        />
        <ScrollView style={styles.formContainer}>
          <Text style={styles.h4}>* What technology is your assembly about?</Text>
          {this.state.technologies.length ? this._renderTechnologies() : null}
          <Select
            width={deviceWidth}
            height={55}
            ref="SELECT1"
            styleText={optionTextStyles}
            style={selectStyles}
            optionListRef={this._getOptionList.bind(this)}
            defaultValue="Add a technology"
            onSelect={this._technologies.bind(this)}>
            {TECHNOLOGIES.map((tech, idx) => {
              return <Option style={optionStyles} styleText={optionTextStyles} key={idx}>{tech}</Option>
            })}
          </Select>
          <OptionList ref="OPTIONLIST" overlayStyles={overlayStyles}/>
          <TouchableOpacity style={styles.addPhotoContainer} onPress={this.showImagePicker.bind(this)}>
            <Icon name="camera" size={30} color={Colors.brandPrimary}/>
            <Text style={styles.photoText}>Add a Photo</Text>
          </TouchableOpacity>
          <View style={{height: 200, alignItems: 'center'}}>
            <Image source={{uri: this.state.imageUrl}} style={styles.avatar}/>
          </View>
          <Text style={styles.h4}>What background color would you like?</Text>
          <View style={styles.colorContainer}>
            {COLOR_FIXTURES.slice(0, 4).map((color, idx)=>{
              let isSelected = color.code == this.state.backgroundColor;
              let bgColor = isSelected ? '#FFFF8D' : 'transparent';
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={()=>this.setState({backgroundColor: color.code})}
                  style={[styles.colorBox, {backgroundColor: color.code, borderColor: bgColor }]}
                >
                </TouchableOpacity>
              )
            })}
          </View>
          <View style={styles.colorContainer}>
            {COLOR_FIXTURES.slice(4, 8).map((color, idx)=>{
              let isSelected = color.code == this.state.backgroundColor;
              let bgColor = isSelected ? '#FFFF8D' : 'transparent';
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={()=>this.setState({backgroundColor: color.code})}
                  style={[styles.colorBox, {backgroundColor: color.code, borderColor: bgColor }]}
                >
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={[Globals.submitButton, {marginBottom: 50}]}
          onPress={()=>{
            let {groupName, summary, location, currentUser} = this.props;
            let userId = currentUser ? currentUser.id : '';
            let {imageUrl, technologies, backgroundColor,} = this.state;
            let group = {
              name: groupName,
              summary: summary,
              location: location || {},
              imageUrl: imageUrl,
              technologies: technologies,
              backgroundColor: backgroundColor,
              members: {},
              events: [],
            };
            if (!! userId ){
              group.members[userId] = {
                confirmed: true,
                admin: true,
                owner: true,
                notifications: true
              }
            }
            // create group
            fetch(`${BASE_URL}/groups`, {
              method: "POST",
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(group)
            })
            .then((response) => response.json())
            .then((data) => {
              if (DEV) {console.log('DATA', data);}
              this.props.createGroup(data);
              // update groupIds array in user profile
              fetch(`${BASE_URL}/users/${currentUser.id}`, {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({groupIds: currentUser.groupIds.concat(data.id)})
              })
              .then((response) => response.json())
              .then((data) => {
                if (DEV) {console.log('USER DATA', data);}
                this.props.updateUser(data);
                this.props.navigator.popToTop();
              })
            })
          }}
        >
          <Text style={Globals.submitButtonText}>Create Assembly</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

let styles = {
  container: {
    flex: 1,
  },
  colorContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  colorBox: {
    flex: 1,
    height: (deviceWidth / 4) - 20,
    margin: 10,
    borderWidth: 4,
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

module.exports = CreateGroupConfirm
