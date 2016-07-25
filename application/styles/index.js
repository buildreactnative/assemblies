import Colors from './colors';
import { Dimensions, StyleSheet } from 'react-native';

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

export const profileStyles = StyleSheet.create({
  flexRow: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#777',
  },
  avatarContainer: {
    height: 120,
    alignItems: 'center'
  },
  infoContainer: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingHorizontal: 12,
  },
  formButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: 'white',
    marginVertical: 10,
  },
  logoutButton: {
    position: 'absolute',
    left: 30,
  },
  logoutText: {
    paddingTop: 15,
    fontSize: 18,
    fontWeight: '300',
    color: 'red',
  },
});

export const groupsStyles = StyleSheet.create({
  h1: {
    fontSize: 22,
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
  h2: {
    fontSize: 20,
    fontWeight: '500',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  h4: {
    fontSize: 16,
    fontWeight: '300',
  },
  boxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  groupImage: {
    height: (deviceWidth / 2) - 25,
    width: (deviceWidth / 2) - 25,
    opacity: 0.8,
    margin: 5,
  },
  groupBackground: {
    opacity: 0.9,
    flex: 1,
    padding: 15,
    height: (deviceWidth / 2) - 25,
    width: (deviceWidth / 2) - 25,
  },
  groupText: {
    color: 'white',
    fontSize: 20,
    position: 'absolute',
    fontWeight: '500',
  },
  groupTopImage: {
    width: deviceWidth,
    height: 200,
    flexDirection: 'column',
  },
  overlayBlur: {
    backgroundColor: '#333',
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  bottomPanel: {
    flex: 0.3,
    backgroundColor: 'white',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  joinButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: Colors.brandPrimary,
  },
  joinButtonContainer: {
    paddingHorizontal: 20,
    height: 50
  },
  joinButtonText: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlign: 'center',
  },
  infoContainer: {
    marginHorizontal: 10,
    paddingVertical: 5,
  }
});

export const messagesStyles = StyleSheet.create({
  h5: {
    fontSize: 12,
    fontWeight: '700'
  },
  h6: {
    color: Colors.bodyTextGray,
    fontSize: 12,
    fontWeight: '300',
    fontWeight: '300',
    marginLeft: 10,
    marginLeft: 10,
  },
  h4: {
    fontSize: 16,
    color: '#9B9B9B',
    fontStyle: 'italic',
    fontWeight: '300',
  },
  messageText: {
    fontSize: 16,
    fontWeight: '300'
  },
  arrowContainer: {
    flex: 0.5,
    alignItems: 'flex-end',
    paddingRight: 25,
  },
  divider: {
    borderBottomColor: Colors.inactive,
    borderBottomWidth: 1,
    height: 0,
    width: deviceWidth * 0.95,
  },
  navContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: 50,
  },
  inputBox: {
    marginBottom: 50,
    height: 60,
    left: 0,
    right: 0,
    backgroundColor: '#F3EFEF',
    backgroundColor: Colors.inactive,
    flexDirection: 'row',
  },
  input: {
    height: 40,
    padding: 8,
    flex: 1,
    marginRight: 5,
    fontSize: 14,
    borderColor: '#E0E0E0',
    margin: 10,
    borderColor: '#b4b4b4',
    borderRadius: 8,
    color: Colors.bodyText,
    backgroundColor: 'white',
  },
  buttonActive: {
    flex: 0.4,
    backgroundColor: "#E0514B",
    backgroundColor: Colors.brandPrimary,
    borderRadius: 6,
    justifyContent: 'center',
    margin: 10,
  },
  buttonInactive: {
    flex: 0.4,
    backgroundColor: "#eeeeee",
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 6,
    justifyContent: 'center',
    margin: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
  submitButtonText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '400',
    color: 'white',
  },
  inactiveButtonText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '400',
    color: '#999'
  },
  flexCentered: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 8
  }
});

export const calendarStyles = StyleSheet.create({
  h2: {
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center'
  },
  h4: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 10,
    paddingVertical: 4,
  },
  h5: {
    fontSize: 12,
    fontWeight: '300',
    paddingHorizontal: 5,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: Colors.inactive,
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    paddingVertical: 15,
  },
  arrow: {
    marginLeft: 20
  },
  sectionHeader: {
    alignItems: 'center',
    backgroundColor: Colors.inactive,
    borderBottomColor: '#f7f7f7',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  sectionHeaderText: {
    color: Colors.brandPrimaryDark,
    fontSize: 18,
    fontWeight: '300',
  }
});

export const activityStyles = StyleSheet.create({
  h4: {
    color: Colors.bodyText,
    fontSize: 16,
    fontWeight: '400',
    paddingHorizontal: 10,
  },
  h5: {
    color: Colors.bodyText,
    fontSize: 15,
    fontWeight: '300',
    paddingHorizontal: 10,
  },
  dateText: {
    fontSize: 14,
    paddingBottom: 4,
    paddingHorizontal: 10,
    fontWeight: '300',
    fontStyle: 'italic',
    color: Colors.bodyText,
  },
  messageText: {
    color: Colors.bodyText,
    marginLeft: 50,
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '300',
  },
  circle: {
    backgroundColor: Colors.brandPrimary,
    borderRadius: 7.5,
    height: 15,
    marginHorizontal: 10,
    width: 15,
  }
});

