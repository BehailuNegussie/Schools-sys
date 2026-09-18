import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Student,
  Faculty,
  Course,
  GradeEntry,
  AttendanceRecord,
  TuitionInvoice,
  Announcement,
  TimetableSlot,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_FACULTY,
  INITIAL_COURSES,
  INITIAL_GRADES,
  INITIAL_ATTENDANCE,
  INITIAL_INVOICES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TIMETABLE,
} from '../data/seedData';
import { calculateWeightedScore, getLetterAndGPA } from '../utils/academicUtils';

interface SchoolContextType {
  role: Role;
  setRole: (role: Role) => void;
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  activeTeacherId: string;
  setActiveTeacherId: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Data
  students: Student[];
  faculty: Faculty[];
  courses: Course[];
  grades: GradeEntry[];
  attendance: AttendanceRecord[];
  invoices: TuitionInvoice[];
  announcements: Announcement[];
  timetable: TimetableSlot[];

  // Mutators
  addStudent: (student: Omit<Student, 'id' | 'enrollmentDate' | 'gpa' | 'attendanceRate'>) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  updateGrade: (id: string, updates: Partial<GradeEntry>) => void;
  addGrade: (entry: Omit<GradeEntry, 'id' | 'lastUpdated'>) => void;

  saveAttendance: (records: AttendanceRecord[]) => void;

  addInvoice: (invoice: Omit<TuitionInvoice, 'id'>) => void;
  recordPayment: (invoiceId: string, amount: number) => void;

  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  deleteAnnouncement: (id: string) => void;

  addFaculty: (faculty: Omit<Faculty, 'id'>) => void;

  resetToDefaultData: () => void;

