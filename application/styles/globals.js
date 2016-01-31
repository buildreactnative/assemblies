import React from 'react-native';
import Colors from './colors';

let {
  StyleSheet,
  Dimensions,
} = React;

let {
  width: deviceWidth,
  height: deviceHeight
} = Dimensions.get('window');

let globals = StyleSheet.create({
	twoColumnGridContainer: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	inactiveContainer: {
		flex: 1,
		backgroundColor: Colors.inactive
	},
	heading: {
		color: Colors.bodyText,
		fontSize: 22,
		padding: 15
	},
	bodyText: {
		color: Colors.bodyText,
		fontSize: 16,
		paddingHorizontal: 15
	},
	button: {
		height: 60,
		width: deviceWidth,
		backgroundColor: Colors.brandPrimary,
		justifyContent: 'center'
	},
	buttonText: {
		color: '#ffffff',
		textAlign: 'center'
	},
	inputContainer: {
		paddingBottom: 30
	},
	input: {
		borderWidth: 0,
		backgroundColor: '#ffffff',
		height: 50,
		paddingLeft: 12,
		fontSize: 16,
	},
	textarea: {
		borderWidth: 0,
		backgroundColor: '#ffffff',
		height: 100,
		paddingTop: 10,
		paddingLeft: 12,
		paddingBottom: 10,
		fontSize: 16
	},
	inputError: {
		color: 'red',
		paddingHorizontal: 12,
		paddingBottom: 6
	},
	inputLabel: {
		color: Colors.bodyText,
		fontSize: 16,
		paddingHorizontal: 12,
		paddingBottom: 8
	},
	map: {
		height: 250,
		width: deviceWidth
	}
})

module.exports = globals;
