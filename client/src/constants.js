let BASE_URL;

if (process.env.NODE_ENV === 'production') {
    BASE_URL = 'https://eduphoria-mern-backend.onrender.com/';
} else {
    BASE_URL = 'http://localhost:8000/';
}

export const CHAT_URL = '/api/chat';
export const USERS_URL = '/api/user';
export const TEACHER_URL = '/api/teacher';
export const COURSES_URL = '/api/courses';
export const STUDENT_URL = '/api/student';
export const ADMIN_URL = '/api/admin';

export { BASE_URL };
