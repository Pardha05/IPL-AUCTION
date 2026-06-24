const fs = require('fs');

const rawData = `1	Virat Kohli	35	18	Right-hand	Right-arm medium	India
2	Rohit Sharma	37	45	Right-hand	Right-arm offbreak	India
3	Shubman Gill	24	77	Right-hand	Right-arm offbreak	India
4	KL Rahul	32	1	Right-hand	Right-arm medium	India
5	David Warner	37	31	Left-hand	Right-arm legbreak	Australia
6	Steve Smith	34	49	Right-hand	Right-arm legbreak	Australia
7	Kane Williamson	33	22	Right-hand	Right-arm offbreak	New Zealand
8	Joe Root	33	66	Right-hand	Right-arm offbreak	England
9	Babar Azam	29	56	Right-hand	Right-arm offbreak	Pakistan
10	Suryakumar Yadav	33	63	Right-hand	Right-arm medium	India
11	Ruturaj Gaikwad	27	31	Right-hand	Right-arm offbreak	India
12	Yashasvi Jaiswal	22	19	Left-hand	Right-arm legbreak	India
13	Devon Conway	32	88	Left-hand	Right-arm medium	New Zealand
14	Faf du Plessis	39	13	Right-hand	Right-arm legbreak	South Africa
15	Shreyas Iyer	29	96	Right-hand	Right-arm legbreak	India
16	Ishan Kishan	25	32	Left-hand	-	India
17	Prithvi Shaw	24	100	Right-hand	Right-arm offbreak	India
18	Rahul Tripathi	33	52	Right-hand	Right-arm medium	India
19	Tilak Varma	21	9	Left-hand	Right-arm offbreak	India
20	Aiden Markram	29	4	Right-hand	Right-arm offbreak	South Africa
21	Harry Brook	25	88	Right-hand	Right-arm medium	England
22	Travis Head	30	62	Left-hand	Right-arm offbreak	Australia
23	Dawid Malan	36	29	Left-hand	Right-arm legbreak	England
24	Glenn Phillips	27	23	Right-hand	Right-arm offbreak	New Zealand
25	Nicholas Pooran	28	29	Left-hand	Right-arm offbreak	West Indies
26	Shimron Hetmyer	27	11	Left-hand	-	West Indies
27	Liam Livingstone	30	2	Right-hand	Right-arm legbreak	England
28	Tim David	28	8	Right-hand	Right-arm offbreak	Australia
29	Rinku Singh	26	35	Left-hand	Right-arm offbreak	India
30	Nitish Rana	30	27	Left-hand	Right-arm offbreak	India
31	Manish Pandey	34	9	Right-hand	Right-arm medium	India
32	Ajinkya Rahane	35	27	Right-hand	Right-arm medium	India
33	Ambati Rayudu	38	9	Right-hand	Right-arm offbreak	India
34	Mayank Agarwal	33	14	Right-hand	-	India
35	Devdutt Padikkal	23	37	Left-hand	-	India
36	Abhishek Sharma	23	4	Left-hand	Slow left-arm orthodox	India
37	Rahul Tewatia	30	14	Left-hand	Right-arm legbreak	India
38	Sarfaraz Khan	26	97	Right-hand	Right-arm legbreak	India
39	KS Bharat	30	14	Right-hand	-	India
40	Rajat Patidar	30	8	Right-hand	Right-arm offbreak	India
41	Anmolpreet Singh	26	28	Right-hand	Right-arm offbreak	India
42	Priyam Garg	23	11	Right-hand	Right-arm medium	India
43	Karun Nair	32	69	Right-hand	Right-arm offbreak	India
44	Deepak Hooda	29	57	Right-hand	Right-arm offbreak	India
45	Wriddhiman Saha	39	6	Right-hand	-	India
46	Tom Banton	25	18	Right-hand	-	England
47	Will Jacks	25	85	Right-hand	Right-arm offbreak	England
48	Ben Duckett	29	17	Left-hand	Right-arm legbreak	England
49	Alex Hales	35	10	Right-hand	Right-arm medium	England
50	Jason Roy	33	20	Right-hand	Right-arm medium	England
51	Jasprit Bumrah	30	93	Right-hand	Right-arm fast	India
52	Mohammed Shami	33	11	Right-hand	Right-arm fast	India
53	Mohammed Siraj	30	73	Right-hand	Right-arm fast	India
54	Bhuvneshwar Kumar	34	15	Right-hand	Right-arm medium-fast	India
55	Deepak Chahar	31	90	Right-hand	Right-arm medium	India
56	Arshdeep Singh	25	2	Left-hand	Left-arm medium-fast	India
57	Avesh Khan	27	6	Right-hand	Right-arm fast-medium	India
58	Umran Malik	24	24	Right-hand	Right-arm fast	India
59	Kuldeep Yadav	29	23	Left-hand	Left-arm wrist-spin	India
60	Yuzvendra Chahal	33	3	Right-hand	Right-arm legbreak	India
61	Ravi Bishnoi	23	56	Right-hand	Right-arm legbreak	India
62	Ravichandran Ashwin	37	99	Right-hand	Right-arm offbreak	India
63	Mitchell Starc	34	56	Left-hand	Left-arm fast	Australia
64	Pat Cummins	31	30	Right-hand	Right-arm fast	Australia
65	Josh Hazlewood	33	38	Left-hand	Right-arm fast-medium	Australia
66	Trent Boult	34	18	Right-hand	Left-arm fast-medium	New Zealand
67	Kagiso Rabada	28	25	Left-hand	Right-arm fast	South Africa
68	Anrich Nortje	30	20	Right-hand	Right-arm fast	South Africa
69	Lockie Ferguson	32	69	Right-hand	Right-arm fast	New Zealand
70	Mark Wood	34	33	Right-hand	Right-arm fast	England
71	Adil Rashid	36	95	Right-hand	Right-arm legbreak	England
72	Tabraiz Shamsi	34	26	Right-hand	Left-arm wrist-spin	South Africa
73	Wanindu Hasaranga	26	49	Right-hand	Right-arm legbreak	Sri Lanka
74	Mustafizur Rahman	28	90	Left-hand	Left-arm fast-medium	Bangladesh
75	T Natarajan	33	44	Left-hand	Left-arm medium-fast	India
76	Chetan Sakariya	26	55	Left-hand	Left-arm medium-fast	India
77	Kartik Tyagi	23	9	Right-hand	Right-arm fast	India
78	Kamlesh Nagarkoti	24	5	Right-hand	Right-arm fast	India
79	Prasidh Krishna	28	24	Right-hand	Right-arm fast-medium	India
80	Umesh Yadav	36	19	Right-hand	Right-arm fast	India
81	Ishant Sharma	35	97	Right-hand	Right-arm fast-medium	India
82	Jaydev Unadkat	32	77	Right-hand	Left-arm medium-fast	India
83	Sandeep Sharma	30	27	Right-hand	Right-arm medium	India
84	Mohsin Khan	25	47	Left-hand	Left-arm medium-fast	India
85	Mayank Markande	26	11	Right-hand	Right-arm legbreak	India
86	Rahul Chahar	24	28	Right-hand	Right-arm legbreak	India
87	Murugan Ashwin	33	89	Right-hand	Right-arm legbreak	India
88	Noor Ahmad	19	15	Right-hand	Left-arm wrist-spin	Afghanistan
89	Naveen-ul-Haq	24	78	Right-hand	Right-arm fast-medium	Afghanistan
90	Alzarri Joseph	27	8	Right-hand	Right-arm fast	West Indies
91	Jason Behrendorff	33	65	Right-hand	Left-arm fast-medium	Australia
92	Reece Topley	30	38	Right-hand	Left-arm fast-medium	England
93	Chris Woakes	35	19	Right-hand	Right-arm fast-medium	England
94	David Willey	34	15	Left-hand	Left-arm fast-medium	England
95	Luke Wood	28	77	Left-hand	Left-arm fast-medium	England
96	Dushmantha Chameera	32	5	Right-hand	Right-arm fast	Sri Lanka
97	Lahiru Kumara	27	8	Left-hand	Right-arm fast	Sri Lanka
98	Blessing Muzarabani	27	40	Right-hand	Right-arm fast-medium	Zimbabwe
99	Obed McCoy	27	61	Left-hand	Left-arm fast-medium	West Indies
100	Richard Gleeson	36	7	Right-hand	Right-arm fast-medium	England
101	Hardik Pandya	30	33	Right-hand	Right-arm medium-fast	India
102	Ravindra Jadeja	35	8	Left-hand	Slow left-arm orthodox	India
103	Axar Patel	30	20	Left-hand	Slow left-arm orthodox	India
104	Washington Sundar	24	5	Left-hand	Right-arm offbreak	India
105	Shivam Dube	30	25	Left-hand	Right-arm medium	India
106	Venkatesh Iyer	29	25	Left-hand	Right-arm medium	India
107	Krunal Pandya	33	24	Left-hand	Slow left-arm orthodox	India
108	Shardul Thakur	32	54	Right-hand	Right-arm medium-fast	India
109	Ben Stokes	32	55	Left-hand	Right-arm fast-medium	England
110	Sam Curran	25	58	Left-hand	Left-arm medium-fast	England
111	Cameron Green	24	42	Right-hand	Right-arm fast-medium	Australia
112	Glenn Maxwell	35	32	Right-hand	Right-arm offbreak	Australia
113	Marcus Stoinis	34	17	Right-hand	Right-arm medium	Australia
114	Moeen Ali	36	18	Left-hand	Right-arm offbreak	England
115	Andre Russell	36	12	Right-hand	Right-arm fast	West Indies
116	Jason Holder	32	98	Right-hand	Right-arm fast-medium	West Indies
117	Mitchell Marsh	32	8	Right-hand	Right-arm medium	Australia
118	Chris Jordan	35	34	Right-hand	Right-arm fast-medium	England
119	Daniel Sams	31	60	Right-hand	Left-arm fast-medium	Australia
120	Odean Smith	27	58	Right-hand	Right-arm fast-medium	West Indies
121	Romario Shepherd	29	16	Right-hand	Right-arm fast-medium	West Indies
122	Dwayne Bravo	40	47	Right-hand	Right-arm medium-fast	West Indies
123	Shahbaz Ahmed	29	21	Left-hand	Slow left-arm orthodox	India
124	Vijay Shankar	33	5	Right-hand	Right-arm medium	India
125	Nitish Kumar Reddy	21	14	Right-hand	Right-arm medium-fast	India
126	Rishi Dhawan	34	19	Right-hand	Right-arm medium-fast	India
127	Harshal Patel	33	24	Right-hand	Right-arm medium	India
128	Sikandar Raza	38	24	Right-hand	Right-arm offbreak	Zimbabwe
129	Dasun Shanaka	32	7	Right-hand	Right-arm medium	Sri Lanka
130	Mohammad Nabi	39	7	Right-hand	Right-arm offbreak	Afghanistan
131	Shakib Al Hasan	37	75	Left-hand	Slow left-arm orthodox	Bangladesh
132	Colin Munro	37	82	Left-hand	Right-arm medium	New Zealand
133	Jimmy Neesham	33	50	Left-hand	Right-arm medium-fast	New Zealand
134	Carlos Brathwaite	35	26	Right-hand	Right-arm fast-medium	West Indies
135	Roston Chase	32	10	Right-hand	Right-arm offbreak	West Indies
136	Fabian Allen	29	97	Right-hand	Slow left-arm orthodox	West Indies
137	Mitchell Santner	32	74	Left-hand	Slow left-arm orthodox	New Zealand
138	Ashton Agar	30	46	Left-hand	Slow left-arm orthodox	Australia
139	Sean Abbott	32	77	Right-hand	Right-arm fast-medium	Australia
140	Michael Bracewell	33	4	Left-hand	Right-arm offbreak	New Zealand
141	Aaron Hardie	25	20	Right-hand	Right-arm medium-fast	Australia
142	Marco Jansen	24	70	Right-hand	Left-arm fast	South Africa
143	Azmatullah Omarzai	24	9	Right-hand	Right-arm medium-fast	Afghanistan
144	Gulbadin Naib	33	14	Right-hand	Right-arm medium-fast	Afghanistan
145	Sanju Samson	29	11	Right-hand	-	India
146	Jos Buttler	33	63	Right-hand	-	England
147	Quinton de Kock	31	12	Left-hand	-	South Africa
148	Jonny Bairstow	34	51	Right-hand	Right-arm medium	England
149	Matthew Wade	36	13	Left-hand	-	Australia
150	Dinesh Karthik	38	19	Right-hand	-	India
151	Cheteshwar Pujara	36	25	Right-hand	Right-arm legbreak	India
152	Hanuma Vihari	30	44	Right-hand	Right-arm offbreak	India
153	Rassie van der Dussen	35	72	Right-hand	Right-arm legbreak	South Africa
154	Paul Stirling	33	1	Right-hand	Right-arm offbreak	Ireland
155	Finn Allen	25	16	Right-hand	-	New Zealand
156	Brandon King	29	53	Right-hand	-	West Indies
157	Evin Lewis	32	17	Left-hand	-	West Indies
158	Pathum Nissanka	26	18	Right-hand	-	Sri Lanka
159	Litton Das	29	16	Right-hand	-	Bangladesh
160	Ibrahim Zadran	22	18	Right-hand	Right-arm medium-fast	Afghanistan
161	Shaheen Afridi	24	10	Left-hand	Left-arm fast	Pakistan
162	Haris Rauf	30	97	Right-hand	Right-arm fast	Pakistan
163	Naseem Shah	21	71	Right-hand	Right-arm fast	Pakistan
164	Mohammad Wasim Jr	22	74	Right-hand	Right-arm fast-medium	Pakistan
165	Matt Henry	32	21	Right-hand	Right-arm fast-medium	New Zealand
166	Tim Southee	35	38	Right-hand	Right-arm medium-fast	New Zealand
167	Neil Wagner	38	10	Left-hand	Left-arm medium-fast	New Zealand
168	Kyle Jamieson	29	12	Right-hand	Right-arm fast-medium	New Zealand
169	Josh Little	24	82	Right-hand	Left-arm fast-medium	Ireland
170	George Garton	27	57	Left-hand	Left-arm fast	England
171	Andrew Tye	37	68	Right-hand	Right-arm medium-fast	Australia
172	Nathan Ellis	29	12	Right-hand	Right-arm fast-medium	Australia
173	Scott Boland	35	19	Right-hand	Right-arm fast-medium	Australia
174	Taskin Ahmed	29	3	Left-hand	Right-arm fast	Bangladesh
175	Hasan Mahmud	24	91	Right-hand	Right-arm fast-medium	Bangladesh
176	Shoriful Islam	22	47	Left-hand	Left-arm medium-fast	Bangladesh
177	Daryl Mitchell	33	73	Right-hand	Right-arm medium	New Zealand
178	Ben Cutting	37	31	Right-hand	Right-arm fast-medium	Australia
179	Dan Christian	41	54	Right-hand	Right-arm medium-fast	Australia
180	Chris Green	30	93	Right-hand	Right-arm offbreak	Australia
181	Colin de Grandhomme	37	77	Right-hand	Right-arm fast-medium	New Zealand
182	Moises Henriques	37	21	Right-hand	Right-arm fast-medium	Australia
183	Mohammad Nawaz	30	21	Left-hand	Slow left-arm orthodox	Pakistan
184	Faheem Ashraf	30	41	Left-hand	Right-arm medium-fast	Pakistan
185	Shadab Khan	25	7	Right-hand	Right-arm legbreak	Pakistan
186	Imad Wasim	35	9	Left-hand	Slow left-arm orthodox	Pakistan
187	Mahmudullah	38	30	Right-hand	Right-arm offbreak	Bangladesh
188	Akeal Hosein	31	7	Left-hand	Slow left-arm orthodox	West Indies
189	MS Dhoni	42	7	Right-hand	Right-arm medium	India
190	Vaibhav Sooryavanshi	13	-	Left-hand	Slow left-arm orthodox	India
191	Priyansh Arya	23	-	Left-hand	-	India
192	Sameer Rizvi	20	1	Right-hand	Right-arm offbreak	India
193	Abishek Porel	21	3	Left-hand	-	India
194	Tejasvi Dahiya	22	-	Right-hand	-	India
195	Prashant Veer	23	-	Right-hand	Right-arm medium	India
196	Kartik Sharma	23	-	Left-hand	-	India
197	Mukul Choudhary	20	-	Right-hand	-	India
198	Akshat Raghuwanshi	20	-	Right-hand	Right-arm offbreak	India
199	Salil Arora	24	-	Right-hand	-	India
200	Swastik Chikara	19	-	Right-hand	Right-arm offbreak	India
201	Auqib Nabi	27	-	Right-hand	Right-arm medium-fast	India
202	Naman Tiwari	18	-	Left-hand	Left-arm medium-fast	India
203	Anshul Kamboj	23	-	Right-hand	Right-arm medium-fast	India
204	Harshit Rana	22	22	Right-hand	Right-arm fast	India
205	Mangesh Yadav	25	-	Right-hand	Right-arm medium	India
206	Manav Suthar	21	-	Left-hand	Slow left-arm orthodox	India
207	Ramandeep Singh	27	19	Right-hand	Right-arm medium-fast	India
208	Ayush Badoni	24	1	Right-hand	Right-arm offbreak	India`;

