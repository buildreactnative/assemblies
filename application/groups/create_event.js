import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';

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

class CreateEvent extends React.Component{
  _renderBackButton(){
    return (
      <TouchableOpacity style={styles.backButton} onPress={()=>{
        this.props.navigator.pop();
      }}>
        <Icon name="ios-arrow-back" size={25} color="#ccc" />
      </TouchableOpacity>
    )
  }
  render(){
    let titleConfig = {title: 'Create Event', tintColor: 'white'}
    let leftButtonConfig = this._renderBackButton();
    return (
      <View style={styles.container}>
        <NavigationBar
          title={titleConfig}
          tintColor={Colors.brandPrimary}
          leftButton={leftButtonConfig}
        />
        <View style={styles.formContainer}>
          <Text style={styles.h4}>When is the event?</Text>
          <View style={styles.formField}>
            <TextInput placeholderTextColor='#bbb' style={styles.input} placeholder="Choose a date"/>
          </View>
          <Text style={styles.h4}>{"What's the event name?"}</Text>
          <View style={styles.formField}>
            <TextInput placeholderTextColor='#bbb' style={styles.input} placeholder="Type a name"/>
          </View>
          <Text style={styles.h4}>{"What's happening at the event?"}</Text>
          <TextInput placeholderTextColor='#bbb' style={styles.largeInput} multiline={true} placeholder="Type a summary of the event..."/>
          <TouchableOpacity style={styles.addPhotoContainer}>
            <Icon name="camera" size={30} color={Colors.brandPrimary}/>
            <Text style={styles.photoText}>Add a Photo</Text>
          </TouchableOpacity>
          <Text style={styles.h4}>Where is the event?</Text>
          <View style={styles.formField}>
            <TextInput placeholderTextColor='#bbb' placeholder="Type a place or street address" style={styles.input}/>
          </View>
        </View>
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.buttonText}>Create Assembly</Text>
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
    width: 200,
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
  input: {
    color: '#ccc',
    fontSize: 18,
    fontWeight: '300',
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  largeInput: {
    color: '#ccc',
    fontSize: 18,
    backgroundColor: 'white',
    fontWeight: '300',
    height: 120,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
}

module.exports = CreateEvent
