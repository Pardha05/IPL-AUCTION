const fs = require('fs');

const data = JSON.parse(fs.readFileSync('c:\\Users\\vardi\\Desktop\\projects\\ipl\\src\\players.json'));

const knownData = {
  "Virat Kohli": { age: 35, jersey: 18, bat: "Right Hand Bat", bowl: "Right Arm Medium", country: "India" },
  "Rohit Sharma": { age: 36, jersey: 45, bat: "Right Hand Bat", bowl: "Right Arm Off Spin", country: "India" },
  "Shubman Gill": { age: 24, jersey: 77, bat: "Right Hand Bat", bowl: "Right Arm Off Spin", country: "India" },
  "KL Rahul": { age: 31, jersey: 1, bat: "Right Hand Bat", bowl: "Right Arm Medium", country: "India" },
  "David Warner": { age: 37, jersey: 31, bat: "Left Hand Bat", bowl: "Right Arm Leg Spin", country: "Australia" },
  "Jasprit Bumrah": { age: 30, jersey: 93, bat: "Right Hand Bat", bowl: "Right Arm Fast", country: "India" },
  "Mitchell Starc": { age: 34, jersey: 56, bat: "Left Hand Bat", bowl: "Left Arm Fast", country: "Australia" },
  "Rashid Khan": { age: 25, jersey: 19, bat: "Right Hand Bat", bowl: "Right Arm Leg Spin", country: "Afghanistan" },
  "Hardik Pandya": { age: 30, jersey: 33, bat: "Right Hand Bat", bowl: "Right Arm Fast Medium", country: "India" },
  "Ravindra Jadeja": { age: 35, jersey: 8, bat: "Left Hand Bat", bowl: "Left Arm Orthodox", country: "India" },
  "MS Dhoni": { age: 42, jersey: 7, bat: "Right Hand Bat", bowl: "Right Arm Medium", country: "India" },
  "Suryakumar Yadav": { age: 33, jersey: 63, bat: "Right Hand Bat", bowl: "Right Arm Medium", country: "India" },
  "Rishabh Pant": { age: 26, jersey: 17, bat: "Left Hand Bat", bowl: "Right Arm Off Spin", country: "India" },
  "Sanju Samson": { age: 29, jersey: 9, bat: "Right Hand Bat", bowl: "Right Arm Off Spin", country: "India" },
  "Jos Buttler": { age: 33, jersey: 63, bat: "Right Hand Bat", bowl: "-", country: "England" },
  "Glenn Maxwell": { age: 35, jersey: 32, bat: "Right Hand Bat", bowl: "Right Arm Off Spin", country: "Australia" },
  "Pat Cummins": { age: 30, jersey: 30, bat: "Right Hand Bat", bowl: "Right Arm Fast", country: "Australia" },
  "Trent Boult": { age: 34, jersey: 18, bat: "Right Hand Bat", bowl: "Left Arm Fast Medium", country: "New Zealand" },
  "Quinton de Kock": { age: 31, jersey: 12, bat: "Left Hand Bat", bowl: "-", country: "South Africa" },
  "Kagiso Rabada": { age: 28, jersey: 25, bat: "Left Hand Bat", bowl: "Right Arm Fast", country: "South Africa" },
  "Heinrich Klaasen": { age: 32, jersey: 45, bat: "Right Hand Bat", bowl: "-", country: "South Africa" },
  "Yashasvi Jaiswal": { age: 22, jersey: 19, bat: "Left Hand Bat", bowl: "Right Arm Leg Spin", country: "India" },
  "Rinku Singh": { age: 26, jersey: 35, bat: "Left Hand Bat", bowl: "Right Arm Off Spin", country: "India" },
  "Nicholas Pooran": { age: 28, jersey: 29, bat: "Left Hand Bat", bowl: "-", country: "West Indies" },
  "Faf du Plessis": { age: 39, jersey: 13, bat: "Right Hand Bat", bowl: "Right Arm Leg Spin", country: "South Africa" },
  "Sunil Narine": { age: 35, jersey: 74, bat: "Left Hand Bat", bowl: "Right Arm Off Spin", country: "West Indies" },
  "Andre Russell": { age: 35, jersey: 12, bat: "Right Hand Bat", bowl: "Right Arm Fast", country: "West Indies" },
  "Matheesha Pathirana": { age: 21, jersey: 81, bat: "Right Hand Bat", bowl: "Right Arm Fast", country: "Sri Lanka" },
  "Marcus Stoinis": { age: 34, jersey: 17, bat: "Right Hand Bat", bowl: "Right Arm Medium", country: "Australia" },
  "Rachin Ravindra": { age: 24, jersey: 8, bat: "Left Hand Bat", bowl: "Left Arm Orthodox", country: "New Zealand" },
  "Travis Head": { age: 30, jersey: 62, bat: "Left Hand Bat", bowl: "Right Arm Off Spin", country: "Australia" },
  "Ruturaj Gaikwad": { age: 27, jersey: 31, bat: "Right Hand Bat", bowl: "Right Arm Off Spin", country: "India" },
  "Devdutt Padikkal": { age: 23, jersey: 37, bat: "Left Hand Bat", bowl: "Right Arm Off Spin", country: "India" },
  "Cameron Green": { age: 24, jersey: 42, bat: "Right Hand Bat", bowl: "Right Arm Fast Medium", country: "Australia" },
  "Liam Livingstone": { age: 30, jersey: 23, bat: "Right Hand Bat", bowl: "Right Arm Leg Spin", country: "England" },
  "Sam Curran": { age: 25, jersey: 58, bat: "Left Hand Bat", bowl: "Left Arm Fast Medium", country: "England" },
  "Arshdeep Singh": { age: 25, jersey: 2, bat: "Left Hand Bat", bowl: "Left Arm Fast Medium", country: "India" },
  "Mohammed Siraj": { age: 30, jersey: 13, bat: "Right Hand Bat", bowl: "Right Arm Fast", country: "India" },
  "Mohammed Shami": { age: 33, jersey: 11, bat: "Right Hand Bat", bowl: "Right Arm Fast", country: "India" },
  "Axar Patel": { age: 30, jersey: 20, bat: "Left Hand Bat", bowl: "Left Arm Orthodox", country: "India" },
  "Kuldeep Yadav": { age: 29, jersey: 23, bat: "Left Hand Bat", bowl: "Left Arm Wrist Spin", country: "India" },
  "Yuzvendra Chahal": { age: 33, jersey: 3, bat: "Right Hand Bat", bowl: "Right Arm Leg Spin", country: "India" }
};