  // Global Search Modal
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  selectedStudentForModal: Student | null;
  setSelectedStudentForModal: (student: Student | null) => void;
  selectedStudentForReportCard: Student | null;
  setSelectedStudentForReportCard: (student: Student | null) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'moa_students_v1',
  FACULTY: 'moa_faculty_v1',
  COURSES: 'moa_courses_v1',
  GRADES: 'moa_grades_v1',
  ATTENDANCE: 'moa_attendance_v1',
  INVOICES: 'moa_invoices_v1',
  ANNOUNCEMENTS: 'moa_announcements_v1',
  TIMETABLE: 'moa_timetable_v1',
  ROLE: 'moa_role_v1',
  ACTIVE_STUDENT: 'moa_active_student_v1',
  ACTIVE_TEACHER: 'moa_active_teacher_v1',
};

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as Role) || 'admin';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [activeStudentId, setActiveStudentIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT) || 'MOA-2026-0101';
  });

  const [activeTeacherId, setActiveTeacherIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_TEACHER) || 'FAC-101';
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [faculty, setFaculty] = useState<Faculty[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FACULTY);
    return saved ? JSON.parse(saved) : INITIAL_FACULTY;
  });

  const [courses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [grades, setGrades] = useState<GradeEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GRADES);
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [invoices, setInvoices] = useState<TuitionInvoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [timetable] = useState<TimetableSlot[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
    return saved ? JSON.parse(saved) : INITIAL_TIMETABLE;
  });

  // Modal states
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);
  const [selectedStudentForReportCard, setSelectedStudentForReportCard] = useState<Student | null>(null);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, activeStudentId);
  }, [activeStudentId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TEACHER, activeTeacherId);
  }, [activeTeacherId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(faculty));
  }, [faculty]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
  };

  const setActiveStudentId = (id: string) => {
    setActiveStudentIdState(id);
  };

  const setActiveTeacherId = (id: string) => {
    setActiveTeacherIdState(id);
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'enrollmentDate' | 'gpa' | 'attendanceRate'>) => {
    const nextNumber = 100 + students.length + 1;
    const newId = `MOA-2026-0${nextNumber}`;
    const newStudent: Student = {
      ...studentData,
      id: newId,
      enrollmentDate: new Date().toISOString().split('T')[0],
      gpa: 3.8,
      attendanceRate: 100,
      avatarUrl: studentData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    };

    setStudents(prev => [newStudent, ...prev]);

    // Create default invoice for new student
    const newInvoice: TuitionInvoice = {
      id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentId: newId,
      studentName: `${newStudent.firstName} ${newStudent.lastName}`,
      grade: newStudent.grade,
      term: 'Fall 2026',
      totalAmount: 13500,
      paidAmount: 0,
      dueDate: '2026-10-15',
      status: 'Pending',
      invoiceDate: new Date().toISOString().split('T')[0],
      items: [
        { description: `Grade ${newStudent.grade} Academy Tuition`, amount: 11800 },
        { description: 'Registration & Orientation Fee', amount: 900 },
        { description: 'Campus Computing & Facilities Fee', amount: 800 },
      ],
    };
    setInvoices(prev => [newInvoice, ...prev]);

    return newStudent;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const updateGrade = (id: string, updates: Partial<GradeEntry>) => {
    setGrades(prev =>
      prev.map(g => {
        if (g.id !== id) return g;
        const merged = { ...g, ...updates, lastUpdated: new Date().toISOString().split('T')[0] };
        const score = calculateWeightedScore(
          merged.homeworkScore,
          merged.midtermScore,
          merged.finalScore,
          merged.participationScore
        );
        const { letter, gpa } = getLetterAndGPA(score);
        return {
          ...merged,
          letterGrade: letter,
          gpaPoint: gpa,
        };
      })
    );
  };

  const addGrade = (entry: Omit<GradeEntry, 'id' | 'lastUpdated'>) => {
    const score = calculateWeightedScore(
      entry.homeworkScore,
      entry.midtermScore,
      entry.finalScore,
      entry.participationScore
    );
    const { letter, gpa } = getLetterAndGPA(score);
    const newEntry: GradeEntry = {
      ...entry,
      id: `GRD-${Date.now()}`,
      letterGrade: letter,
      gpaPoint: gpa,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setGrades(prev => [...prev, newEntry]);
  };

  const saveAttendance = (newRecords: AttendanceRecord[]) => {
    setAttendance(prev => {
      // Remove any existing records for the same date, courseId, and studentId
      const filtered = prev.filter(
        p => !newRecords.some(n => n.date === p.date && n.courseId === p.courseId && n.studentId === p.studentId)
      );
      return [...filtered, ...newRecords];
    });
  };

  const addInvoice = (invoice: Omit<TuitionInvoice, 'id'>) => {
    const newInvoice: TuitionInvoice = {
      ...invoice,
      id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
    };
    setInvoices(prev => [newInvoice, ...prev]);
  };

  const recordPayment = (invoiceId: string, amount: number) => {
    const receipt = `RCP-${Math.floor(10000 + Math.random() * 90000)}`;
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id !== invoiceId) return inv;
        const newPaid = inv.paidAmount + amount;
        const newStatus = newPaid >= inv.totalAmount ? 'Paid' : newPaid > 0 ? 'Partial' : inv.status;
        return {
          ...inv,
          paidAmount: Math.min(newPaid, inv.totalAmount),
          status: newStatus,
          receiptNumber: receipt,
        };
      })
    );
  };

  const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      ...announcement,
      id: `ANN-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const addFaculty = (fac: Omit<Faculty, 'id'>) => {
    const newFac: Faculty = {
      ...fac,
      id: `FAC-${100 + faculty.length + 1}`,
    };
    setFaculty(prev => [...prev, newFac]);
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setStudents(INITIAL_STUDENTS);
    setFaculty(INITIAL_FACULTY);
    setGrades(INITIAL_GRADES);
    setAttendance(INITIAL_ATTENDANCE);
    setInvoices(INITIAL_INVOICES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setRoleState('admin');
    setActiveStudentIdState('MOA-2026-0101');
    setActiveTeacherIdState('FAC-101');
  };

  return (
    <SchoolContext.Provider
      value={{
        role,
        setRole,
        activeStudentId,
        setActiveStudentId,
        activeTeacherId,
        setActiveTeacherId,
        activeTab,
        setActiveTab,
        students,
        faculty,
        courses,
        grades,
        attendance,
        invoices,
        announcements,
        timetable,
        addStudent,
        updateStudent,
        deleteStudent,
        updateGrade,
        addGrade,
        saveAttendance,
        addInvoice,
        recordPayment,
        addAnnouncement,
        deleteAnnouncement,
        addFaculty,
        resetToDefaultData,
        isSearchOpen,
        setIsSearchOpen,
        selectedStudentForModal,
        setSelectedStudentForModal,
        selectedStudentForReportCard,
        setSelectedStudentForReportCard,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
