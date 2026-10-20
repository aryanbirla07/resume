/**
 * Single source of truth for portfolio content and the 14-stop world.
 * Personal portfolio content. Keep claims grounded in the supplied resume.
 */
export const portfolio = {
  name: 'Aryan Birla',
  initials: 'AB',
  title: 'Web Developer',
  role: 'Frontend & backend development · UI/UX',
  location: 'Jaipur, Rajasthan, India',
  availability: 'Working at Cinemachines',
  tagline: 'Building useful, responsive experiences for the web.',
  introduction: 'Creative and detail-oriented web developer with experience across frontend and backend development, responsive websites, and engaging UI/UX experiences.',
  about: 'I am a web developer based in Jaipur, Rajasthan, with a background in frontend and backend development. I enjoy building scalable, responsive websites and designing thoughtful user experiences. I adapt quickly to evolving technologies and work effectively in Agile environments.',
  phone: '+91 9549580226',
  email: 'aryanbirla834@gmail.com',
  github: '',
  linkedin: 'https://www.linkedin.com/in/aryan-birla',
  portfolioUrl: 'https://aryanbirla.vercel.app',
  resumeUrl: '',
  skills: [
    {id:'frontend',group:'Frontend',short:'FRONTEND',note:'Responsive web interfaces and frontend development.',items:['HTML5','CSS3','JavaScript'],evidence:'Skills listed on Aryan’s résumé.'},
    {id:'backend',group:'Backend',short:'BACKEND',note:'Backend development and relational databases.',items:['MySQL','Python'],evidence:'Skills listed on Aryan’s résumé.'},
    {id:'design',group:'UI/UX design',short:'DESIGN',note:'User research, interface design and prototyping.',items:['Figma','Adobe XD','Framer'],evidence:'Skills listed on Aryan’s résumé.'},
    {id:'creative',group:'Cloud & deployment',short:'DEPLOY',note:'Website deployment and hosting.',items:['Netlify','Vercel'],evidence:'Skills listed on Aryan’s résumé.'},
    {id:'systems',group:'Tools',short:'TOOLS',note:'Version control and performance auditing.',items:['Git','GitHub','Lighthouse'],evidence:'Skills listed on Aryan’s résumé.'},
  ],
  projects: [
    {id:'p-01',number:'01',title:'Fithensive',category:'CINEMACHINES PROJECT',description:'Project delivered while working with Cinemachines. Project details and individual contributions were not specified.',stack:[],outcome:'',href:'',source:''},
    {id:'p-02',number:'02',title:'Vedanta Metal Bazaar',category:'CINEMACHINES PROJECT',description:'Project delivered while working with Cinemachines. Project details and individual contributions were not specified.',stack:[],outcome:'',href:'',source:''},
    {id:'p-03',number:'03',title:'Bluetooth Controlled Wheelchair',category:'PERSONAL PROJECT · MAY 2023 — JAN 2024',description:'Led app development for a Bluetooth-enabled wheelchair and participated in physical hardware setup and system testing.',stack:['App development','Bluetooth','Hardware testing'],outcome:'',href:'',source:''},
    {id:'p-04',number:'04',title:'Personal Portfolio Website',category:'PERSONAL PROJECT · 2024',description:'Designed a responsive website with animations, glassmorphism and theme toggling.',stack:['Web development','Responsive design','Animation'],outcome:'',href:'https://aryanbirla.vercel.app',source:''},
    {id:'p-05',number:'05',title:'Theater Food Delivery App',category:'UI/UX CASE STUDY · 2023',description:'Conducted user research, developed high-fidelity prototypes and created interactive Figma designs for a theater experience.',stack:['User research','Figma','Prototyping'],outcome:'',href:'',source:''},
  ],
  experience:[
    {id:'job-01',period:'CURRENT',role:'Web Developer',company:'Cinemachines',description:'Working on projects including Fithensive and Vedanta Metal Bazaar. Role-specific responsibilities and project details were not provided.'},
    {id:'job-02',period:'AUG 2024 — NOV 2024',role:'Website Developer',company:'Alasha Fashion · Jaipur',description:'Built and maintained the company e-commerce platform, supported digital marketing campaigns, and managed inventory and promotional web offers.'},
    {id:'job-03',period:'JUL 2023 — OCT 2023',role:'Web Development & AI/ML Intern',company:'Ansh Technovision · Jaipur',description:'Contributed to a face-detection project using AI/ML tools and developed and deployed websites under professional mentorship.'},
  ],
  achievements:[
    {number:'01',label:'Google UI/UX Design',detail:'Coursera · 2023'},
    {number:'02',label:'Google Beginner Python',detail:'Coursera · 2024'},
    {number:'03',label:'IEEE Student Chapter Member',detail:'2021'},
  ],
  education:[
    {qualification:'B.Tech in Electronics and Communication Engineering',institution:'Swami Keshvanand Institute of Technology, Jaipur',period:'2021 — 2025'},
    {qualification:'Senior Secondary (Class 12)',institution:'Maheshwari Public School, Jaipur',period:'2021'},
    {qualification:'Secondary (Class 10)',institution:'Maheshwari Public School, Jaipur',period:'2019'},
  ],
  languages:[{name:'English',level:'Fluent'},{name:'Hindi',level:'Native'}],
};

