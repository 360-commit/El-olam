// prisma/seed.js — Seeds the database with demo data for El-Olam School
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding El-Olam International School database...\n");

  // ── Clean existing data (dev only) ──────────────────────────────────────────
  await prisma.notification.deleteMany();
  await prisma.libraryLoan.deleteMany();
  await prisma.libraryBook.deleteMany();
  await prisma.result.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.fee.deleteMany();
  await prisma.feeStructure.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.timetableSlot.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.event.deleteMany();
  await prisma.studentParent.deleteMany();
  await prisma.student.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.classRoom.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Cleaned existing data");

  // ── Admin User ───────────────────────────────────────────────────────────────
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@elolam.edu.gh",
      passwordHash: await bcrypt.hash("admin123", 12),
      role: "ADMIN",
      admin: {
        create: {
          firstName: "Kwame",
          lastName: "Asante",
          phone: "+233200000000",
        },
      },
    },
  });
  console.log("✅ Admin user created:", adminUser.email);

  // ── Subjects ─────────────────────────────────────────────────────────────────
  const subjects = await Promise.all([
    prisma.subject.create({ data: { name: "Mathematics",    code: "MATH" } }),
    prisma.subject.create({ data: { name: "English",        code: "ENG"  } }),
    prisma.subject.create({ data: { name: "Science",        code: "SCI"  } }),
    prisma.subject.create({ data: { name: "Social Studies", code: "SOC"  } }),
    prisma.subject.create({ data: { name: "French",         code: "FRE"  } }),
    prisma.subject.create({ data: { name: "Creative Arts",  code: "ART"  } }),
    prisma.subject.create({ data: { name: "Computing",      code: "ICT"  } }),
    prisma.subject.create({ data: { name: "P.E.",           code: "PE"   } }),
  ]);
  console.log("✅ Subjects created:", subjects.length);

  // ── Teachers ─────────────────────────────────────────────────────────────────
  const teacherData = [
    { email: "grace@elolam.edu.gh",    fn: "Grace",    ln: "Owusu",    subject: "English & Literacy", level: "GRADE_3",       exp: 8  },
    { email: "samuel@elolam.edu.gh",   fn: "Samuel",   ln: "Tetteh",   subject: "Mathematics",        level: "GRADE_5",       exp: 12 },
    { email: "patricia@elolam.edu.gh", fn: "Patricia", ln: "Annan",    subject: "Early Childhood",    level: "DAY_CARE",      exp: 6  },
    { email: "esther@elolam.edu.gh",   fn: "Esther",   ln: "Kumi",     subject: "Science & Nature",   level: "GRADE_1",       exp: 4  },
    { email: "daniel@elolam.edu.gh",   fn: "Daniel",   ln: "Ofori",    subject: "Social Studies",     level: "GRADE_4",       exp: 9  },
    { email: "comfort@elolam.edu.gh",  fn: "Comfort",  ln: "Amoah",    subject: "Phonics & Reading",  level: "KINDERGARTEN",  exp: 7  },
  ];

  const teachers = [];
  for (const t of teacherData) {
    const user = await prisma.user.create({
      data: {
        email: t.email,
        passwordHash: await bcrypt.hash("teacher123", 12),
        role: "TEACHER",
        teacher: {
          create: {
            firstName: t.fn,
            lastName: t.ln,
            subject: t.subject,
            classLevel: t.level,
            experience: t.exp,
            phone: "+233" + Math.floor(200000000 + Math.random() * 799999999),
          },
        },
      },
      include: { teacher: true },
    });
    teachers.push(user.teacher);
  }
  console.log("✅ Teachers created:", teachers.length);

  // ── Classrooms ───────────────────────────────────────────────────────────────
  const classLevels = [
    { level: "DAY_CARE",         name: "Day Care",          teacherIdx: 2 },
    { level: "CRECHE",           name: "Creche",            teacherIdx: 2 },
    { level: "PLAY_CLASS",       name: "Play Class",        teacherIdx: 2 },
    { level: "KINDERGARTEN",     name: "Kindergarten",      teacherIdx: 5 },
    { level: "NURSERY",          name: "Nursery",           teacherIdx: 5 },
    { level: "LEARNING_TO_READ", name: "Learning to Read",  teacherIdx: 5 },
    { level: "GRADE_1",          name: "Grade 1",           teacherIdx: 3 },
    { level: "GRADE_2",          name: "Grade 2",           teacherIdx: 3 },
    { level: "GRADE_3",          name: "Grade 3",           teacherIdx: 0 },
    { level: "GRADE_4",          name: "Grade 4",           teacherIdx: 4 },
    { level: "GRADE_5",          name: "Grade 5",           teacherIdx: 1 },
    { level: "GRADE_6",          name: "Grade 6",           teacherIdx: 1 },
  ];

  const classrooms = [];
  for (const cl of classLevels) {
    const room = await prisma.classRoom.create({
      data: {
        name: cl.name,
        level: cl.level,
        teacherId: teachers[cl.teacherIdx]?.id,
        academicYear: "2024",
        capacity: 30,
      },
    });
    classrooms.push(room);
  }
  console.log("✅ Classrooms created:", classrooms.length);

  // ── Students ─────────────────────────────────────────────────────────────────
  const studentData = [
    { email: "amara@elolam.edu.gh",   fn: "Amara",   ln: "Osei",     roll: "G3-01", level: "GRADE_3",     classIdx: 8  },
    { email: "zara@elolam.edu.gh",    fn: "Zara",    ln: "Mensah",   roll: "KG-05", level: "KINDERGARTEN", classIdx: 3  },
    { email: "eli@elolam.edu.gh",     fn: "Eli",     ln: "Boateng",  roll: "G1-03", level: "GRADE_1",     classIdx: 6  },
    { email: "nana@elolam.edu.gh",    fn: "Nana",    ln: "Adjei",    roll: "NR-02", level: "NURSERY",     classIdx: 4  },
    { email: "david@elolam.edu.gh",   fn: "David",   ln: "Asante",   roll: "G5-07", level: "GRADE_5",     classIdx: 10 },
    { email: "adwoa@elolam.edu.gh",   fn: "Adwoa",   ln: "Frimpong", roll: "G2-04", level: "GRADE_2",     classIdx: 7  },
    { email: "isaac@elolam.edu.gh",   fn: "Isaac",   ln: "Darkwa",   roll: "G6-02", level: "GRADE_6",     classIdx: 11 },
    { email: "abena@elolam.edu.gh",   fn: "Abena",   ln: "Gyasi",    roll: "DC-01", level: "DAY_CARE",    classIdx: 0  },
  ];

  const students = [];
  for (const s of studentData) {
    const user = await prisma.user.create({
      data: {
        email: s.email,
        passwordHash: await bcrypt.hash("student123", 12),
        role: "STUDENT",
        student: {
          create: {
            firstName: s.fn,
            lastName: s.ln,
            rollNumber: s.roll,
            classLevel: s.level,
            classRoomId: classrooms[s.classIdx]?.id,
            enrolledAt: new Date("2024-01-15"),
          },
        },
      },
      include: { student: true },
    });
    students.push(user.student);
  }
  console.log("✅ Students created:", students.length);

  // ── Parents ───────────────────────────────────────────────────────────────────
  const parentNames = [
    { fn: "Kwame",  ln: "Osei",     phone: "+233801234567", childIdx: 0 },
    { fn: "Abena",  ln: "Mensah",   phone: "+233802345678", childIdx: 1 },
    { fn: "Kofi",   ln: "Boateng",  phone: "+233803456789", childIdx: 2 },
    { fn: "Ama",    ln: "Adjei",    phone: "+233804567890", childIdx: 3 },
    { fn: "Yaw",    ln: "Asante",   phone: "+233805678901", childIdx: 4 },
    { fn: "Kwesi",  ln: "Frimpong", phone: "+233806789012", childIdx: 5 },
    { fn: "Esi",    ln: "Darkwa",   phone: "+233807890123", childIdx: 6 },
    { fn: "Kojo",   ln: "Gyasi",    phone: "+233808901234", childIdx: 7 },
  ];

  for (const p of parentNames) {
    const user = await prisma.user.create({
      data: {
        email: `${p.fn.toLowerCase()}.${p.ln.toLowerCase()}@gmail.com`,
        passwordHash: await bcrypt.hash("parent123", 12),
        role: "PARENT",
        parent: {
          create: {
            firstName: p.fn,
            lastName: p.ln,
            phone: p.phone,
          },
        },
      },
      include: { parent: true },
    });
    // Link parent to student
    await prisma.studentParent.create({
      data: {
        studentId: students[p.childIdx].id,
        parentId: user.parent.id,
        isPrimary: true,
        relationship: "Guardian",
      },
    });
  }
  console.log("✅ Parents created and linked to students");

  // ── Fee Structures ────────────────────────────────────────────────────────────
  const feeAmounts = {
    DAY_CARE: 7000, CRECHE: 7500, PLAY_CLASS: 8000,
    KINDERGARTEN: 9500, NURSERY: 8000, LEARNING_TO_READ: 9000,
    GRADE_1: 10500, GRADE_2: 11000, GRADE_3: 12000,
    GRADE_4: 12500, GRADE_5: 13000, GRADE_6: 14000,
  };

  const feeStructures = [];
  for (const [level, amount] of Object.entries(feeAmounts)) {
    for (const term of ["TERM_1", "TERM_2", "TERM_3"]) {
      const fs = await prisma.feeStructure.create({
        data: {
          classLevel: level,
          term,
          academicYear: "2024",
          amount,
          dueDate: new Date(term === "TERM_1" ? "2024-02-01" : term === "TERM_2" ? "2024-05-01" : "2024-09-01"),
          description: `${level.replace(/_/g, " ")} ${term.replace("_", " ")} fee`,
        },
      });
      feeStructures.push(fs);
    }
  }
  console.log("✅ Fee structures created:", feeStructures.length);

  // ── Student Fees (Term 2) ─────────────────────────────────────────────────────
  const paidAmounts = [8000, 9500, 5000, 8000, 10000, 11000, 7000, 7000];
  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    const fs = feeStructures.find(
      (f) => f.classLevel === s.classLevel && f.term === "TERM_2"
    );
    if (!fs) continue;

    const fee = await prisma.fee.create({
      data: {
        studentId: s.id,
        feeStructureId: fs.id,
        term: "TERM_2",
        academicYear: "2024",
        amountDue: fs.amount,
        amountPaid: paidAmounts[i],
        status: paidAmounts[i] >= fs.amount ? "PAID" : paidAmounts[i] > 0 ? "PARTIAL" : "PENDING",
        dueDate: fs.dueDate,
      },
    });

    if (paidAmounts[i] > 0) {
      await prisma.payment.create({
        data: {
          feeId: fee.id,
          amount: paidAmounts[i],
          method: "CASH",
          paidAt: new Date("2024-05-01"),
          reference: `PAY-${Date.now()}-${i}`,
          notes: "Term 2 payment",
        },
      });
    }
  }
  console.log("✅ Student fees and payments seeded");

  // ── Attendance (this week) ────────────────────────────────────────────────────
  const attStatuses = [
    [92, 98, 78, 95, 88, 100, 72, 90],
  ];
  const today = new Date();
  for (let d = 0; d < 5; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + 1 + d);
    for (let i = 0; i < students.length; i++) {
      const rand = Math.random() * 100;
      const pct = attStatuses[0][i];
      await prisma.attendance.create({
        data: {
          studentId: students[i].id,
          date,
          status: rand < pct ? "PRESENT" : rand < pct + 5 ? "LATE" : "ABSENT",
          term: "TERM_2",
          academicYear: "2024",
          markedBy: teachers[0]?.id,
        },
      }).catch(() => {}); // ignore duplicates
    }
  }
  console.log("✅ Attendance records seeded");

  // ── Results (Term 2) ──────────────────────────────────────────────────────────
  const scoreMap = {
    "G3-01": [88, 75, 92, 70, 85, 78],
    "KG-05": [95, 90, 88, 92, 87, 91],
    "G1-03": [65, 70, 60, 72, 68, 55],
    "NR-02": [80, 85, 78, 82, 75, 88],
    "G5-07": [72, 68, 75, 80, 65, 70],
    "G2-04": [95, 98, 92, 96, 90, 94],
    "G6-02": [60, 55, 70, 65, 58, 72],
    "DC-01": [88, 82, 90, 85, 78, 92],
  };

  const calcGrade = (score) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  };

  for (const s of students) {
    const scores = scoreMap[s.rollNumber] || [70, 70, 70, 70, 70, 70];
    for (let j = 0; j < Math.min(6, subjects.length); j++) {
      await prisma.result.create({
        data: {
          studentId: s.id,
          subjectId: subjects[j].id,
          teacherId: teachers[0]?.id,
          term: "TERM_2",
          academicYear: "2024",
          endOfTerm: scores[j],
          totalScore: scores[j],
          grade: calcGrade(scores[j]),
        },
      });
    }
  }
  console.log("✅ Results seeded");

  // ── Notices ───────────────────────────────────────────────────────────────────
  const noticesData = [
    { title: "End of Term Examinations",  body: "End of second term examinations begin on June 10. All students must bring their stationery and arrive by 7:30AM sharp.", type: "EXAM",    priority: "HIGH",   targetRoles: ["STUDENT", "PARENT", "TEACHER"] },
    { title: "Parents-Teachers Meeting",  body: "PTM is scheduled for 25th May at 9AM. All parents are expected to attend. Light refreshments will be served after the meeting.", type: "MEETING", priority: "HIGH",   targetRoles: ["PARENT", "TEACHER"] },
    { title: "School Fees Reminder",      body: "Kindly ensure all outstanding fees are cleared by end of May to avoid disruption to your child's education.", type: "FINANCE", priority: "MEDIUM", targetRoles: ["PARENT"] },
    { title: "Sports Day 2024",           body: "Annual sports day on June 1st. Students should wear their house colours. Parents are welcome to attend and cheer.", type: "EVENT",   priority: "LOW",    targetRoles: ["STUDENT", "PARENT", "TEACHER"] },
    { title: "New Library Books Added",   body: "Over 200 new books have been added to the school library. Students are encouraged to borrow and read daily.", type: "GENERAL", priority: "LOW",    targetRoles: ["STUDENT", "TEACHER"] },
  ];

  for (const n of noticesData) {
    await prisma.notice.create({
      data: {
        title: n.title,
        body: n.body,
        type: n.type,
        priority: n.priority,
        targetRoles: n.targetRoles,
        publishedAt: new Date(),
        authorId: teachers[0]?.id,
      },
    });
  }
  console.log("✅ Notices seeded");

  // ── Events ────────────────────────────────────────────────────────────────────
  await prisma.event.createMany({
    data: [
      { title: "End-of-Term Exams", eventDate: new Date("2024-06-10"), type: "exam",    color: "#F04E4E" },
      { title: "PTM",               eventDate: new Date("2024-05-25"), type: "meeting", color: "#29B6E8" },
      { title: "Sports Day",        eventDate: new Date("2024-06-01"), type: "event",   color: "#2EC97A" },
      { title: "Prizegiving Day",   eventDate: new Date("2024-07-05"), type: "event",   color: "#FFD03A" },
      { title: "Vacation Begins",   eventDate: new Date("2024-07-12"), type: "holiday", color: "#FF8040" },
    ],
  });
  console.log("✅ Events seeded");

  // ── Library Books ────────────────────────────────────────────────────────────
  await prisma.libraryBook.createMany({
    data: [
      { title: "The Magic of Numbers",    author: "J.K. Smart",  genre: "Mathematics", totalCopies: 5 },
      { title: "Our World & Environment", author: "A. Mensah",   genre: "Science",     totalCopies: 4 },
      { title: "Stories from Ghana",      author: "K. Asante",   genre: "Literature",  totalCopies: 7 },
      { title: "First Words Phonics",     author: "P. Collins",  genre: "Phonics",     totalCopies: 6 },
      { title: "Junior Atlas of Africa",  author: "UNESCO",      genre: "Geography",   totalCopies: 3 },
      { title: "Fun with French",         author: "M. Dupont",   genre: "French",      totalCopies: 4 },
    ],
  });
  console.log("✅ Library books seeded");

  console.log("\n🎉 Database seeded successfully!");
  console.log("─────────────────────────────────────────");
  console.log("Login credentials:");
  console.log("  Admin:   admin@elolam.edu.gh     / admin123");
  console.log("  Teacher: grace@elolam.edu.gh     / teacher123");
  console.log("  Student: amara@elolam.edu.gh     / student123");
  console.log("  Parent:  kwame.osei@gmail.com    / parent123");
  console.log("─────────────────────────────────────────\n");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
