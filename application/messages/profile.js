import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import _ from 'underscore';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  ListView,
  Image,
  TouchableOpacity,
  Navigator,
  Dimensions,
  NativeModules,
} from 'react-native';

let { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class Profile extends React.Component{
  render(){
    let {username, avatar,} = this.props;
    const PROFILE = {
      username: username,
      avatar: avatar,
      city: 'Long Beach',
      state: 'NY',
      technologies: [
        'JavaScript', 'Python', 'Machine Learning', 'Perl'
      ],
      assemblies: [
        {name: 'React Native NYC', background: ''},
        {name: 'Python Developers', background: ''},
      ]
    }
    console.log('AVATAR', avatar);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={()=>{
              this.props.navigator.pop();
            }}
          >
            <Icon name="ios-arrow-back" size={30} color='white'/>
          </TouchableOpacity>
          <Text style={styles.headerText}>{username}</Text>
        </View>
        <View style={styles.profileContainer}>
          <Image source={{uri: avatar}} style={styles.avatar}/>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.location}>{PROFILE.city}, {PROFILE.state}</Text>
          <View style={styles.newMessageContainer}>
            <Icon name="chatbubbles" size={30} style={styles.chatBubble}/>
            <Text style={styles.sendMessageText}>Send a Message</Text>
          </View>
          <View style={styles.break}></View>
          <Text style={styles.technologies}>Technologies</Text>
          <Text style={styles.techologyList}>{PROFILE.technologies.join(', ')}</Text>
          <Text style={styles.assemblies}>Assemblies</Text>
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 20,
  },
  username: {
    textAlign: 'center',
  },
  location: {
    textAlign: 'center',
  },
  newMessageContainer:{

  },
  assemblies:{

  },
  break:{},
  chatbubble:{},
  technologies:{},
  technologyList:{},

  inputBox: {
    height: 60,
    backgroundColor: '#F3EFEF',
    flexDirection: 'row',
    marginBottom: 50,
  },

  container: {
    flex: 1,
  },
  header: {
    height: 70,
    backgroundColor: Colors.brandPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 22,
  },
})

module.exports = Profile;
