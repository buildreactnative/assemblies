import Colors from '../styles/colors';
import {users} from './users';
import {eventFixtures} from './event_fixtures';

let summary = 'Stumptown kickstarter microdosing, kale chips locavore leggings fanny pack mixtape meditation slow-carb kombucha pour-over pickled. Pabst ethical bushwick art party, quinoa chartreuse fanny pack four dollar toast mumblecore irony slow-carb squid. Mumblecore hashtag gentrify butcher ugh brunch, typewriter lo-fi chambray twee ethical. Organic gentrify hammock, messenger bag sriracha retro direct trade freegan mlkshk blog gastropub cronut crucifix.'
const suggestedGroups = [
  {
    name: 'Morning Java',
    background: Colors.brandPrimaryDark,
    summary: summary,
    backgroundImage: 'http://devbootcamp.com/assets/img/locations/nyc-about-photo.jpg',
    memberCount: 110,
    members: users,
    technologies: [
      'JavaScript',
      'iOS',
      'Mobile App Development',
    ],
    events: eventFixtures,
    admins: users,
  },
  {
    name: 'Haskell & Hadoop',
    summary: summary,
    background: Colors.brandPrimaryDark,
    backgroundImage: 'http://devbootcamp.com/assets/img/locations/nyc-about-photo.jpg',
    memberCount: 110,
    members: users,
    technologies: [
      'JavaScript',
      'iOS',
      'Mobile App Development',
    ],
    events: eventFixtures,
    admins: users,
  },
]
const groupsFixture = [
  {
    name: 'React Native NYC',
    summary: summary,
    background: Colors.brandPrimaryDark,
    backgroundImage: 'http://devbootcamp.com/assets/img/locations/nyc-about-photo.jpg',
    memberCount: 110,
    members: users,
    technologies: [
      'JavaScript',
      'iOS',
      'Mobile App Development',
    ],
    events: eventFixtures,
    admins: users,
  },
  {
    name: 'Python Developers',
    summary: summary,
    background: Colors.brandPrimary,
    backgroundImage: 'http://www.crainscleveland.com/apps/pbcsi.dll/storyimage/CC/20150104/SUB1/301049991/V2/0/V2-301049991.jpg?MaxW=880&v=201411210943',
    memberCount: 120,
    members: users,
    technologies: [
      'Python',
      'Machine Learning',
      'Algorithms',
    ],
    events: eventFixtures,
    admins: users,
  },
  {
    name: 'Downtown Tech Breakfast',
    summary: summary,
    background: Colors.brandPrimaryDark,
    backgroundImage: 'http://devbootcamp.com/assets/img/locations/nyc-about-photo.jpg',
    memberCount: 110,
    members: users,
    technologies: [
      'JavaScript',
      'iOS',
      'Mobile App Development',
    ],
    events: eventFixtures,
    admins: users,
  },
  {
    name: 'JavaScript NYC',
    summary: summary,
    background: Colors.brandPrimaryDark,
    backgroundImage: 'http://devbootcamp.com/assets/img/locations/nyc-about-photo.jpg',
    memberCount: 110,
    members: users,
    technologies: [
      'JavaScript',
      'iOS',
      'Mobile App Development',
    ],
    events: eventFixtures,
    admins: users,
  },
]

module.exports = {groupsFixture, suggestedGroups,};
