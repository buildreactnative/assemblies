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
module.exports = {currentUserAvatar, profileFixture, }
