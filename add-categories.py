from pathlib import Path

file = Path("src/data/questions.ts")

text = file.read_text(encoding="utf-8")

old_type = """export type CategoryKey =
  | 'general'
  | 'technology'
  | 'science'
  | 'math'
  | 'history'
  | 'sports';"""

new_type = """export type CategoryKey =
  | 'general'
  | 'technology'
  | 'science'
  | 'math'
  | 'history'
  | 'sports'
  | 'geography'
  | 'programming'
  | 'entertainment'
  | 'space';"""

if old_type not in text:
    print("Category type pattern not found.")
    raise SystemExit(1)

text = text.replace(old_type, new_type)

new_categories = r"""
  geography: [
    {
      id: 'geography-001',
      question: 'What is the largest country in the world by area?',
      options: ['Canada', 'China', 'Russia', 'United States'],
      answer: 'Russia',
      explanation: 'Russia is the largest country in the world by total area.',
    },
    {
      id: 'geography-002',
      question: 'What is the capital of Kenya?',
      options: ['Mombasa', 'Nairobi', 'Kisumu', 'Nakuru'],
      answer: 'Nairobi',
      explanation: 'Nairobi is the capital and largest city of Kenya.',
    },
    {
      id: 'geography-003',
      question: 'Which continent is Egypt mainly located in?',
      options: ['Asia', 'Africa', 'Europe', 'South America'],
      answer: 'Africa',
      explanation: 'Most of Egypt is located in northeastern Africa.',
    },
    {
      id: 'geography-004',
      question: 'Which desert is the largest hot desert?',
      options: ['Gobi', 'Sahara', 'Kalahari', 'Atacama'],
      answer: 'Sahara',
      explanation: 'The Sahara is the largest hot desert in the world.',
    },
    {
      id: 'geography-005',
      question: 'What is the capital of Australia?',
      options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
      answer: 'Canberra',
      explanation: 'Canberra is the capital city of Australia.',
    },
    {
      id: 'geography-006',
      question: 'Which river is commonly regarded as the longest in Africa?',
      options: ['Nile', 'Congo', 'Niger', 'Zambezi'],
      answer: 'Nile',
      explanation: 'The Nile is traditionally identified as Africa’s longest river.',
    },
    {
      id: 'geography-007',
      question: 'Which country is known as the Land of the Rising Sun?',
      options: ['China', 'Japan', 'Thailand', 'South Korea'],
      answer: 'Japan',
      explanation: 'Japan is widely known as the Land of the Rising Sun.',
    },
    {
      id: 'geography-008',
      question: 'What is the capital of France?',
      options: ['Lyon', 'Marseille', 'Paris', 'Nice'],
      answer: 'Paris',
      explanation: 'Paris is the capital and largest city of France.',
    },
    {
      id: 'geography-009',
      question: 'Which ocean lies between Africa and Australia?',
      options: ['Atlantic', 'Pacific', 'Indian', 'Arctic'],
      answer: 'Indian',
      explanation: 'The Indian Ocean lies between Africa, Asia and Australia.',
    },
    {
      id: 'geography-010',
      question: 'Which country has the city of Dubai?',
      options: ['Qatar', 'United Arab Emirates', 'Oman', 'Bahrain'],
      answer: 'United Arab Emirates',
      explanation: 'Dubai is one of the major cities of the United Arab Emirates.',
    },
    {
      id: 'geography-011',
      question: 'What is the capital of South Africa?',
      options: ['Cape Town', 'Pretoria', 'Durban', 'Johannesburg'],
      answer: 'Pretoria',
      explanation: 'Pretoria is South Africa’s administrative capital.',
    },
    {
      id: 'geography-012',
      question: 'Which continent is Brazil located in?',
      options: ['Africa', 'Asia', 'South America', 'Europe'],
      answer: 'South America',
      explanation: 'Brazil is the largest country in South America.',
    },
    {
      id: 'geography-013',
      question: 'What is the capital of Canada?',
      options: ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'],
      answer: 'Ottawa',
      explanation: 'Ottawa is the capital city of Canada.',
    },
    {
      id: 'geography-014',
      question: 'Which mountain is the highest above sea level?',
      options: ['K2', 'Mount Everest', 'Kilimanjaro', 'Mont Blanc'],
      answer: 'Mount Everest',
      explanation: 'Mount Everest has the highest elevation above sea level.',
    },
    {
      id: 'geography-015',
      question: 'Which country is shaped roughly like a boot?',
      options: ['Spain', 'Italy', 'Greece', 'Portugal'],
      answer: 'Italy',
      explanation: 'Italy’s peninsula is commonly described as boot-shaped.',
    },
    {
      id: 'geography-016',
      question: 'What is the capital of Japan?',
      options: ['Kyoto', 'Osaka', 'Tokyo', 'Hiroshima'],
      answer: 'Tokyo',
      explanation: 'Tokyo is the capital and largest metropolitan area of Japan.',
    },
    {
      id: 'geography-017',
      question: 'Which country is home to the Great Pyramid of Giza?',
      options: ['Egypt', 'Sudan', 'Jordan', 'Morocco'],
      answer: 'Egypt',
      explanation: 'The Great Pyramid of Giza is located near Cairo, Egypt.',
    },
    {
      id: 'geography-018',
      question: 'Which country has the largest population in Africa?',
      options: ['Egypt', 'Nigeria', 'South Africa', 'Ethiopia'],
      answer: 'Nigeria',
      explanation: 'Nigeria is Africa’s most populous country.',
    },
    {
      id: 'geography-019',
      question: 'What is the capital of Brazil?',
      options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'],
      answer: 'Brasília',
      explanation: 'Brasília has been Brazil’s capital since 1960.',
    },
    {
      id: 'geography-020',
      question: 'Which African country is famous for Mount Kilimanjaro?',
      options: ['Kenya', 'Tanzania', 'Uganda', 'Rwanda'],
      answer: 'Tanzania',
      explanation: 'Mount Kilimanjaro is located in Tanzania.',
    },
  ],

  programming: [
    {
      id: 'programming-001',
      question: 'Which language is primarily used to add interactivity to web pages?',
      options: ['HTML', 'CSS', 'JavaScript', 'SQL'],
      answer: 'JavaScript',
      explanation: 'JavaScript adds behavior and interactivity to web pages.',
    },
    {
      id: 'programming-002',
      question: 'What does CSS control?',
      options: ['Database queries', 'Web page styling', 'Server hardware', 'Git history'],
      answer: 'Web page styling',
      explanation: 'CSS controls the appearance and layout of web pages.',
    },
    {
      id: 'programming-003',
      question: 'Which keyword declares a constant in JavaScript?',
      options: ['var', 'let', 'const', 'static'],
      answer: 'const',
      explanation: 'The const keyword declares a variable that cannot be reassigned.',
    },
    {
      id: 'programming-004',
      question: 'What does JSON stand for?',
      options: [
        'JavaScript Object Notation',
        'Java Source Object Network',
        'JavaScript Online Network',
        'JSON Object Naming',
      ],
      answer: 'JavaScript Object Notation',
      explanation: 'JSON is a lightweight text format for structured data.',
    },
    {
      id: 'programming-005',
      question: 'Which symbol is commonly used for a JavaScript arrow function?',
      options: ['=>', '->', '==', '::'],
      answer: '=>',
      explanation: 'JavaScript arrow functions use the => syntax.',
    },
    {
      id: 'programming-006',
      question: 'Which language is commonly used with Django?',
      options: ['Python', 'Java', 'C#', 'Ruby'],
      answer: 'Python',
      explanation: 'Django is a popular web framework built with Python.',
    },
    {
      id: 'programming-007',
      question: 'What does SQL stand for?',
      options: [
        'Structured Query Language',
        'Simple Question Language',
        'System Query Logic',
        'Structured Queue Language',
      ],
      answer: 'Structured Query Language',
      explanation: 'SQL is used to query and manage relational databases.',
    },
    {
      id: 'programming-008',
      question: 'Which data structure stores key-value pairs in JavaScript?',
      options: ['Object', 'String', 'Number', 'Boolean'],
      answer: 'Object',
      explanation: 'JavaScript objects commonly store data as key-value pairs.',
    },
    {
      id: 'programming-009',
      question: 'Which command initializes a Git repository?',
      options: ['git start', 'git init', 'git create', 'git new'],
      answer: 'git init',
      explanation: 'git init creates a new Git repository.',
    },
    {
      id: 'programming-010',
      question: 'What does API commonly allow?',
      options: [
        'Software systems to communicate',
        'Computers to charge',
        'Images to print',
        'Monitors to display color',
      ],
      answer: 'Software systems to communicate',
      explanation: 'APIs provide defined ways for software systems to interact.',
    },
    {
      id: 'programming-011',
      question: 'Which language is known for indentation-based block structure?',
      options: ['Python', 'C', 'Java', 'PHP'],
      answer: 'Python',
      explanation: 'Python uses indentation to define code blocks.',
    },
    {
      id: 'programming-012',
      question: 'What does DOM stand for?',
      options: [
        'Document Object Model',
        'Data Object Method',
        'Document Operation Manager',
        'Digital Object Map',
      ],
      answer: 'Document Object Model',
      explanation: 'The DOM represents a web document as a programmable object structure.',
    },
    {
      id: 'programming-013',
      question: 'Which method adds an item to the end of a JavaScript array?',
      options: ['push()', 'pop()', 'shift()', 'slice()'],
      answer: 'push()',
      explanation: 'push() adds one or more elements to the end of an array.',
    },
    {
      id: 'programming-014',
      question: 'Which HTTP method is commonly used to retrieve data?',
      options: ['GET', 'POST', 'PUT', 'DELETE'],
      answer: 'GET',
      explanation: 'GET requests are commonly used to retrieve resources.',
    },
    {
      id: 'programming-015',
      question: 'What is a bug in software?',
      options: [
        'A programming error',
        'A new feature',
        'A database',
        'A programming language',
      ],
      answer: 'A programming error',
      explanation: 'A bug is an error or unexpected behavior in software.',
    },
    {
      id: 'programming-016',
      question: 'Which technology is used to build React Native apps?',
      options: ['React Native', 'Excel', 'Photoshop', 'MySQL'],
      answer: 'React Native',
      explanation: 'React Native lets developers build native mobile interfaces with React.',
    },
    {
      id: 'programming-017',
      question: 'What does npm manage in JavaScript projects?',
      options: ['Packages', 'Monitors', 'Printers', 'Operating systems'],
      answer: 'Packages',
      explanation: 'npm is a package manager commonly used with JavaScript and Node.js.',
    },
    {
      id: 'programming-018',
      question: 'Which operator checks strict equality in JavaScript?',
      options: ['=', '==', '===', '!='],
      answer: '===',
      explanation: '=== checks equality without type coercion.',
    },
    {
      id: 'programming-019',
      question: 'What does a loop generally do?',
      options: [
        'Repeats instructions',
        'Deletes a program',
        'Creates hardware',
        'Changes a monitor',
      ],
      answer: 'Repeats instructions',
      explanation: 'Loops repeatedly execute a block of code while a condition is met.',
    },
    {
      id: 'programming-020',
      question: 'Which file commonly contains project dependencies in npm projects?',
      options: ['package.json', 'index.png', 'README.jpg', 'server.exe'],
      answer: 'package.json',
      explanation: 'package.json contains project metadata and dependency declarations.',
    },
  ],

  entertainment: [
    {
      id: 'entertainment-001',
      question: 'Which medium is primarily associated with actors and films?',
      options: ['Cinema', 'Banking', 'Agriculture', 'Engineering'],
      answer: 'Cinema',
      explanation: 'Cinema is the art and industry of making and showing films.',
    },
    {
      id: 'entertainment-002',
      question: 'What is a soundtrack?',
      options: [
        'Music or audio associated with a production',
        'A movie poster',
        'A camera lens',
        'A theatre seat',
      ],
      answer: 'Music or audio associated with a production',
      explanation: 'A soundtrack contains music or other audio connected to a film or production.',
    },
    {
      id: 'entertainment-003',
      question: 'Which instrument commonly has 88 keys?',
      options: ['Piano', 'Violin', 'Trumpet', 'Flute'],
      answer: 'Piano',
      explanation: 'A standard modern piano typically has 88 keys.',
    },
    {
      id: 'entertainment-004',
      question: 'What is a screenplay?',
      options: [
        'A script for a film or television production',
        'A music album',
        'A camera',
        'A theatre ticket',
      ],
      answer: 'A script for a film or television production',
      explanation: 'A screenplay provides the written plan for a film or television production.',
    },
    {
      id: 'entertainment-005',
      question: 'Which award is strongly associated with the film industry?',
      options: ['Oscar', 'Grammy', 'Emmy', 'Tony'],
      answer: 'Oscar',
      explanation: 'The Academy Awards, commonly called Oscars, honor achievements in film.',
    },
    {
      id: 'entertainment-006',
      question: 'Which award is primarily associated with recorded music?',
      options: ['Grammy', 'Oscar', 'Emmy', 'Tony'],
      answer: 'Grammy',
      explanation: 'Grammy Awards recognize achievements in recorded music.',
    },
    {
      id: 'entertainment-007',
      question: 'What is animation?',
      options: [
        'Creating the appearance of movement from images',
        'Recording only live audio',
        'Writing computer code',
        'Printing posters',
      ],
      answer: 'Creating the appearance of movement from images',
      explanation: 'Animation creates the illusion of movement through rapidly displayed images.',
    },
    {
      id: 'entertainment-008',
      question: 'What does a director generally do on a film?',
      options: [
        'Leads the creative production',
        'Only sells tickets',
        'Only designs costumes',
        'Only operates the cinema',
      ],
      answer: 'Leads the creative production',
      explanation: 'A film director guides the creative and dramatic aspects of a production.',
    },
    {
      id: 'entertainment-009',
      question: 'Which genre often features futuristic technology?',
      options: ['Science fiction', 'Western', 'Documentary', 'Romance'],
      answer: 'Science fiction',
      explanation: 'Science fiction commonly explores futuristic science and technology.',
    },
    {
      id: 'entertainment-010',
      question: 'What is a sequel?',
      options: [
        'A continuation of an earlier story',
        'A movie trailer',
        'A music instrument',
        'A casting audition',
      ],
      answer: 'A continuation of an earlier story',
      explanation: 'A sequel continues the story or characters of an earlier work.',
    },
    {
      id: 'entertainment-011',
      question: 'Which genre commonly features jokes and humorous situations?',
      options: ['Comedy', 'Horror', 'Thriller', 'Documentary'],
      answer: 'Comedy',
      explanation: 'Comedy is designed primarily to entertain through humor.',
    },
    {
      id: 'entertainment-012',
      question: 'What is a trailer?',
      options: [
        'A preview of an upcoming film or show',
        'A full movie script',
        'A recording studio',
        'A theatre stage',
      ],
      answer: 'A preview of an upcoming film or show',
      explanation: 'A trailer previews a film, series or other upcoming production.',
    },
    {
      id: 'entertainment-013',
      question: 'Which profession creates choreography for performances?',
      options: ['Choreographer', 'Producer', 'Editor', 'Composer'],
      answer: 'Choreographer',
      explanation: 'A choreographer creates and organizes dance movements.',
    },
    {
      id: 'entertainment-014',
      question: 'What is a documentary?',
      options: [
        'A factual film or program',
        'A fictional superhero story',
        'A music instrument',
        'A comedy script',
      ],
      answer: 'A factual film or program',
      explanation: 'Documentaries present factual information about real subjects.',
    },
    {
      id: 'entertainment-015',
      question: 'Which Nigerian film industry is popularly called Nollywood?',
      options: ['Nigerian cinema', 'Ghanaian cinema', 'Kenyan cinema', 'Egyptian cinema'],
      answer: 'Nigerian cinema',
      explanation: 'Nollywood is the popular name for Nigeria’s film industry.',
    },
    {
      id: 'entertainment-016',
      question: 'What is a duet?',
      options: [
        'A performance by two people',
        'A solo performance',
        'A movie poster',
        'A theatre building',
      ],
      answer: 'A performance by two people',
      explanation: 'A duet is a performance involving two performers.',
    },
    {
      id: 'entertainment-017',
      question: 'Which instrument belongs to the string family?',
      options: ['Violin', 'Trumpet', 'Drum', 'Flute'],
      answer: 'Violin',
      explanation: 'The violin is a bowed string instrument.',
    },
    {
      id: 'entertainment-018',
      question: 'What is a music album?',
      options: [
        'A collection of recorded songs',
        'A film script',
        'A camera',
        'A theatre seat',
      ],
      answer: 'A collection of recorded songs',
      explanation: 'An album is a collection of recorded musical tracks.',
    },
    {
      id: 'entertainment-019',
      question: 'What is a protagonist?',
      options: [
        'The main character in a story',
        'The film editor',
        'The camera operator',
        'The audience',
      ],
      answer: 'The main character in a story',
      explanation: 'The protagonist is generally the central character in a story.',
    },
    {
      id: 'entertainment-020',
      question: 'Which art form uses movement to express ideas or emotions?',
      options: ['Dance', 'Photography', 'Painting', 'Sculpture'],
      answer: 'Dance',
      explanation: 'Dance uses body movement as a form of artistic expression.',
    },
  ],

  space: [
    {
      id: 'space-001',
      question: 'What is the closest star to Earth?',
      options: ['Sirius', 'The Sun', 'Polaris', 'Betelgeuse'],
      answer: 'The Sun',
      explanation: 'The Sun is the star closest to Earth.',
    },
    {
      id: 'space-002',
      question: 'Which planet is closest to the Sun?',
      options: ['Venus', 'Earth', 'Mercury', 'Mars'],
      answer: 'Mercury',
      explanation: 'Mercury is the innermost planet in the Solar System.',
    },
    {
      id: 'space-003',
      question: 'Which planet is famous for its prominent rings?',
      options: ['Mars', 'Saturn', 'Mercury', 'Venus'],
      answer: 'Saturn',
      explanation: 'Saturn has a spectacular system of visible rings made mainly of ice and rock.',
    },
    {
      id: 'space-004',
      question: 'What is Earth’s natural satellite?',
      options: ['Mars', 'The Moon', 'Venus', 'Titan'],
      answer: 'The Moon',
      explanation: 'The Moon is Earth’s natural satellite.',
    },
    {
      id: 'space-005',
      question: 'Which planet is known as the Red Planet?',
      options: ['Mars', 'Jupiter', 'Neptune', 'Mercury'],
      answer: 'Mars',
      explanation: 'Iron minerals on Mars give its surface a reddish appearance.',
    },
    {
      id: 'space-006',
      question: 'What galaxy contains our Solar System?',
      options: ['Andromeda', 'Milky Way', 'Whirlpool', 'Sombrero'],
      answer: 'Milky Way',
      explanation: 'Our Solar System is located in the Milky Way galaxy.',
    },
    {
      id: 'space-007',
      question: 'Which planet is the largest in the Solar System?',
      options: ['Saturn', 'Jupiter', 'Neptune', 'Earth'],
      answer: 'Jupiter',
      explanation: 'Jupiter is the largest planet in our Solar System.',
    },
    {
      id: 'space-008',
      question: 'What force keeps planets in orbit around the Sun?',
      options: ['Magnetism', 'Gravity', 'Friction', 'Electricity'],
      answer: 'Gravity',
      explanation: 'The Sun’s gravity keeps the planets in their orbits.',
    },
    {
      id: 'space-009',
      question: 'Which planet is known for having the Great Red Spot?',
      options: ['Jupiter', 'Mars', 'Saturn', 'Neptune'],
      answer: 'Jupiter',
      explanation: 'The Great Red Spot is a huge storm in Jupiter’s atmosphere.',
    },
    {
      id: 'space-010',
      question: 'What is a light-year used to measure?',
      options: ['Time', 'Distance', 'Mass', 'Temperature'],
      answer: 'Distance',
      explanation: 'A light-year is the distance light travels in one year.',
    },
    {
      id: 'space-011',
      question: 'Which planet is farthest from the Sun among the eight planets?',
      options: ['Uranus', 'Neptune', 'Saturn', 'Jupiter'],
      answer: 'Neptune',
      explanation: 'Neptune is the eighth and farthest recognized planet from the Sun.',
    },
    {
      id: 'space-012',
      question: 'What is a black hole?',
      options: [
        'A region with extremely strong gravity',
        'A dark planet',
        'A type of asteroid',
        'A frozen moon',
      ],
      answer: 'A region with extremely strong gravity',
      explanation: 'A black hole is a region of spacetime where gravity is extremely strong.',
    },
    {
      id: 'space-013',
      question: 'Which planet is closest in size to Earth?',
      options: ['Venus', 'Jupiter', 'Neptune', 'Mercury'],
      answer: 'Venus',
      explanation: 'Venus is similar to Earth in size and mass.',
    },
    {
      id: 'space-014',
      question: 'What is an asteroid?',
      options: [
        'A rocky object orbiting the Sun',
        'A type of star',
        'A galaxy',
        'A planet atmosphere',
      ],
      answer: 'A rocky object orbiting the Sun',
      explanation: 'Asteroids are rocky bodies that orbit the Sun.',
    },
    {
      id: 'space-015',
      question: 'What is a comet mainly made of?',
      options: [
        'Ice, dust and rock',
        'Only liquid water',
        'Pure iron',
        'Only gas',
      ],
      answer: 'Ice, dust and rock',
      explanation: 'Comets contain ice, dust and rocky material.',
    },
    {
      id: 'space-016',
      question: 'Which planet rotates on its side?',
      options: ['Uranus', 'Earth', 'Mars', 'Mercury'],
      answer: 'Uranus',
      explanation: 'Uranus has an extreme axial tilt of about 98 degrees.',
    },
    {
      id: 'space-017',
      question: 'What is the name of our planetary system?',
      options: ['Solar System', 'Lunar System', 'Stellar System', 'Earth System'],
      answer: 'Solar System',
      explanation: 'Our planetary system is called the Solar System.',
    },
    {
      id: 'space-018',
      question: 'Which planet has the fastest winds in the Solar System?',
      options: ['Neptune', 'Earth', 'Mars', 'Venus'],
      answer: 'Neptune',
      explanation: 'Neptune has extremely fast atmospheric winds.',
    },
    {
      id: 'space-019',
      question: 'What is a telescope primarily used for?',
      options: [
        'Observing distant objects in space',
        'Measuring earthquakes',
        'Studying soil',
        'Measuring ocean depth',
      ],
      answer: 'Observing distant objects in space',
      explanation: 'Telescopes collect light or other radiation from distant astronomical objects.',
    },
    {
      id: 'space-020',
      question: 'What is the name of the first human-made satellite?',
      options: ['Apollo 11', 'Sputnik 1', 'Voyager 1', 'Hubble'],
      answer: 'Sputnik 1',
      explanation: 'Sputnik 1, launched in 1957, was the first artificial satellite.',
    },
  ],
"""

# Insert the new categories immediately before the final closing of questionBanks.
marker = "\n};"

position = text.rfind(marker)

if position == -1:
    print("Could not find the end of questionBanks.")
    raise SystemExit(1)

text = text[:position].rstrip() + ",\n" + new_categories.rstrip() + text[position:]

file.write_text(text, encoding="utf-8")

print("Successfully added:")
print("- Geography: 20 questions")
print("- Programming: 20 questions")
print("- Entertainment: 20 questions")
print("- Space: 20 questions")
print("Total question bank: 200 questions")