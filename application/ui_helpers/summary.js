import _              from 'underscore';
import {truncate}     from 'underscore.string';
import Icon           from 'react-native-vector-icons/Ionicons';
import moment         from 'moment';
import Colors         from '../styles/colors';
import Globals        from '../styles/globals';
import {BASE_URL, DEV, HEADERS} from '../utilities/fixtures';

import React, {
  ScrollView,
  Component,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  NativeModules,
  InteractionManager,
  ActivityIndicatorIOS,
} from 'react-native';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

export default class Summary extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      expanded: false,
      animation: new Animated.Value(),
      measured: false,
      maxHeight: 50,
    };
  }
  _setMaxHeight(event){
    console.log('EVENT', event.nativeEvent.layout.height);
    if (!! event.nativeEvent && event.nativeEvent.layout.height > this.state.maxHeight){
      this.setState({
        maxHeight: event.nativeEvent.layout.height,
        measured: true,
      });
    }
  }
  _setMinHeight(event){
    this.setState({
      minHeight: event.nativeEvent.layout.height,
    });
  }
  _toggle(){
    let initialValue = this.state.expanded ? this.state.maxHeight : this.state.minHeight;
    let finalValue = this.state.expanded ? this.state.minHeight : this.state.maxHeight;
    this.setState({
      expanded: ! this.state.expanded,
    });
    if (this.props.summary != truncate(this.props.summary, 140)){
      this.state.animation.setValue(initialValue);
      Animated.spring(
        this.state.animation, {
          toValue: finalValue
        }
      ).start();
    }
  }
  _renderClosed(){
    let {summary} = this.props;
    let truncatedText = truncate(summary, 140);
    return (
      <View style={styles.container} onLayout={(e) => {
          if (! this.state.minHeight) {
            this._setMinHeight(e);
          }
        }}>
        <TouchableOpacity onPress={this._toggle.bind(this)}>
          <Text style={styles.h2}>Summary {this.state.expanded ? <Icon name="arrow-down-b"/> : <Icon name="arrow-up-b"/>}</Text>
        </TouchableOpacity>
        <View>
          <Text style={[styles.h4, {paddingHorizontal: 20,}]}>{truncatedText}</Text>
        </View>
      </View>
    )
  }
  _renderExpanded(){
    let {summary} = this.props;
    let truncatedText = truncate(summary, 140);
    let longText = "Locavore vice readymade photo booth four loko. Drinking vinegar chia lomo cray. Try-hard cardigan bespoke, cold-pressed chillwave letterpress single-origin coffee knausgaard. Hammock tumblr lomo ethical post-ironic, XOXO PBR&B cray banh mi master cleanse farm-to-table. Celiac marfa echo park YOLO, drinking vinegar fap etsy mixtape chillwave jean shorts microdosing knausgaard pinterest. Gluten-free butcher 3 wolf moon humblebrag, occupy deep v schlitz mustache williamsburg portland selvage polaroid selfies chicharrones. Aesthetic kombucha flexitarian taxidermy portland PBR&B, green juice lo-fi.";
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._toggle.bind(this)}>
          <Text style={styles.h2}>Summary {this.state.expanded ? <Icon name="arrow-down-b"/> : <Icon name="arrow-up-b"/>}</Text>
        </TouchableOpacity>
        <View>
          <Text style={[styles.h4, {paddingHorizontal: 20,}]}>{summary}</Text>
        </View>
      </View>
    )
  }
  _renderHiddenLayout(){
    return (
      <View onLayout={this._setMaxHeight.bind(this)} style={{position: this.state.measured ? 'absolute' : 'relative', opacity: this.state.measured ? 1 : 0}}>
        <TouchableOpacity>
          <Text style={styles.h2}>Summary {this.state.expanded ? <Icon name="arrow-down-b"/> : <Icon name="arrow-up-b"/>}</Text>
        </TouchableOpacity>
        <Text style={[styles.h4, {paddingHorizontal: 20,}]}>{this.props.summary}</Text>
      </View>
    )
  }
  render(){
    let {summary} = this.props;
    let truncatedText = truncate(summary, 140);
    return (
      <Animated.View style={{backgroundColor: 'white', overflow: 'hidden', marginHorizontal: 10, marginBottom: 1, height: this.state.animation}}>
        {this.state.expanded ? this._renderExpanded() : this._renderClosed()}
        {summary == truncatedText ? null : this._renderHiddenLayout()}
      </Animated.View>
    )
  }
};

let styles = StyleSheet.create({
  h4: {
    fontSize: 16,
    fontWeight: '300',
  },
  h2: {
    fontSize: 20,
    fontWeight: '400',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  container: {
    paddingBottom: 10,
  }
})
