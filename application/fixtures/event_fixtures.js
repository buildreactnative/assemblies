import {users} from './users';
const eventFixtures = [
  {
    name: 'Hack Night',
    start: new Date(),
    end: new Date(),
    goingCount: 32,
    summary: 'Hack Night Summary',
    going: users,
  },
  {
    name: 'Monthly Meetup',
    start: new Date(),
    end: new Date(),
    goingCount: 32,
    summary: 'Monthly Meetup Summary',
    going: users,
  },
]

module.exports = {eventFixtures};
