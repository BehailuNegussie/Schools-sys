export type Role = 'admin' | 'teacher' | 'student' | 'parent';

export type StudentStatus = 'Active' | 'Honors' | 'Probation' | 'Alumni';

export interface Student {
  id: string; // e.g. "MOA-2026-0101"
  firstName: string;
  lastName: string;
  grade: number; // 9, 10, 11, 12
  section: string; // 'A' | 'B' | 'C'
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  email: string;
  phone: string;
  address: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  guardianRelation: string;
  enrollmentDate: string;
  status: StudentStatus;
  gpa: number;
  attendanceRate: number; // percentage, e.g. 96.5
  avatarUrl: string;
  emergencyContact: string;
  medicalNotes?: string;
  courses: string[]; // course IDs
}

export interface Faculty {
  id: string;
  name: string;
  title: string;
  department: 'Mathematics & Computing' | 'Natural Sciences' | 'Humanities & Languages' | 'Fine Arts & Music' | 'Physical Education & Athletics';
  email: string;
  phone: string;
  office: string;
  degrees: string;
  coursesAssigned: string[];
  avatarUrl: string;
}

export interface Course {
  id: string;
  code: string; // e.g. "AP-PHY-101"
  title: string;
  department: string;
  gradeLevel: number;
  credits: number;
  teacherId: string;
  teacherName: string;
  room: string;
  period: string; // e.g. "08:30 - 09:45 AM"
  days: string[]; // ['Mon', 'Wed', 'Fri']
  capacity: number;
  enrolledCount: number;
  description: string;
  color: string;
}

export interface GradeEntry {
  id: string;
  studentId: string;
  courseId: string;
  term: string; // e.g. "Fall 2026"
  homeworkScore: number; // weight 20%
  midtermScore: number; // weight 30%
  finalScore: number; // weight 40%
  participationScore: number; // weight 10%
  letterGrade: string;
  gpaPoint: number;
  teacherNotes: string;
  lastUpdated: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  courseId: string;
  studentId: string;
  status: 'Present' | 'Absent' | 'Tardy' | 'Excused';
  remarks?: string;
}

export interface TuitionInvoice {
  id: string;
  studentId: string;
  studentName: string;
  grade: number;
  term: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
  invoiceDate: string;
  receiptNumber?: string;
  items: { description: string; amount: number }[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Academic' | 'Administrative' | 'Sports & Arts' | 'Urgent';
  targetAudience: 'All' | 'Faculty' | 'Students' | 'Parents';
  author: string;
  date: string;
  pinned?: boolean;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  timeSlot: string;
  periodNumber: number;
  courseCode: string;
  courseName: string;
  teacherName: string;
  room: string;
  gradeLevel: number;
  color: string;
}
