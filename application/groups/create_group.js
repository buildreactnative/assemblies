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

class CreateGroup extends React.Component{
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
    let titleConfig = {title: 'Create Assembly', tintColor: 'white'}
    let leftButtonConfig = this._renderBackButton();
    return (
      <View style={styles.container}>
        <NavigationBar
          title={titleConfig}
          tintColor={Colors.brandPrimary}
          leftButton={leftButtonConfig}
        />
        <View style={styles.formContainer}>
          <Text style={styles.h4}>What technology is your assembly about?</Text>
          <View style={styles.formField}>
            <TextInput placeholderTextColor='#bbb' style={styles.input} placeholder="Choose a topic"/>
          </View>
          <Text style={styles.h4}>Name of your assembly</Text>
          <View style={styles.formField}>
            <TextInput placeholderTextColor='#bbb' style={styles.input} placeholder="Name of your assembly"/>
          </View>
          <Text style={styles.h4}>Who should join and why?</Text>
          <TextInput placeholderTextColor='#bbb' style={styles.largeInput} multiline={true} placeholder="Type a message to get people interested in your group..."/>
          <TouchableOpacity style={styles.addPhotoContainer}>
            <Icon name="camera" size={30} color={Colors.brandPrimary}/>
            <Text style={styles.photoText}>Add a Photo</Text>
          </TouchableOpacity>
          <Text style={styles.h4}>Where is your group located?</Text>
          <View style={styles.formField}>
            <TextInput placeholderTextColor='#bbb' placeholder="City, State, or ZIP" style={styles.input}/>
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
    marginHorizontal: 30,
    borderRadius: 20,
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

module.exports = CreateGroup
