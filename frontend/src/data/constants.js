// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
export const C = {
  white: "#FFFFFF",
  bg: "#F0F6FB",
  card: "#FFFFFF",
  sky: "#29B6E8",
  skyLight: "#E3F4FC",
  skyDark: "#1490C0",
  yellow: "#FFD03A",
  yellowLight: "#FFF8DC",
  yellowDark: "#E6B800",
  green: "#2EC97A",
  greenLight: "#E4F9EE",
  greenDark: "#1FA85C",
  navy: "#0B2640",
  navyMid: "#163D5E",
  text: "#0F2132",
  textMid: "#4A6478",
  textLight: "#93A8B8",
  border: "#DDE8F0",
  red: "#F04E4E",
  orange: "#FF8040",
  purple: "#7C5CBF",
};

// ─── SCHOOL INFO ──────────────────────────────────────────────────────────────
export const SCHOOL = {
  name: "El-Olam International School",
  motto: "Home Away from Home",
  address: "123 Education Avenue, Accra, Ghana",
  phone: "+233-20-000-0000",
  email: "info@elolam.edu.gh",
  website: "www.elolam.edu.gh",
  principal: "Dr. Emmanuel Osei-Bonsu",
  currentTerm: "Term 2",
  academicYear: "2024",
  type: "Primary School",
};

// ─── CLASSES ──────────────────────────────────────────────────────────────────
export const CLASSES = [
  "Day Care",
  "Creche",
  "Play Class",
  "Kindergarten",
  "Nursery",
  "Learning to Read",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
];

// ─── SUBJECTS ─────────────────────────────────────────────────────────────────
export const SUBJECTS = [
  "Mathematics",
  "English",
  "Science",
  "Social Studies",
  "French",
  "Creative Arts",
  "Computing",
  "Physical Education",
];

export const SUBJECTS6 = ["Maths", "English", "Science", "Social", "French", "Arts"];

// ─── DEMO USERS ───────────────────────────────────────────────────────────────
// TODO: Replace with real authentication (JWT / Firebase Auth / Supabase Auth)
export const DEMO_USERS = {
  admin: {
    id: "admin-001",
    role: "admin",
    name: "Dr. Kwame Asante",
    email: "admin@elolam.edu.gh",
    pass: "admin123",
    avatar: "KA",
    class: null,
    subject: null,
    permissions: ["all"],
  },
  teacher: {
    id: "teacher-001",
    role: "teacher",
    name: "Mrs. Grace Owusu",
    email: "grace@elolam.edu.gh",
    pass: "teacher123",
    avatar: "GO",
    class: "Grade 3",
    subject: "English & Literacy",
    permissions: ["view_students", "enter_grades", "view_timetable", "view_notices"],
  },
  student: {
    id: "student-001",
    role: "student",
    name: "Amara Osei",
    email: "amara@elolam.edu.gh",
    pass: "student123",
    avatar: "AO",
    class: "Grade 3",
    roll: "G3-01",
    permissions: ["view_own_grades", "view_own_fees", "view_timetable", "view_notices"],
  },
};

// ─── STUDENTS ─────────────────────────────────────────────────────────────────
// TODO: Fetch from backend API: GET /api/students
export const STUDENTS = [
  { id: 1,  name: "Amara Osei",     class: "Grade 3",      roll: "G3-01", av: "AO", fee: 12000, paid: 8000,  att: 92,  dob: "2015-04-12", parent: "Kwame Osei",    phone: "080-1234-5678", status: "active" },
  { id: 2,  name: "Zara Mensah",    class: "Kindergarten", roll: "KG-05", av: "ZM", fee: 9500,  paid: 9500,  att: 98,  dob: "2019-07-22", parent: "Abena Mensah",  phone: "080-2345-6789", status: "active" },
  { id: 3,  name: "Eli Boateng",    class: "Grade 1",      roll: "G1-03", av: "EB", fee: 10500, paid: 5000,  att: 78,  dob: "2018-01-08", parent: "Kofi Boateng",  phone: "080-3456-7890", status: "active" },
  { id: 4,  name: "Nana Adjei",     class: "Nursery",      roll: "NR-02", av: "NA", fee: 8000,  paid: 8000,  att: 95,  dob: "2020-03-15", parent: "Ama Adjei",     phone: "080-4567-8901", status: "active" },
  { id: 5,  name: "David Asante",   class: "Grade 5",      roll: "G5-07", av: "DA", fee: 13000, paid: 10000, att: 88,  dob: "2013-11-30", parent: "Yaw Asante",    phone: "080-5678-9012", status: "active" },
  { id: 6,  name: "Adwoa Frimpong", class: "Grade 2",      roll: "G2-04", av: "AF", fee: 11000, paid: 11000, att: 100, dob: "2016-06-19", parent: "Kwesi Frimpong",phone: "080-6789-0123", status: "active" },
  { id: 7,  name: "Isaac Darkwa",   class: "Grade 6",      roll: "G6-02", av: "ID", fee: 14000, paid: 7000,  att: 72,  dob: "2012-09-05", parent: "Esi Darkwa",    phone: "080-7890-1234", status: "active" },
  { id: 8,  name: "Abena Gyasi",    class: "Day Care",     roll: "DC-01", av: "AG", fee: 7000,  paid: 7000,  att: 90,  dob: "2022-02-28", parent: "Kojo Gyasi",    phone: "080-8901-2345", status: "active" },
];

