
/**
 * constants.js
 * Comprehensive dictionary of skills,
 *  section patterns, action verbs, and negative document signals.
 */

const SKILLS_DICT = [
  // Programming languages - specific patterns to avoid false positives
  { pattern: /\bc\+\+\b/i, label: "C++" },
  { pattern: /\bc#\b/i, label: "C#" },
  { pattern: /\bjavascript\b/i, label: "JavaScript" },
  { pattern: /\btypescript\b/i, label: "TypeScript" },
  { pattern: /\bpython\b/i, label: "Python" },
  { pattern: /\bjava\b(?!script)/i, label: "Java" },
  { pattern: /\bkotlin\b/i, label: "Kotlin" },
  { pattern: /\bswift\b/i, label: "Swift" },
  { pattern: /\bgo(?:lang)?\b/i, label: "Go" },
  { pattern: /\brust\b/i, label: "Rust" },
  { pattern: /\bphp\b/i, label: "PHP" },
  { pattern: /\bruby\b/i, label: "Ruby" },
  { pattern: /\bscala\b/i, label: "Scala" },
  { pattern: /\bperl\b/i, label: "Perl" },
  { pattern: /\br\b(?= |,|;|\n|$)/, label: "R" },
  { pattern: /\bmatlab\b/i, label: "MATLAB" },
  { pattern: /\bc\b(?! ?[#+])/i, label: "C" },

  // Web Frontend
  { pattern: /\bhtml5?\b/i, label: "HTML" },
  { pattern: /\bcss3?\b/i, label: "CSS" },
  { pattern: /\breact(?:\.?js)?\b/i, label: "React" },
  { pattern: /\bangular\b/i, label: "Angular" },
  { pattern: /\bvue(?:\.?js)?\b/i, label: "Vue.js" },
  { pattern: /\bsvelte\b/i, label: "Svelte" },
  { pattern: /\bnext(?:\.?js)?\b/i, label: "Next.js" },
  { pattern: /\bnuxt(?:\.?js)?\b/i, label: "Nuxt.js" },
  { pattern: /\bbootstrap\b/i, label: "Bootstrap" },
  { pattern: /\btailwind(?:\s?css)?\b/i, label: "Tailwind CSS" },
  { pattern: /\bjquery\b/i, label: "jQuery" },
  { pattern: /\bredux\b/i, label: "Redux" },

  // Backend & APIs
  { pattern: /\bnode(?:\.?js)?\b/i, label: "Node.js" },
  { pattern: /\bexpress(?:\.?js)?\b/i, label: "Express.js" },
  { pattern: /\bdjango\b/i, label: "Django" },
  { pattern: /\bflask\b/i, label: "Flask" },
  { pattern: /\bfastapi\b/i, label: "FastAPI" },
  { pattern: /\bspring(?:\s?boot)?\b/i, label: "Spring Boot" },
  { pattern: /\blaravel\b/i, label: "Laravel" },
  { pattern: /\basp\.net\b/i, label: "ASP.NET" },
  { pattern: /\bgraphql\b/i, label: "GraphQL" },
  { pattern: /\brest\s?api\b|\brestful\b/i, label: "REST API" },
  { pattern: /\bgrpc\b/i, label: "gRPC" },
  { pattern: /\bmicroservices\b/i, label: "Microservices" },

  // Databases & Storage
  { pattern: /\bmongodb\b/i, label: "MongoDB" },
  { pattern: /\bmysql\b/i, label: "MySQL" },
  { pattern: /\bpostgresql\b|\bpostgres\b/i, label: "PostgreSQL" },
  { pattern: /\bsqlite\b/i, label: "SQLite" },
  { pattern: /\bredis\b/i, label: "Redis" },
  { pattern: /\bcassandra\b/i, label: "Cassandra" },
  { pattern: /\belasticsearch\b/i, label: "Elasticsearch" },
  { pattern: /\bfirebase\b/i, label: "Firebase" },
  { pattern: /\boracle\b(?!\s?java)/i, label: "Oracle DB" },
  { pattern: /\b(?:ms\s?)?sql\s?server\b/i, label: "SQL Server" },
  { pattern: /\bsql\b/i, label: "SQL" },

  // Data Science, AI & ML
  { pattern: /\bmachine\s?learning\b/i, label: "Machine Learning" },
  { pattern: /\bdeep\s?learning\b/i, label: "Deep Learning" },
  { pattern: /\bnlp\b|natural\s?language\s?processing\b/i, label: "NLP" },
  { pattern: /\bcomputer\s?vision\b/i, label: "Computer Vision" },
  { pattern: /\bpandas\b/i, label: "Pandas" },
  { pattern: /\bnumpy\b/i, label: "NumPy" },
  { pattern: /\btensorflow\b/i, label: "TensorFlow" },
  { pattern: /\bpytorch\b/i, label: "PyTorch" },
  { pattern: /\bscikit[\s-]?learn\b|\bsklearn\b/i, label: "Scikit-learn" },
  { pattern: /\bkeras\b/i, label: "Keras" },
  { pattern: /\bopencv\b/i, label: "OpenCV" },
  { pattern: /\bmatplotlib\b/i, label: "Matplotlib" },
  { pattern: /\bseaborn\b/i, label: "Seaborn" },
  { pattern: /\bpower\s?bi\b/i, label: "Power BI" },
  { pattern: /\btableau\b/i, label: "Tableau" },
  { pattern: /\bhadoop\b/i, label: "Hadoop" },
  { pattern: /\bapache\s?spark\b|\bpyspark\b/i, label: "Apache Spark" },

  // Cloud & DevOps
  { pattern: /\baws\b|amazon\s?web\s?services\b/i, label: "AWS" },
  { pattern: /\bazure\b/i, label: "Azure" },
  { pattern: /\bgcp\b|google\s?cloud\b/i, label: "GCP" },
  { pattern: /\bdocker\b/i, label: "Docker" },
  { pattern: /\bkubernetes\b|\bk8s\b/i, label: "Kubernetes" },
  { pattern: /\bterraform\b/i, label: "Terraform" },
  { pattern: /\bansible\b/i, label: "Ansible" },
  { pattern: /\bjenkins\b/i, label: "Jenkins" },
  { pattern: /\bci\/cd\b|\bcicd\b/i, label: "CI/CD" },
  { pattern: /\bgithub\s?actions\b/i, label: "GitHub Actions" },
  { pattern: /\bgithub\b/i, label: "GitHub" },
  { pattern: /\bgit\b/i, label: "Git" },
  { pattern: /\blinux\b|\bubuntu\b|\bdebian\b/i, label: "Linux" },
  { pattern: /\bnginx\b/i, label: "Nginx" },

  // Mobile & Cross-platform
  { pattern: /\breact\s?native\b/i, label: "React Native" },
  { pattern: /\bflutter\b/i, label: "Flutter" },
  { pattern: /\bandroid\s?(?:sdk|studio|development)?\b/i, label: "Android" },
  { pattern: /\bios\b(?!\s?version)/i, label: "iOS" },

  // Testing & Quality Assurance
  { pattern: /\bjunit\b/i, label: "JUnit" },
  { pattern: /\bselenium\b/i, label: "Selenium" },
  { pattern: /\bjest\b/i, label: "Jest" },
  { pattern: /\bcypress\b/i, label: "Cypress" },
  { pattern: /\bmocha\b/i, label: "Mocha" }
];

// Stricter section patterns requiring line/heading boundaries or explicit header formatting
const SECTION_PATTERNS = {
  experience: /(?:^|\n)[ \t]*(?:\d+\.?\s*)?(?:work\s+experience|professional\s+experience|employment\s+history|career\s+history|work\s+history|experience|internships?|relevant\s+experience)[ \t]*(?::[ \t]*|\n|$)/i,
  education: /(?:^|\n)[ \t]*(?:\d+\.?\s*)?(?:education|academic\s+background|academic\s+qualifications?|educational\s+qualifications?|academics|qualifications?)[ \t]*(?::[ \t]*|\n|$)/i,
  skills: /(?:^|\n)[ \t]*(?:\d+\.?\s*)?(?:technical\s+skills|skills\s*(?:&|and)\s*abilities|core\s+competencies|competencies|technologies|tools\s*(?:&|and)\s*technologies|programming\s+languages|skills)[ \t]*(?::[ \t]*|\n|$)/i,
  projects: /(?:^|\n)[ \t]*(?:\d+\.?\s*)?(?:projects|personal\s+projects|academic\s+projects|key\s+projects|project\s+work|featured\s+projects)[ \t]*(?::[ \t]*|\n|$)/i,
  certifications: /(?:^|\n)[ \t]*(?:\d+\.?\s*)?(?:certifications?|licenses?\s*(?:&|and)\s*certifications?|professional\s+certifications?|courses?\s*(?:&|and)\s*certifications?)[ \t]*(?::[ \t]*|\n|$)/i,
  achievements: /(?:^|\n)[ \t]*(?:\d+\.?\s*)?(?:achievements?|accomplishments?|honors?\s*(?:&|and)\s*awards?|awards?\s*(?:&|and)\s*honors?|key\s+achievements?)[ \t]*(?::[ \t]*|\n|$)/i,
  summary: /(?:^|\n)[ \t]*(?:\d+\.?\s*)?(?:professional\s+summary|career\s+summary|summary\s+of\s+qualifications|executive\s+summary|career\s+objective|professional\s+profile|profile\s+summary|summary|objective|about\s+me)[ \t]*(?::[ \t]*|\n|$)/i,
  languages: /(?:^|\n)[ \t]*(?:\d+\.?\s*)?(?:languages\s*known|spoken\s+languages|language\s+proficiency|foreign\s+languages)[ \t]*(?::[ \t]*|\n|$)/i
};

// Definitive negative document signals (hard disqualifiers for obvious non-resume documents)
const NEGATIVE_SIGNALS = [
  // Academic Lab Handbooks / Scenarios / Manuals / Exercises
  { re: /\b(?:lab(?:oratory)?\s+(?:manual|handbook|scenario|workbook|course\s+handbook|session\s+sheet)s?)\b/i, reason: "lab manual / handbook document" },
  { re: /\blaboratory\s+(?:manual|handbook|course|session|exercise)\b/i, reason: "laboratory manual document" },
  { re: /\b(?:viva\s+voce|viva\s+questions?)\b/i, reason: "viva voce / academic evaluation" },
  { re: /(?:^|\n)[ \t]*team\s+members?\s*[:\n]/i, reason: "team member assignment list" },
  { re: /\bscope\s+note\s*:/i, reason: "academic handbook scope note" },
  { re: /\b(?:experiment\s+no\.?|apparatus\s+required|observation\s+table)\b/i, reason: "lab experiment documentation" },

  // Data Structure / Algorithm Lab Scenarios (e.g. BST scenarios)
  { re: /\b(?:binary\s+search\s+tree|bst)\b[\s\S]{0,300}\b(?:scenario|experiment|implement\s+and\s+delete|kth\s+smallest|greater\s+tree|range\s+sum)/is, reason: "data structure lab scenario" },
  { re: /\b(?:aim|objective)\s*:\s*(?:to\s+)?(?:implement|write\s+a\s+program|verify\s+the|study\s+the)\b/i, reason: "lab experiment aim statement" },

  // Coursework / Assignments / Exams / Problem Sheets
  { re: /\b(?:question\s*\d+|q\.\s*\d+)\b[\s\S]{0,300}\b(?:maximum\s+marks|marks\s+obtained|total\s+marks|answer\s+the\s+following|solve\s+the\s+following)\b/i, reason: "examination paper / assignment" },
  { re: /\b(?:mid-?term\s+exam(?:ination)?|final\s+exam(?:ination)?|semester\s+end\s+exam(?:ination)?|question\s+paper)\b/i, reason: "examination question paper" },
  { re: /\b(?:assignment\s*[-#]?\s*\d+|homework\s*[-#]?\s*\d+|problem\s+sheet|tutorial\s+sheet)\b/i, reason: "academic assignment document" },
  { re: /\b(?:problem\s+statement\s*:?|sample\s+input\s*:?|sample\s+output\s*:?|constraints\s*:)\b/i, reason: "programming problem scenario / contest problem" },

  // Non-Resume Formats: Certificates / Invoices / Timetables
  { re: /\bthis\s+is\s+to\s+certify\s+that\s+[A-Z][a-z]+\s+[A-Z][a-z]+\s+has\s+(?:successfully\s+)?completed\b/i, reason: "certificate document" },
  { re: /\b(?:certificate\s+of\s+(?:completion|participation|achievement|merit|appreciation))\b/i, reason: "certificate document" },
  { re: /\binvoice\s*(?:no|number|#)?\s*[:.]?\s*\d+/i, reason: "invoice document" },
  { re: /\b(?:amount\s+due|bill\s+to|billing\s+address|payment\s+terms)\b/i, reason: "billing / commercial invoice" },
  { re: /\b(?:class\s+timetable|time\s*table)\b[\s\S]{0,200}\b(?:period\s*\d|monday|tuesday)/i, reason: "class timetable" }
];

// Legitimate Resume Degree Patterns
const DEGREE_PATTERNS = [
  /\b(?:b\.?\s?tech|b\.?\s?e\.?|bachelor(?:'s)?(?:\s+of\s+[a-z\s]+)?|b\.?\s?s\.?c?|bba|bca)\b/i,
  /\b(?:m\.?\s?tech|m\.?\s?e\.?|master(?:'s)?(?:\s+of\s+[a-z\s]+)?|m\.?\s?s\.?c?|mba|mca)\b/i,
  /\b(?:ph\.?\s?d|doctorate|doctor\s+of\s+philosophy)\b/i,
  /\b(?:diploma|associate(?:'s)?\s+degree|higher\s+secondary|high\s+school)\b/i
];

// Timeline / Date Range Patterns in Resumes
const DATE_RANGE_PATTERNS = [
  /\b(?:19|20)\d{2}\s*[-–—to\s]+\s*(?:(?:19|20)\d{2}|present|current)\b/i,
  /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(?:19|20)\d{2}\s*[-–—to\s]+\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(?:19|20)\d{2}|present|current)\b/i,
  /\b(?:0?[1-9]|1[0-2])\/(?:19|20)\d{2}\s*[-–—to\s]+\s*(?:(?:0?[1-9]|1[0-2])\/(?:19|20)\d{2}|present|current)\b/i
];

// Candidate Job / Role Title Patterns
const JOB_TITLE_PATTERNS = [
  /\b(?:software|frontend|backend|full\s*stack|web|mobile|cloud|devops|data|ml|ai|systems?|qa|test)\s+(?:engineer|developer|architect|consultant|specialist|lead)\b/i,
  /\b(?:data\s+scientist|data\s+analyst|business\s+analyst|product\s+manager|project\s+manager)\b/i,
  /\b(?:software\s+engineering\s+intern|software\s+intern|engineering\s+intern|intern|graduate\s+trainee|associate)\b/i,
  /\b(?:technical\s+lead|engineering\s+manager|scrum\s+master|system\s+administrator)\b/i
];

const ACTION_VERBS = [
  "developed", "built", "created", "designed", "implemented", "managed", "led", "launched",
  "engineered", "architected", "deployed", "optimized", "improved", "maintained", "integrated",
  "collaborated", "delivered", "achieved", "automated", "reduced", "increased", "analysed",
  "analyzed", "coordinated", "established", "mentored", "researched", "streamlined", "worked",
  "contributed", "supported", "executed", "handled", "resolved", "operated", "produced"
];

const TECH_CATEGORIES = [
  ["Python", "Java", "C++", "JavaScript", "TypeScript", "Go", "Rust", "PHP", "C#", "Kotlin", "C"],
  ["HTML", "CSS", "React", "Angular", "Vue.js", "Next.js", "Bootstrap", "Tailwind CSS", "Redux"],
  ["Node.js", "Express.js", "Django", "Flask", "FastAPI", "Spring Boot", "REST API", "GraphQL", "gRPC"],
  ["MongoDB", "MySQL", "PostgreSQL", "SQLite", "SQL", "Redis", "Firebase", "Elasticsearch", "SQL Server"],
  ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Git", "GitHub", "CI/CD", "Linux", "Jenkins", "Terraform"],
  ["Machine Learning", "Deep Learning", "Pandas", "NumPy", "TensorFlow", "PyTorch", "Scikit-learn", "OpenCV"]
];

module.exports = {
  SKILLS_DICT,
  SECTION_PATTERNS,
  NEGATIVE_SIGNALS,
  DEGREE_PATTERNS,
  DATE_RANGE_PATTERNS,
  JOB_TITLE_PATTERNS,
  ACTION_VERBS,
  TECH_CATEGORIES
};
