import Colors from '../styles/colors';

const currentUserAvatar = 'https://avatars1.githubusercontent.com/u/10930134?v=3&s=400';
const profileFixture = {
  username: 'Tom',
  avatar: 'https://avatars1.githubusercontent.com/u/10930134?v=3&s=400',
  city: 'Long Beach',
  state: 'NY',
  technologies: [
    'JavaScript', 'Python', 'Machine Learning', 'Perl'
  ],
  assemblies: [
    {name: 'React Native NYC', background: Colors.brandPrimaryDark},
    {name: 'Python Developers', background: Colors.brandPrimary},
  ]
}

const users = [
  {
    username: 'Alim',
    avatar: 'http://nyccamp.org/sites/default/files/styles/large/public/pictures/picture-1362-1444315715.jpg?itok=DJ0NcfJ0',
    city: 'Oyster Beach',
    state: 'NY',
    technologies: [
      'JavaScript', 'MeteorJS', 'React Native',
    ],
    assemblies: [
      {name: 'MeteorJS NYC', background: Colors.brandPrimaryDark, backgroundImage: 'http://devbootcamp.com/assets/img/locations/nyc-about-photo.jpg'},
      {name: 'Python Developers', background: Colors.brandPrimary, backgroundImage: 'http://devbootcamp.com/assets/img/locations/nyc-about-photo.jpg'},
    ]
  },
  profileFixture,
]
module.exports = {currentUserAvatar, profileFixture, users}
