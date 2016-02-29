const messageFixtures = [
  {senderName: 'Tom', text: 'Hey', createdAt: new Date(), senderAvatar: 'https://avatars1.githubusercontent.com/u/10930134?v=3&s=400'},
  {senderName: 'Tom', text: "What's up?", createdAt: new Date(), senderAvatar: 'https://avatars1.githubusercontent.com/u/10930134?v=3&s=400'},
  {senderName: 'Tom', text: "What's good", createdAt: new Date(), senderAvatar: 'https://avatars1.githubusercontent.com/u/10930134?v=3&s=400'},
]

const conversationFixtures = [
  {from: 'Alim', sent: new Date(), message: "Hey, this is Alim. This was the greatest meetup I've ever been to. When is the next one?", profileUrl: 'http://nyccamp.org/sites/default/files/styles/large/public/pictures/picture-1362-1444315715.jpg?itok=DJ0NcfJ0'},
  {from: 'Chris', sent: new Date(), message: "Hey, have you checked out Posyt yet? It's an awesome app that lets you talk to people and get ideas.", profileUrl: 'https://media.licdn.com/mpr/mpr/shrinknp_200_200/p/7/005/048/26f/3842659.jpg'},
  {from: 'Brent', sent: new Date(), message: 'Hey, awesome blog post! Glad that you are liking React Native so far.', profileUrl: 'https://avatars1.githubusercontent.com/u/90494?v=3&s=460'},
  {from: 'Pete', sent: new Date(), message: 'Hi, awesome presentation. I think ReactJS is an awesome framework for building isomorphic apps.', profileUrl: 'http://2013.jsconf.eu/speakers/images/pete-hunt.jpg'},
  {from: 'Ryan', sent: new Date(), message: "Hey, too bad you can't use React Router in React Native, huh? That is an awesome project.", profileUrl: 'https://pbs.twimg.com/profile_images/378800000743351448/1baa39b31470c1f03d333fbca13ac47e_400x400.jpeg'},
  {from: 'Marc', sent: new Date(), message: "Are there any React Native startups I can invest in?", profileUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Marc_Andreessen_(1).jpg'},
  {from: 'Paul', sent: new Date(), message: "I would love for some React Native apps to be in YC's repetoire.", profileUrl: 'http://ep.yimg.com/ca/I/paulgraham_2239_0'},
  {from: 'Mark', sent: new Date(), message: "Aren't you so glad that Facebook released React Native?", profileUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Mark_Zuckerberg_at_the_37th_G8_Summit_in_Deauville_018_v1.jpg'},
]

module.exports = {messageFixtures, conversationFixtures,}
