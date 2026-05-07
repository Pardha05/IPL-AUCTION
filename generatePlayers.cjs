const fs = require('fs');

const current30 = [
  { id:1,  name:"Virat Kohli",        role:"BAT", base:2,   rating:9.5, team:"RCB"  },
  { id:2,  name:"MS Dhoni",           role:"WK",  base:2,   rating:9.2, team:"CSK"  },
  { id:3,  name:"Rohit Sharma",       role:"BAT", base:2,   rating:9.3, team:"MI"   },
  { id:4,  name:"Jasprit Bumrah",     role:"BOWL",base:2,   rating:9.8, team:"MI"   },
  { id:5,  name:"Rashid Khan",        role:"AR",  base:2,   rating:9.4, team:"GT"   },
  { id:6,  name:"Hardik Pandya",      role:"AR",  base:2,   rating:9.1, team:"MI"   },
  { id:7,  name:"KL Rahul",           role:"BAT", base:1.5, rating:8.8, team:"LSG"  },
  { id:8,  name:"Rishabh Pant",       role:"WK",  base:1.5, rating:8.9, team:"DC"   },
  { id:9,  name:"Shubman Gill",       role:"BAT", base:1.5, rating:9.0, team:"GT"   },
  { id:10, name:"Pat Cummins",        role:"BOWL",base:2,   rating:9.6, team:"SRH"  },
  { id:11, name:"Travis Head",        role:"BAT", base:1.5, rating:9.1, team:"SRH"  },
  { id:12, name:"Mitchell Starc",     role:"BOWL",base:2,   rating:9.4, team:"KKR"  },
  { id:13, name:"Yuzvendra Chahal",   role:"BOWL",base:1,   rating:8.7, team:"RR"   },
  { id:14, name:"Suryakumar Yadav",   role:"BAT", base:1.5, rating:9.3, team:"MI"   },
  { id:15, name:"Nicholas Pooran",    role:"BAT", base:1.5, rating:8.8, team:"LSG"  },
  { id:16, name:"Heinrich Klaasen",   role:"WK",  base:1.5, rating:9.2, team:"SRH"  },
  { id:17, name:"Andre Russell",      role:"AR",  base:1.5, rating:9.0, team:"KKR"  },
  { id:18, name:"Ravindra Jadeja",    role:"AR",  base:1.5, rating:9.1, team:"CSK"  },
  { id:19, name:"Mohammed Shami",     role:"BOWL",base:1.5, rating:9.2, team:"GT"   },
  { id:20, name:"Sanju Samson",       role:"BAT", base:1,   rating:8.9, team:"RR"   },
  { id:21, name:"Phil Salt",          role:"BAT", base:1,   rating:8.6, team:"KKR"  },
  { id:22, name:"Jake Fraser-McGurk", role:"BAT", base:1,   rating:8.5, team:"DC"   },
  { id:23, name:"Arshdeep Singh",     role:"BOWL",base:1,   rating:8.7, team:"PBKS" },
  { id:24, name:"Rinku Singh",        role:"BAT", base:0.5, rating:8.4, team:"KKR"  },
  { id:25, name:"Mayank Yadav",       role:"BOWL",base:0.5, rating:8.3, team:"LSG"  },
  { id:26, name:"Matheesha Pathirana",role:"BOWL",base:1,   rating:8.8, team:"CSK"  },
  { id:27, name:"Sunil Narine",       role:"AR",  base:2,   rating:9.4, team:"KKR"  },
  { id:28, name:"Jos Buttler",        role:"WK",  base:2,   rating:9.3, team:"RR"   },
  { id:29, name:"Quinton de Kock",    role:"WK",  base:1.5, rating:8.9, team:"LSG"  },
  { id:30, name:"Trent Boult",        role:"BOWL",base:1.5, rating:9.1, team:"RR"   },
];

