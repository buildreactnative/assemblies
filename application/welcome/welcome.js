import Colors from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

let { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

class Welcome extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={require('../assets/images/welcome.png')} />
        </View>
        <View style={styles.content}>
          <Image style={styles.logo} source={require('../assets/images/logo.png')} />
          <Text style={styles.title}>assembly</Text>
          <Text style={styles.subTitle}>Where Developers Connect</Text>
        </View>
        <TouchableOpacity style={styles.loginButton}
          onPress={()=> {
            this.props.navigator.push({
              name: 'Register'
            })
          }}
        >
          <Icon style={styles.icon} name="person" size={36} color={Colors.facebookBlue} />
          <Text style={styles.loginButtonText}>Create an Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerButton}
          onPress={()=> {
            this.props.navigator.push({
              name: 'RegisterConfirm'
            })
          }}
        >
          <Icon style={styles.icon} name="social-facebook" size={36} color='white' />
          <Text style={styles.facebookButtonText}>Login with Facebook</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  },
  image: {
    height: deviceHeight,
    width: deviceWidth
  },
  logo: {
    height: 90,
    width: 90
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
    paddingBottom: 24
  },
  subTitle: {
    color: '#ffffff',
    fontSize: 20
  },
  registerButton: {
    height: 80,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: Colors.facebookBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    height: 80,
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: Colors.inactive,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    position: 'absolute',
    top: 20,
    left: 30
  },
  facebookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  loginButtonText: {
    color: Colors.facebookBlue,
    fontSize: 16,
    fontWeight: '700'
  }
});

module.exports = Welcome;
