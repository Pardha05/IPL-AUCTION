const fs = require('fs');

const batsmenStr = "Virat Kohli, Rohit Sharma, Shubman Gill, KL Rahul, David Warner, Steve Smith, Kane Williamson, Joe Root, Babar Azam, Suryakumar Yadav, Ruturaj Gaikwad, Yashasvi Jaiswal, Devon Conway, Faf du Plessis, Shreyas Iyer, Ishan Kishan, Prithvi Shaw, Rahul Tripathi, Tilak Varma, Aiden Markram, Harry Brook, Travis Head, Dawid Malan, Glenn Phillips, Nicholas Pooran, Shimron Hetmyer, Liam Livingstone, Tim David, Rinku Singh, Nitish Rana, Manish Pandey, Ajinkya Rahane, Ambati Rayudu, Mayank Agarwal, Devdutt Padikkal, Abhishek Sharma, Rahul Tewatia, Sarfaraz Khan, KS Bharat, Rajat Patidar, Anmolpreet Singh, Priyam Garg, Karun Nair, Deepak Hooda, Wriddhiman Saha, Tom Banton, Will Jacks, Ben Duckett, Alex Hales, Jason Roy";

const bowlersStr = "Jasprit Bumrah, Mohammed Shami, Mohammed Siraj, Bhuvneshwar Kumar, Deepak Chahar, Arshdeep Singh, Avesh Khan, Umran Malik, Kuldeep Yadav, Yuzvendra Chahal, Ravi Bishnoi, Ravichandran Ashwin, Mitchell Starc, Pat Cummins, Josh Hazlewood, Trent Boult, Kagiso Rabada, Anrich Nortje, Lockie Ferguson, Mark Wood, Adil Rashid, Tabraiz Shamsi, Wanindu Hasaranga, Mustafizur Rahman, T Natarajan, Chetan Sakariya, Kartik Tyagi, Kamlesh Nagarkoti, Prasidh Krishna, Umesh Yadav, Ishant Sharma, Jaydev Unadkat, Sandeep Sharma, Mohsin Khan, Mayank Markande, Rahul Chahar, Murugan Ashwin, Noor Ahmad, Naveen-ul-Haq, Alzarri Joseph, Jason Behrendorff, Reece Topley, Chris Woakes, David Willey, Luke Wood, Dushmantha Chameera, Lahiru Kumara, Blessing Muzarabani, Obed McCoy, Richard Gleeson";

const allRoundersStr = "Hardik Pandya, Ravindra Jadeja, Axar Patel, Washington Sundar, Shivam Dube, Venkatesh Iyer, Krunal Pandya, Deepak Chahar, Shardul Thakur, Rahul Tewatia, Ben Stokes, Sam Curran, Cameron Green, Glenn Maxwell, Marcus Stoinis, Moeen Ali, Andre Russell, Jason Holder, Mitchell Marsh, Chris Jordan, Daniel Sams, Odean Smith, Romario Shepherd, Dwayne Bravo, Shahbaz Ahmed, Abhishek Sharma, Vijay Shankar, Nitish Kumar Reddy, Rishi Dhawan, Harshal Patel, Liam Livingstone, Tim David, Sikandar Raza, Dasun Shanaka, Mohammad Nabi, Wanindu Hasaranga, Shakib Al Hasan, Colin Munro, Jimmy Neesham, Carlos Brathwaite, Roston Chase, Fabian Allen, Mitchell Santner, Ashton Agar, Sean Abbott, Michael Bracewell, Aaron Hardie, Marco Jansen, Azmatullah Omarzai, Gulbadin Naib";

const parseList = (str, role) => {
  return str.split(',').map(s => s.trim()).filter(Boolean).map(name => ({
    name, role,
    base: [0.5, 1, 1.5, 2][Math.floor(Math.random() * 4)],
    rating: Number((Math.random() * (9.5 - 7.5) + 7.5).toFixed(1)),
    team: "UNSOLD"
  }));
};

const batsmen = parseList(batsmenStr, 'BAT');
const bowlers = parseList(bowlersStr, 'BOWL');
const allRounders = parseList(allRoundersStr, 'AR');

const wks = ["KL Rahul", "Ishan Kishan", "Nicholas Pooran", "KS Bharat", "Wriddhiman Saha", "Tom Banton"];
const allPlayers = [...batsmen, ...bowlers, ...allRounders];

// Deduplicate names if any (e.g., Deepak Chahar, Liam Livingstone are in multiple lists)
const uniquePlayers = [];
const seen = new Set();
allPlayers.forEach((p) => {
  if (!seen.has(p.name)) {
    seen.add(p.name);
    if (wks.includes(p.name)) p.role = 'WK';
    uniquePlayers.push(p);
  }
});

uniquePlayers.forEach((p, i) => p.id = i + 1);

fs.writeFileSync('src/players.json', JSON.stringify(uniquePlayers, null, 2));
console.log(`Generated ${uniquePlayers.length} unique players.`);