// ─── TEACHERS ─────────────────────────────────────────────────────────────────
// TODO: Fetch from backend API: GET /api/teachers
export const TEACHERS = [
  { id: 1, name: "Mrs. Grace Owusu",    subject: "English & Literacy", class: "Grade 3",      av: "GO", phone: "070-1111-2222", exp: 8,  status: "active", email: "grace@elolam.edu.gh"    },
  { id: 2, name: "Mr. Samuel Tetteh",   subject: "Mathematics",        class: "Grade 5 & 6",  av: "ST", phone: "070-2222-3333", exp: 12, status: "active", email: "samuel@elolam.edu.gh"   },
  { id: 3, name: "Mrs. Patricia Annan", subject: "Early Childhood",    class: "Day Care",     av: "PA", phone: "070-3333-4444", exp: 6,  status: "active", email: "patricia@elolam.edu.gh" },
  { id: 4, name: "Miss Esther Kumi",    subject: "Science & Nature",   class: "Grade 1 & 2",  av: "EK", phone: "070-4444-5555", exp: 4,  status: "active", email: "esther@elolam.edu.gh"   },
  { id: 5, name: "Mr. Daniel Ofori",    subject: "Social Studies",     class: "Grade 4 & 5",  av: "DO", phone: "070-5555-6666", exp: 9,  status: "active", email: "daniel@elolam.edu.gh"   },
  { id: 6, name: "Mrs. Comfort Amoah",  subject: "Phonics & Reading",  class: "Nursery & KG", av: "CA", phone: "070-6666-7777", exp: 7,  status: "active", email: "comfort@elolam.edu.gh"  },
];

// ─── NOTICES ──────────────────────────────────────────────────────────────────
// TODO: Fetch from backend API: GET /api/notices
export const NOTICES = [
  { id: 1, title: "End of Term Examinations",  date: "Jun 10, 2024", type: "exam",    priority: "high",   body: "End of second term examinations begin on June 10. All students must bring their stationery and arrive by 7:30AM sharp." },
  { id: 2, title: "Parents-Teachers Meeting",  date: "May 25, 2024", type: "meeting", priority: "high",   body: "PTM is scheduled for 25th May at 9AM. All parents are expected to attend. Light refreshments will be served after the meeting." },
  { id: 3, title: "School Fees Reminder",      date: "May 20, 2024", type: "finance", priority: "medium", body: "Kindly ensure all outstanding fees are cleared by end of May to avoid disruption to your child's education." },
  { id: 4, title: "Sports Day 2024",           date: "Jun 01, 2024", type: "event",   priority: "low",    body: "Annual sports day on June 1st. Students should wear their house colours. Parents are welcome to attend and cheer." },
  { id: 5, title: "New Library Books Added",   date: "May 15, 2024", type: "general", priority: "low",    body: "Over 200 new books have been added to the school library. Students are encouraged to borrow and read daily." },
];

// ─── FEES DATA ────────────────────────────────────────────────────────────────
// TODO: Fetch from backend API: GET /api/fees/summary
export const FEES_DATA = [
  { class: "Day Care",         termFee: 7000,  collected: 6300,  students: 5  },
  { class: "Creche",           termFee: 7500,  collected: 7500,  students: 8  },
  { class: "Play Class",       termFee: 8000,  collected: 6400,  students: 10 },
  { class: "Kindergarten",     termFee: 9500,  collected: 8550,  students: 12 },
  { class: "Nursery",          termFee: 8000,  collected: 7200,  students: 11 },
  { class: "Learning to Read", termFee: 9000,  collected: 9000,  students: 9  },
  { class: "Grade 1",          termFee: 10500, collected: 8400,  students: 15 },
  { class: "Grade 2",          termFee: 11000, collected: 10450, students: 14 },
  { class: "Grade 3",          termFee: 12000, collected: 10800, students: 16 },
  { class: "Grade 4",          termFee: 12500, collected: 11250, students: 13 },
  { class: "Grade 5",          termFee: 13000, collected: 10400, students: 15 },
  { class: "Grade 6",          termFee: 14000, collected: 11200, students: 12 },
];

