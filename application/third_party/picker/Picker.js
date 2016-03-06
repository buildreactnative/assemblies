'use strict';

import React from 'react-native';
let {
	StyleSheet,
	Text,
	View,
	PickerIOS,
	Animated,
	Dimensions,
	TouchableHighlight,
	TouchableOpacity
} = React;
const TIMES = [
	{time: '12:30'},
	{time: '2:30'},
	{time: '4:30'}
]
let deviceWidth = Dimensions.get('window').width;
let deviceHeight = Dimensions.get('window').height;
let PickerItemIOS = PickerIOS.Item;

export default class Picker extends React.Component{
	componentDidMount(){
		Animated.timing(this.props.offset, {
			duration: 300,
			toValue: 100
		}).start();
	}
	closeModal(){
		Animated.timing(this.props.offset, {
			duration: 300,
			toValue: deviceHeight
		}).start(this.props.closeModal);
	}
	render(){
		return (
			<Animated.View style={{transform: [
				{translateY: this.props.offset}
			]}}>
				<View style={styles.closeButtonContainer}>
					<TouchableHighlight onPress={this.closeModal.bind(this)} underlayColor="transparent" style={styles.closeButton}>
						<Text style={styles.closeButtonText}>Choose</Text>
					</TouchableHighlight>
				</View>
				<PickerIOS
					selectedValue={this.props.time}
					onValueChange={(time) => this.props.changeTime(time)}
				>
					{Object.keys(TIMES).map((time) => (
						<PickerItemIOS
							key={time}
							value={time}
							label={TIMES[time].time}
						/>
					))}
				</PickerIOS>
			</Animated.View>
		)
	}
}

let styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 60,
	},
	showTimeContainer: {
		borderTopColor: '#ededed',
		borderTopWidth: 1,
	},
	showtime: {
		padding: 20,
		textAlign: 'center',
	},
	button: {
		marginTop: 25,
		marginBottom: 25,
	},
	closeButtonContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		borderTopColor: '#e2e2e2',
		borderTopWidth: 1,
		borderBottomColor: '#e2e2e2',
		borderBottomWidth: 1,
	},
	closeButton: {
		paddingRight: 10,
		paddingTop: 10,
		paddingBottom: 10,
	},
	buttonText: {
		textAlign: 'center',
	},
	closeButtonText: {
		color: '#027afe',
	}
})