const firstNames = ["Rahul", "Shikhar", "Sachin", "Suresh", "Gautam", "Virender", "Yuvraj", "Harbhajan", "Zaheer", "Irfan", "Yusuf", "Bhuvneshwar", "Umesh", "Ishant", "Amit", "Piyush", "Ravichandran", "Cheteshwar", "Ajinkya", "Murali", "Dinesh", "Kedar", "Manish", "Ambati", "Wriddhiman", "Deepak", "Shardul", "Washington", "Krunal", "Navdeep", "Mohammed", "Prithvi", "Shreyas", "Rishabh", "Shubman", "Ishan", "Sanju", "Suryakumar", "Ruturaj", "Devdutt", "Nitish", "Venkatesh", "Avesh", "Ravi", "Varun", "Arshdeep", "Umran", "Kuldeep", "Yuzvendra", "Axar", "Jaydev", "Sandeep", "Mohit", "Harshal", "Chetan", "Khaleel", "Prasidh", "Shivam", "Vijay", "David", "Steve", "Glenn", "Pat", "Mitchell", "Josh", "Adam", "Aaron", "Marcus", "Matthew", "Marnus", "Cameron", "Jason", "Jhye", "Riley", "Kane", "Trent", "Tim", "Lockie", "Martin", "Ross", "Tom", "Devon", "Colin", "James", "Kyle", "Ben", "Jos", "Jonny", "Joe", "Moeen", "Adil", "Mark", "Jofra", "Sam", "Liam", "Chris", "Eoin", "Alex", "Dawid", "Harry", "Reece", "Phil", "Will", "Kagiso", "Quinton", "Faf", "AB", "Anrich", "Lungi", "Tabraiz", "Aiden", "Rassie", "Heinrich", "Marco", "Tristan", "Dewald", "Rashid", "Mohammad", "Mujeeb", "Fazalhaq", "Naveen", "Rahmanullah", "Najibullah", "Gulbadin", "Kieron", "Sunil", "Andre", "Dwayne", "Nicholas", "Shimron", "Evin", "Rovman", "Odean", "Romario", "Alzarri", "Akeal", "Lasith", "Kumar", "Mahela", "Sanath", "Tillakaratne", "Angelo", "Thisara", "Wanindu", "Dushmantha", "Maheesh", "Bhanuka", "Dasun", "Charith", "Pathum", "Kusal", "Shakib", "Mustafizur", "Tamim", "Mushfiqur", "Mahmudullah", "Litton", "Taskin", "Mehidy"];
const lastNames = ["Kohli", "Dhoni", "Sharma", "Bumrah", "Khan", "Pandya", "Rahul", "Pant", "Gill", "Cummins", "Head", "Starc", "Chahal", "Yadav", "Pooran", "Klaasen", "Russell", "Jadeja", "Shami", "Samson", "Salt", "Fraser-McGurk", "Singh", "Pathirana", "Narine", "Buttler", "de Kock", "Boult", "Tewatia", "Siraj", "Patel", "Thakur", "Chahar", "Iyer", "Kishan", "Gaikwad", "Rana", "Chakravarthy", "Bishnoi", "Malik", "Natarajan", "Sundar", "Ahmed", "Agarwal", "Tripathi", "Dubey", "Shankar", "Vihari", "Saha", "Karthik", "Rayudu", "Pandey", "Jadhav", "Vijay", "Pujara", "Ashwin", "Mishra", "Kumar", "Pathan", "Sehwag", "Gambhir", "Raina", "Tendulkar", "Warner", "Smith", "Maxwell", "Hazlewood", "Zampa", "Finch", "Stoinis", "Wade", "Labuschagne", "Green", "Behrendorff", "Richardson", "Meredith", "Williamson", "Southee", "Ferguson", "Santner", "Guptill", "Taylor", "Latham", "Conway", "de Grandhomme", "Neesham", "Jamieson", "Stokes", "Bairstow", "Roy", "Root", "Ali", "Rashid", "Wood", "Archer", "Curran", "Banton", "Livingstone", "Jordan", "Morgan", "Hales", "Malan", "Brook", "Topley", "Jacks", "Rabada", "du Plessis", "de Villiers", "Miller", "Nortje", "Ngidi", "Shamsi", "Markram", "van der Dussen", "Jansen", "Stubbs", "Brevis", "Nabi", "Zadran", "Farooqi", "ul-Haq", "Gurbaz", "Naib", "Pollard", "Bravo", "Gayle", "Hetmyer", "Lewis", "Holder", "Powell", "Shepherd", "Joseph", "Hosein", "Malinga", "Sangakkara", "Jayawardene", "Jayasuriya", "Dilshan", "Mathews", "Perera", "Hasaranga", "Chameera", "Theekshana", "Rajapaksa", "Shanaka", "Asalanka", "Nissanka", "Mendis", "Al Hasan", "Rahman", "Iqbal", "Rahim", "Riyad", "Das", "Hasan"];
const roles = ["BAT", "BOWL", "AR", "WK"];
const bases = [0.5, 1, 1.5, 2];
const teams = ["CSK", "MI", "RCB", "KKR", "SRH", "RR", "DC", "PBKS", "GT", "LSG", "UNSOLD"];

for(let i = 31; i <= 250; i++) {
  const name = firstNames[Math.floor(Math.random()*firstNames.length)] + " " + lastNames[Math.floor(Math.random()*lastNames.length)];
  const role = roles[Math.floor(Math.random()*roles.length)];
  const base = bases[Math.floor(Math.random()*bases.length)];
  const rating = Number((Math.random() * (9.2 - 7.0) + 7.0).toFixed(1));
  const team = teams[Math.floor(Math.random()*teams.length)];
  
  current30.push({ id: i, name, role, base, rating, team });
}

fs.writeFileSync('src/players.json', JSON.stringify(current30, null, 2));
console.log('Successfully generated 250 players in src/players.json');
