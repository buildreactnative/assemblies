import Colors from '../styles/colors';
let summary = 'Stumptown kickstarter microdosing, kale chips locavore leggings fanny pack mixtape meditation slow-carb kombucha pour-over pickled. Pabst ethical bushwick art party, quinoa chartreuse fanny pack four dollar toast mumblecore irony slow-carb squid. Mumblecore hashtag gentrify butcher ugh brunch, typewriter lo-fi chambray twee ethical. Organic gentrify hammock, messenger bag sriracha retro direct trade freegan mlkshk blog gastropub cronut crucifix.'
const suggestedGroups = [
  {
    name: 'Morning Java',
    background: Colors.brandPrimaryDark,
    summary: summary,
    backgroundImage: 'http://devbootcamp.com/assets/img/locations/nyc-about-photo.jpg',
    memberCount: 110,
    members: [
      {
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
    ],
    technologies: [
      'JavaScript',
      'iOS',
      'Mobile App Development',
    ],
    events: [
      {
        name: 'Hack Night',
        start: new Date(),
        end: new Date(),
        goingCount: 32,
        summary: 'Hack Night Summary',
        going: [
          {
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
        ]
      }
    ],
    admins: [
      {
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
    ],
  },
  {
    name: 'Haskell & Hadoop',
    summary: summary,
    background: Colors.brandPrimaryDark,
    backgroundImage: 'http://devbootcamp.com/assets/img/locations/nyc-about-photo.jpg',
    memberCount: 110,
    members: [
      {
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
    ],
    technologies: [
      'JavaScript',
      'iOS',
      'Mobile App Development',
    ],
    events: [
      {
        name: 'Hack Night',
        start: new Date(),
        end: new Date(),
        goingCount: 32,
        summary: 'Hack Night Summary',
        going: [
          {
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
        ]
      }
    ],
    admins: [
      {
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
    ],
  },
]
const groupsFixture = [
  {
    name: 'React Native NYC',
    summary: summary,
    background: Colors.brandPrimaryDark,
    backgroundImage: 'http://devbootcamp.com/assets/img/locations/nyc-about-photo.jpg',
    memberCount: 110,
    members: [
      {
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
    ],
    technologies: [
      'JavaScript',
      'iOS',
      'Mobile App Development',
    ],
    events: [
      {
        name: 'Hack Night',
        start: new Date(),
        end: new Date(),
        goingCount: 32,
        summary: 'Hack Night Summary',
        going: [
          {
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
        ]
      }
    ],
    admins: [
      {
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
    ],
  },
  {
    name: 'Python Developers',
    summary: summary,
    background: Colors.brandPrimary,
    backgroundImage: 'http://www.crainscleveland.com/apps/pbcsi.dll/storyimage/CC/20150104/SUB1/301049991/V2/0/V2-301049991.jpg?MaxW=880&v=201411210943',
    memberCount: 120,
    members: [
      {
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
    ],
    technologies: [
      'Python',
      'Machine Learning',
      'Algorithms',
    ],
    events: [
      {
        name: 'Hack Night',
        start: new Date(),
        end: new Date(),
        goingCount: 32,
        summary: 'Hack Night Summary',
        going: [
          {
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
        ],
      },
    ],
    admins: [
      {
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
    ]
  },
  {
    name: 'Downtown Tech Breakfast',
    summary: summary,
    background: Colors.brandPrimaryDark,
    backgroundImage: 'http://devbootcamp.com/assets/img/locations/nyc-about-photo.jpg',
    memberCount: 110,
    members: [
      {
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
    ],
    technologies: [
      'JavaScript',
      'iOS',
      'Mobile App Development',
    ],
    events: [
      {
        name: 'Hack Night',
        start: new Date(),
        end: new Date(),
        goingCount: 32,
        summary: 'Hack Night Summary',
        going: [
          {
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
        ]
      }
    ],
    admins: [
      {
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
    ],
  },
  {
    name: 'JavaScript NYC',
    summary: summary,
    background: Colors.brandPrimaryDark,
    backgroundImage: 'http://devbootcamp.com/assets/img/locations/nyc-about-photo.jpg',
    memberCount: 110,
    members: [
      {
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
    ],
    technologies: [
      'JavaScript',
      'iOS',
      'Mobile App Development',
    ],
    events: [
      {
        name: 'Hack Night',
        start: new Date(),
        end: new Date(),
        goingCount: 32,
        summary: 'Hack Night Summary',
        going: [
          {
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
        ]
      }
    ],
    admins: [
      {
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
    ],
  },
]

module.exports = {groupsFixture, suggestedGroups,};
