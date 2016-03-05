import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import _ from 'underscore';
import {BASE_URL} from '../utilities/fixtures';

const autocompleteStyles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  textInputContainer: {
    backgroundColor: 'white',
    height: 44,
    borderTopColor: 'white',
    borderBottomColor: 'white',
  },
  textInput: {
    backgroundColor: 'white',
    height: 28,
    borderRadius: 5,
    paddingTop: 4.5,
    paddingBottom: 4.5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 7.5,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 18,
  },
  poweredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.inactive,
  },
  powered: {
    marginTop: 15,
  },
  listView: {
    // flex: 1,
  },
  row: {
    padding: 13,
    height: 44,
    flexDirection: 'row',
  },
  separator: {
    height: 1,
    backgroundColor: 'white',
  },
  description: {
  },
  loader: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 20,
  },
  androidLoader: {
    marginRight: -15,
  },
}
import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  AsyncStorage,
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

class Login extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      location: null,
    }
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
  render(){
    let titleConfig = {title: 'Create Account', tintColor: 'white'}
    let leftButtonConfig = this._renderBackButton();
    return (
      <View style={styles.container}>
        <NavigationBar
          title={titleConfig}
          tintColor={Colors.brandPrimary}
          leftButton={leftButtonConfig}
        />
        <ScrollView style={styles.formContainer}>
          <Text style={styles.h4}>{"Login with your email and password."}</Text>
          <Text style={styles.h4}>Email</Text>
          <View style={styles.formField}>
            <TextInput
              onChangeText={(text)=> this.setState({email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={140}
              placeholderTextColor='#bbb' style={styles.input} placeholder="Your email address"/>
          </View>
          <Text style={styles.h4}>Password</Text>
          <View style={styles.formField}>
            <TextInput
              onChangeText={(text)=> this.setState({password: text})}
              secureTextEntry={true}
              autoCapitalize="none"
              maxLength={140}
              placeholderTextColor='#bbb' style={styles.input} placeholder="Your password"/>
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.submitButton} onPress={()=>{
          let {email, password,} = this.state;
          let user = {username: email, password: password};
          let errors = null;
          console.log("LOGIN", `${BASE_URL}/users/login`)
          fetch(`${BASE_URL}/users/login`, {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
          })
          .then((response) => response.json())
          .then((data) => {
            if (data.errors || data.status == 401) {
              console.log('LOGIN FAILED', data);
              errors = 'Login failed'
            } else {
              console.log('DATA', data);
              AsyncStorage.setItem('sid', data.id)
              fetch(`${BASE_URL}/users/me`, {
                method: "GET",
                headers: {
                    'Set-Cookie': `sid=${data.id}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
              })
              .then((response) => response.json())
              .then((data) => {
                this.props.updateUser(data);
                this.props.navigator.push({
                  name: 'Dashboard'
                });
              })
              .catch((error) => {
                console.log(error)
              })
              .done();
            }
          })
          .catch((error) => console.log(error))
          .done();
        }}>
          <Text style={styles.buttonText}>Login</Text>
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
    paddingTop: 15,
  },
  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brandPrimary,
    height: 80,
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
    marginBottom: 10,
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
    color: '#777',
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
    height: 100,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
}

module.exports = Login