export const chapters = [
  {id:'arrival',index:'00',name:'The Threshold',progress:0,location:'THE NORTHERN CLIFF',tag:'THE PROLOGUE',mood:'Stillness before the storm',kind:'intro',subtitle:'Every story begins somewhere.'},
  {id:'forest',index:'01',name:'Whispering Forest',progress:.048,location:'THE ANCIENT WILDS',tag:'FIRST FLIGHT',mood:'Cold air · fast descent',kind:'flight',subtitle:'Leave the familiar behind.'},
  {id:'viaduct',index:'02',name:'The Broken Viaduct',progress:.125,location:'THE RUINED CROSSING',tag:'THE CROSSING',mood:'Ancient stone · mist',kind:'flight',subtitle:'Choose the extraordinary.'},
  {id:'gatehouse',index:'03',name:'The Gatehouse',progress:.205,location:'THE INNER WALL',tag:'THE ARRIVAL',mood:'Iron · fire · stone',kind:'flight',subtitle:'The doors are opening.'},
  {id:'hall',index:'04',name:'The Great Hall',progress:.285,location:'THE GREAT HALL',tag:'ABOUT ME',mood:'Warm light · memory',kind:'about',subtitle:'Meet the mind behind the work.'},
  {id:'courtyard',index:'05',name:'Courtyard of Identity',progress:.365,location:'THE INNER COURT',tag:'MY PHILOSOPHY',mood:'Wind · weathered marble',kind:'identity',subtitle:'The principles behind the practice.'},
  {id:'arena',index:'06',name:'The Aerial Trials',progress:.425,location:'THE SKY ARENA',tag:'SKILLS QUEST',mood:'Flight · precision · momentum',kind:'arena',subtitle:'What you make matters more than what you claim.'},
  {id:'forge',index:'07',name:'The Arcane Forge',progress:.615,location:'THE FORGE',tag:'PROCESS',mood:'Sparks · invention',kind:'forge',subtitle:'Where ideas take form.'},
  {id:'library',index:'08',name:'The Astral Library',progress:.682,location:'THE ARCHIVES',tag:'TOOLS & THINKING',mood:'Paper · dust · curiosity',kind:'library',subtitle:'Curiosity never rests.'},
  {id:'nexus',index:'09',name:'The Portal Nexus',progress:.742,location:'THE NEXUS',tag:'SELECTED PROJECTS',mood:'Other worlds · potential',kind:'projects',subtitle:'See the work, not just the words.'},
  {id:'clock',index:'10',name:'The Chrono Tower',progress:.823,location:'THE TIMEKEEPER',tag:'EXPERIENCE',mood:'Bronze · time · memory',kind:'experience',subtitle:'Every chapter has shaped the next.'},
  {id:'relics',index:'11',name:'The Hall of Relics',progress:.888,location:'THE RELIC HALL',tag:'ACHIEVEMENTS',mood:'Quiet wins · lasting marks',kind:'achievements',subtitle:'A collection of work that mattered.'},
  {id:'owl',index:'12',name:'The Owl Observatory',progress:.927,location:'THE OBSERVATORY',tag:'CONTACT',mood:'Night sky · correspondence',kind:'contact',subtitle:'Every collaboration starts somewhere.'},
  {id:'horizon',index:'13',name:'The Golden Horizon',progress:.973,location:'THE LAST FLIGHT',tag:'EPILOGUE',mood:'First light · possibility',kind:'finale',subtitle:'The next chapter is unwritten.'},
];

export const arenaRingProgress=[.446,.478,.510,.542,.574];
export function clamp01(n){return Math.max(0,Math.min(1,n));}
export function chapterAt(progress){return chapters.reduce((prev,chapter)=>progress+1e-6>=chapter.progress?chapter:prev,chapters[0]);}
export function skillRingCount(progress){return arenaRingProgress.reduce((count,value)=>count+(progress+1e-7>=value?1:0),0);}
export function journeyCompletion(progress){return Math.floor(clamp01(progress)*100);}
