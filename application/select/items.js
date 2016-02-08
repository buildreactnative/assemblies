import React, {
  Dimensions,
  StyleSheet,
  Component,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Text,
  Easing,
  Animated,
} from 'react-native';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const window = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollView: {
    height: 120,
    width: 198 //TODO: this needs to be dynamic
  },
  container: {
    borderColor: '#BDBDC1',
    borderWidth: 1,
    backgroundColor : "#ffffff"
  }
});

class Items extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height : new Animated.Value(0)
    };
  }

  componentDidMount() {
    const { height } = this.props;

    Animated.timing(this.state.height, {
        toValue: height * 3,
        duration: 200,
        easing :  Easing.linear
    }).start();
  }

  render() {
    const { items, positionX, positionY, show, onPress, width, height } = this.props;

    if (!show) {
      return null;
    }

    const renderedItems = React.Children.map(items, (item) => {

      return (
        <TouchableWithoutFeedback onPress={() => onPress(item.props.children, item.props.value) }>
          <View>
            {item}
          </View>
        </TouchableWithoutFeedback>
      );
    });

    return (
      <View style={[styles.container]}>
        <AnimatedScrollView
          style={{ width: width - 2, height: this.state.height }}
          automaticallyAdjustContentInsets={false}
          bounces={false}>
          {renderedItems}
        </AnimatedScrollView>
      </View>
    );
  }
}

Items.propTypes = {
  positionX: React.PropTypes.number,
  positionY: React.PropTypes.number,
  show: React.PropTypes.bool,
  onPress: React.PropTypes.func
};

Items.defaultProps = {
  width: 0,
  height: 0,
  positionX: 0,
  positionY: 0,
  show: false,
  onPress: () => {}
};

module.exports = Items;
