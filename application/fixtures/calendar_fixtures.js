let now = new Date().getTime();
let day = 24*60*60*1000;

const calendarFixture = [
  {date: new Date(), id: 0, assemblies: [
    {
      id: 0,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 1,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 2,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
  ]},
  {date: new Date(now + 1*day), id: 1, assemblies: [
    {
      id: 0,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 1,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 2,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
  ]},
  {date: new Date(now + 2*day), id: 2, assemblies: [
    {
      id: 0,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 1,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 2,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
  ]},
  {date: new Date(now + 3*day), id: 3, assemblies: [
    {
      id: 0,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 1,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 2,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
  ]},
  {date: new Date(now + 4*day), id: 4, assemblies: [
    {
      id: 0,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 1,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 2,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
  ]},
  {date: new Date(now + 5*day), id: 5, assemblies: [
    {
      id: 0,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 1,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 2,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
  ]},
  {date: new Date(now + 6*day), id: 6, assemblies: [
    {
      id: 0,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 1,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
    {
      id: 2,
      name: 'Hack Night',
      group: 'React Native NYC',
      time: new Date(),
      going: 10,
    },
  ]},
]

module.exports = {calendarFixture};