data.forEach(p => {
  if (knownData[p.name]) {
    p.age = knownData[p.name].age;
    p.jersey = knownData[p.name].jersey;
    p.country = knownData[p.name].country;
    p.battingStyle = knownData[p.name].bat;
    p.bowlingStyle = knownData[p.name].bowl;
  } else {
    // defaults
    if (!p.age) p.age = Math.floor(Math.random() * (36 - 20) + 20);
    if (!p.jersey) p.jersey = Math.floor(Math.random() * 99) + 1;
    if (!p.country) p.country = p.base < 0.5 ? "India" : (Math.random() > 0.5 ? "India" : "Australia");
    
    if (p.role === 'BAT') {
      if(!p.battingStyle) p.battingStyle = Math.random() > 0.3 ? "Right Hand Bat" : "Left Hand Bat";
      if(!p.bowlingStyle) p.bowlingStyle = "Right Arm Off Spin";
    } else if (p.role === 'BOWL') {
      if(!p.battingStyle) p.battingStyle = Math.random() > 0.3 ? "Right Hand Bat" : "Left Hand Bat";
      if(!p.bowlingStyle) p.bowlingStyle = Math.random() > 0.5 ? "Right Arm Fast" : "Left Arm Fast";
    } else if (p.role === 'AR') {
      if(!p.battingStyle) p.battingStyle = Math.random() > 0.3 ? "Right Hand Bat" : "Left Hand Bat";
      if(!p.bowlingStyle) p.bowlingStyle = Math.random() > 0.5 ? "Right Arm Medium" : "Left Arm Orthodox";
    } else {
      if(!p.battingStyle) p.battingStyle = Math.random() > 0.3 ? "Right Hand Bat" : "Left Hand Bat";
      if(!p.bowlingStyle) p.bowlingStyle = "Right Arm Off Spin";
    }
  }
});

fs.writeFileSync('c:\\Users\\vardi\\Desktop\\projects\\ipl\\src\\players.json', JSON.stringify(data, null, 2));
