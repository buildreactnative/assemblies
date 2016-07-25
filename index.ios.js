import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator
} from 'react-native';

import Landing from './application/components/Landing';
import Dashboard from './application/components/Dashboard';
import { globals } from './application/styles';

class assembliesTutorial extends Component {
  render() {
    return (
      <Navigator
        style={globals.flex}
        initialRoute={{ name: 'Landing' }}
        renderScene={(route, navigator) => {
          switch(route.name){
            case 'Landing':
              return (
                <Landing navigator={navigator}/>
            );
            case 'Dashboard':
              return (
                <Dashboard navigator={navigator}/>
            );
          }
        }}
      />
    );
  }
}

AppRegistry.registerComponent('assembliesTutorial', () => assembliesTutorial);