// ─── ATTENDANCE WEEKLY ────────────────────────────────────────────────────────
// TODO: Fetch from backend API: GET /api/attendance/weekly
export const ATT_WEEK = [
  { day: "Mon", present: 118, absent: 12 },
  { day: "Tue", present: 124, absent: 6  },
  { day: "Wed", present: 121, absent: 9  },
  { day: "Thu", present: 119, absent: 11 },
  { day: "Fri", present: 116, absent: 14 },
];

// ─── TIMETABLE ────────────────────────────────────────────────────────────────
// TODO: Fetch from backend API: GET /api/timetable?class=Grade3
export const TIMETABLE = {
  Monday: [
    { time: "7:30–8:00",  sub: "Assembly",       teacher: "All Staff",   col: "#E3F4FC", tc: "#1490C0" },
    { time: "8:00–9:00",  sub: "Mathematics",    teacher: "Mr. Tetteh",  col: "#FFF8DC", tc: "#E6B800" },
    { time: "9:00–10:00", sub: "English",        teacher: "Mrs. Owusu",  col: "#E4F9EE", tc: "#1FA85C" },
    { time: "10:00–10:20",sub: "Break",          teacher: "—",           col: "#F4F7FA", tc: "#93A8B8" },
    { time: "10:20–11:20",sub: "Science",        teacher: "Miss Kumi",   col: "#F0EEFF", tc: "#7C5CBF" },
    { time: "11:20–12:20",sub: "Social Studies", teacher: "Mr. Ofori",   col: "#FFF0E8", tc: "#FF8040" },
    { time: "12:20–1:00", sub: "Lunch",          teacher: "—",           col: "#F4F7FA", tc: "#93A8B8" },
    { time: "1:00–2:00",  sub: "Creative Arts",  teacher: "Mrs. Amoah",  col: "#FFF8DC", tc: "#E6B800" },
  ],
  Tuesday: [
    { time: "7:30–8:00",  sub: "Assembly",    teacher: "All Staff",  col: "#E3F4FC", tc: "#1490C0" },
    { time: "8:00–9:00",  sub: "English",     teacher: "Mrs. Owusu", col: "#E4F9EE", tc: "#1FA85C" },
    { time: "9:00–10:00", sub: "Mathematics", teacher: "Mr. Tetteh", col: "#FFF8DC", tc: "#E6B800" },
    { time: "10:00–10:20",sub: "Break",       teacher: "—",          col: "#F4F7FA", tc: "#93A8B8" },
    { time: "10:20–11:20",sub: "French",      teacher: "Mrs. Annan", col: "#F0EEFF", tc: "#7C5CBF" },
    { time: "11:20–12:20",sub: "Computing",   teacher: "Mr. Ofori",  col: "#E3F4FC", tc: "#1490C0" },
    { time: "12:20–1:00", sub: "Lunch",       teacher: "—",          col: "#F4F7FA", tc: "#93A8B8" },
    { time: "1:00–2:00",  sub: "P.E.",        teacher: "Mr. Tetteh", col: "#FFF0E8", tc: "#FF8040" },
  ],
  Wednesday: [
    { time: "7:30–8:00",  sub: "Assembly",       teacher: "All Staff",   col: "#E3F4FC", tc: "#1490C0" },
    { time: "8:00–9:00",  sub: "Science",        teacher: "Miss Kumi",   col: "#F0EEFF", tc: "#7C5CBF" },
    { time: "9:00–10:00", sub: "Social Studies", teacher: "Mr. Ofori",   col: "#FFF0E8", tc: "#FF8040" },
    { time: "10:00–10:20",sub: "Break",          teacher: "—",           col: "#F4F7FA", tc: "#93A8B8" },
    { time: "10:20–11:20",sub: "Mathematics",    teacher: "Mr. Tetteh",  col: "#FFF8DC", tc: "#E6B800" },
    { time: "11:20–12:20",sub: "English",        teacher: "Mrs. Owusu",  col: "#E4F9EE", tc: "#1FA85C" },
    { time: "12:20–1:00", sub: "Lunch",          teacher: "—",           col: "#F4F7FA", tc: "#93A8B8" },
    { time: "1:00–2:00",  sub: "Library",        teacher: "Mrs. Amoah",  col: "#E3F4FC", tc: "#1490C0" },
  ],
  Thursday: [
    { time: "7:30–8:00",  sub: "Assembly",    teacher: "All Staff",   col: "#E3F4FC", tc: "#1490C0" },
    { time: "8:00–9:00",  sub: "French",      teacher: "Mrs. Annan",  col: "#F0EEFF", tc: "#7C5CBF" },
    { time: "9:00–10:00", sub: "Mathematics", teacher: "Mr. Tetteh",  col: "#FFF8DC", tc: "#E6B800" },
    { time: "10:00–10:20",sub: "Break",       teacher: "—",           col: "#F4F7FA", tc: "#93A8B8" },
    { time: "10:20–11:20",sub: "English",     teacher: "Mrs. Owusu",  col: "#E4F9EE", tc: "#1FA85C" },
    { time: "11:20–12:20",sub: "Science",     teacher: "Miss Kumi",   col: "#F0EEFF", tc: "#7C5CBF" },
    { time: "12:20–1:00", sub: "Lunch",       teacher: "—",           col: "#F4F7FA", tc: "#93A8B8" },
    { time: "1:00–2:00",  sub: "Computing",   teacher: "Mr. Ofori",   col: "#E3F4FC", tc: "#1490C0" },
  ],
  Friday: [
    { time: "7:30–8:00",  sub: "Assembly",       teacher: "All Staff",   col: "#E3F4FC", tc: "#1490C0" },
    { time: "8:00–9:00",  sub: "Creative Arts",  teacher: "Mrs. Amoah",  col: "#FFF8DC", tc: "#E6B800" },
    { time: "9:00–10:00", sub: "English",        teacher: "Mrs. Owusu",  col: "#E4F9EE", tc: "#1FA85C" },
    { time: "10:00–10:20",sub: "Break",          teacher: "—",           col: "#F4F7FA", tc: "#93A8B8" },
    { time: "10:20–11:20",sub: "Social Studies", teacher: "Mr. Ofori",   col: "#FFF0E8", tc: "#FF8040" },
    { time: "11:20–12:20",sub: "P.E.",           teacher: "Mr. Tetteh",  col: "#FFF0E8", tc: "#FF8040" },
    { time: "12:20–1:00", sub: "Lunch",          teacher: "—",           col: "#F4F7FA", tc: "#93A8B8" },
    { time: "1:00–2:00",  sub: "General Revision",teacher: "All Staff",  col: "#E4F9EE", tc: "#1FA85C" },
  ],
};