let players = JSON.parse(fs.readFileSync('c:\\Users\\vardi\\Desktop\\projects\\ipl\\src\\players.json', 'utf8'));

const lookup = {};
const lines = rawData.trim().split('\n');
lines.forEach(line => {
  const parts = line.split('\t');
  if (parts.length >= 7) {
    const id = parts[0];
    const name = parts[1].trim();
    const age = parts[2].trim();
    const jersey = parts[3].trim() === '-' ? Math.floor(Math.random() * 99) + 1 : parts[3].trim();
    let batStyle = parts[4].trim();
    let bowlStyle = parts[5].trim();
    const country = parts[6].trim();

    if (batStyle.toLowerCase() === 'right-hand') batStyle = 'Right-hand Bat';
    if (batStyle.toLowerCase() === 'left-hand') batStyle = 'Left-hand Bat';
    
    batStyle = batStyle.toUpperCase();
    bowlStyle = bowlStyle.toUpperCase();
    
    lookup[name] = { age, jersey, batStyle, bowlStyle, country };
  }
});

players = players.map(p => {
  const info = lookup[p.name];
  if (info) {
    p.age = parseInt(info.age);
    p.jersey = info.jersey;
    p.battingStyle = info.batStyle;
    p.bowlingStyle = info.bowlStyle;
    p.country = info.country;
  }
  return p;
});

fs.writeFileSync('c:\\Users\\vardi\\Desktop\\projects\\ipl\\src\\players.json', JSON.stringify(players, null, 2));

console.log('Successfully updated players.json!');