export const selectStyles = {
  backgroundColor: 'white',
  borderBottomWidth: 0,
  borderTopWidth: 0,
  justifyContent: 'center',
  paddingLeft: 10,
};

export const optionTextStyles = {
  fontSize: 18,
  fontWeight: '300',
}

export const overlayStyles = {
  alignItems : "center",
  backgroundColor : 'transparent',
  flex : 1,
  height: deviceHeight,
  justifyContent : "flex-start",
  position: 'relative',
  width: deviceWidth,
};

export const autocompleteStyles = StyleSheet.create({
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
    borderRadius: 5,
    fontSize: 18,
    height: 28,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 7.5,
    paddingBottom: 4.5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4.5,
  },
  poweredContainer: {
    alignItems: 'center',
    backgroundColor: Colors.inactive,
    justifyContent: 'center',
  },
  powered: {
    marginTop: 15,
  },
  listView: {
    flex: 1,
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
  loader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 20,
  }
});

export const landingStyles = StyleSheet.create({
  container: {
    bottom: 0,
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  loginButton: {
    bottom: 80,
  },
  backgroundImage: {
    height: deviceHeight,
    width: deviceWidth
  },
  logo: {
    height: 90,
    width: 90
  },
});

export const formStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.inactive,
    flex: 1,
    paddingVertical: 15
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  h3: {
    color: Colors.copyMedium,
    fontSize: 22,
    fontWeight: '400',
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: 'center',
  },
  h4: {
    color: Colors.copyDark,
    fontSize: 20,
    fontWeight: '300',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  h5: {
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: 'center',
  },
  h6: {
    fontSize: 16,
    fontWeight: '400',
  },
  errorContainer: {
    paddingHorizontal: 15,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '300',
    color: Colors.red
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarContainer: {
    backgroundColor: 'white',
    marginVertical: 15,
    marginHorizontal: (deviceWidth - 250) / 2,
    width: 250,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImageContainer: {
    height: 120,
    alignItems: 'center'
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 20,
  },
  formField: {
    backgroundColor: 'white',
    height: 50,
    paddingTop: 5,
    marginBottom: 10,
  },
  input: {
    color: Colors.copyMedium,
    fontSize: 18,
    fontWeight: '300',
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 5,
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
  submitButton: {
    alignItems: 'center',
    backgroundColor: Colors.brandPrimary,
    height: 70,
    justifyContent: 'center',
  },
  buttonMargin: {
    marginBottom: 50
  },
  textContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: deviceWidth
  },
  technology: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  groupImageContainer: {
    height: 200,
    alignItems: 'center',
    backgroundColor: 'black'
  },
  groupImage: {
    height: 200,
    width: deviceWidth,
    borderRadius: 3,
    padding: 20,
  },
  colorsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    flexWrap: 'wrap'
  },
  colorBox: {
    flex: 1,
    height: (deviceWidth / 4) - 20,
    width: (deviceWidth / 4) - 20,
    margin: 10,
    borderWidth: 4,
  },
  slider: {
    marginHorizontal: 20,
    marginVertical: 5,
  },
  modal: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  datepicker: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 3,
  },
  pickerButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'white',
    marginHorizontal: 5
  }
})

export const globals = StyleSheet.create({
  flex: {
    flex: 1
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  flexContainer: {
    flex: 1,
    backgroundColor: 'white'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  lightText: {
    color: 'white'
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
  },
  h4: {
    fontSize: 20
  },
  h5: {
    fontSize: 16
  },
  pv1: {
    paddingVertical: 10
  },
  ph1: {
    paddingHorizontal: 10
  },
  pa1: {
    padding: 10
  },
  pa2: {
    padding: 20
  },
  ph2: {
    paddingHorizontal: 20
  },
  ma1: {
    margin: 10
  },
  mt1: {
    marginTop: 10
  },
  mv2: {
    marginVertical: 20
  },
  mb1: {
    marginBottom: 10
  },
  mr1: {
    marginRight: 10
  },
  mh1: {
    marginHorizontal: 10
  },
  mh2: {
    marginHorizontal: 20
  },
  mv1: {
    marginVertical: 10
  },
  mb2: {
    marginBottom: 20
  },
  button: {
    alignItems: 'center',
    backgroundColor: Colors.brandPrimary,
    bottom: 0,
    flexDirection: 'row',
    height: 80,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  largeButtonText: {
    fontSize: 24,
    fontWeight: '400',
    color: 'white'
  },
  brandPrimary: {
    backgroundColor: Colors.brandPrimary
  },
  primaryText: {
    color: Colors.brandPrimary
  },
  inactive: {
    backgroundColor: Colors.inactive
  },
  map: {
    backgroundColor: Colors.inactive,
    height: (deviceHeight / 3),
    width: deviceWidth
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  divider: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 10,
  },
  lightDivider: {
    height: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginHorizontal: 15,
    marginVertical: 5,
  },
  textContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  centerText: {
    textAlign: 'center'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  centeredRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