// ─── EVENTS ───────────────────────────────────────────────────────────────────
export const EVENTS = [
  { id: 1, title: "End-of-Term Exams", date: "Jun 10, 2024", type: "exam",    color: "#F04E4E" },
  { id: 2, title: "PTM",              date: "May 25, 2024", type: "meeting", color: "#29B6E8" },
  { id: 3, title: "Sports Day",       date: "Jun 01, 2024", type: "event",   color: "#2EC97A" },
  { id: 4, title: "Prizegiving Day",  date: "Jul 05, 2024", type: "event",   color: "#FFD03A" },
  { id: 5, title: "Vacation Begins",  date: "Jul 12, 2024", type: "holiday", color: "#FF8040" },
];

// ─── STUDENT SCORES ───────────────────────────────────────────────────────────
// TODO: Fetch from backend API: GET /api/results?studentId=xxx&term=2
export const SCORES = {
  AO: [88, 75, 92, 70, 85, 78],
  ZM: [95, 90, 88, 92, 87, 91],
  EB: [65, 70, 60, 72, 68, 55],
  NA: [80, 85, 78, 82, 75, 88],
  DA: [72, 68, 75, 80, 65, 70],
  AF: [95, 98, 92, 96, 90, 94],
  ID: [60, 55, 70, 65, 58, 72],
  AG: [88, 82, 90, 85, 78, 92],
};

// ─── LIBRARY BOOKS ────────────────────────────────────────────────────────────
// TODO: Fetch from backend API: GET /api/library/books
export const LIBRARY_BOOKS = [
  { id: 1, title: "The Magic of Numbers",     author: "J.K. Smart",  class: "Grade 3-6",   genre: "Mathematics", available: 3, total: 5 },
  { id: 2, title: "Our World & Environment",  author: "A. Mensah",   class: "Grade 1-3",   genre: "Science",     available: 1, total: 4 },
  { id: 3, title: "Stories from Ghana",       author: "K. Asante",   class: "All Classes", genre: "Literature",  available: 5, total: 7 },
  { id: 4, title: "First Words Phonics",      author: "P. Collins",  class: "Nursery-KG",  genre: "Phonics",     available: 0, total: 6 },
  { id: 5, title: "Junior Atlas of Africa",   author: "UNESCO",      class: "Grade 4-6",   genre: "Geography",   available: 2, total: 3 },
  { id: 6, title: "Bible Stories for Kids",   author: "D. Williams", class: "All Classes", genre: "Religious",   available: 4, total: 6 },
  { id: 7, title: "Fun with French",          author: "M. Dupont",   class: "Grade 2-4",   genre: "French",      available: 3, total: 4 },
  { id: 8, title: "My First Science Lab",     author: "A. Asante",   class: "Grade 4-6",   genre: "Science",     available: 2, total: 3 },
];
