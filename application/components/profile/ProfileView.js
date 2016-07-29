import React, { Component } from 'react';
import { Navigator } from 'react-native';

import UserProfile from './UserProfile';
import UserSettings from './UserSettings';
import UserTechnologies from './UserTechnologies';
import { globals } from '../../styles';

class ProfileView extends Component{
  render(){
    return (
      <Navigator
        initialRoute={{ name: 'UserProfile' }}
        style={globals.flex}
        renderScene={(route, navigator) => {
          switch(route.name){
            case 'UserProfile':
              return (
                <UserProfile
                  {...this.props}
                  {...route}
                  navigator={navigator}
                />
            );
            case 'UserSettings':
              return (
                <UserSettings
                  {...this.props}
                  {...route}
                  navigator={navigator}
                />
            );
            case 'UserTechnologies':
              return (
                <UserTechnologies
                  {...this.props}
                  {...route}
                  navigator={navigator}
                />
            );
          }
        }}
      />
    )
  }
};

export default ProfileView;
