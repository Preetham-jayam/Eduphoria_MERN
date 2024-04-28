
# Eduphoria - E-Learning Platform

Welcome to Eduphoria, an e-learning platform built using the MERN stack. Eduphoria offers a comprehensive set of features for teachers, students, and administrators, facilitating seamless learning and management within the platform.

## Table of Contents

- [Deployment Links](#deployment-links)
- [Screenshots](#screenshots)
- [How to Run](#how-to-run)
- [Users](#users)
- [Features](#features)
  - [General Features](#general-features)
  - [Student Features](#student-features)
  - [Teacher Features](#teacher-features)
  - [Admin Features](#admin-features)

## Deployment Links

- **Frontend:** [https://frontend-mern-delta.vercel.app/](https://frontend-mern-delta.vercel.app/)
- **Backend:** [https://backend-eduphoria.onrender.com/](https://backend-eduphoria.onrender.com/)
- **Documentation:** [https://backend-eduphoria.onrender.com/api-docs](https://backend-eduphoria.onrender.com/api-docs)

## Screenshots

1. **Home Page**
   ![Home Page](Screenshots/Home.png)

2. **Courses Page**
   ![Courses Page](Screenshots/Courses.png)

3. **Single Course Page**
   ![Single Course Page](Screenshots/Course.png)

4. **Student Home Page**
   ![Student Home Page](Screenshots/SHome.png)

5. **Course Content Page**
   ![Course Content Page](Screenshots/Content.png)

6. **Quiz Page**
   ![Quiz Page](Screenshots/Quiz.png)

7. **Teacher Course Update Page**
   ![Teacher Course Update Page](Screenshots/CUpdate.png)

8. **Admin Dashboard**
   ![Admin Dashboard](Screenshots/Admin.png)

## How to Run

To get started with Eduphoria, follow these steps:

1. Clone the GitHub repository:

   ```bash
   git clone https://github.com/Preetham-jayam/Eduphoria_MERN.git
   ```

2. Open your terminal and navigate to the cloned directory.

3. Install Node.js modules for both the client and server:

   ```bash
   cd client
   npm install
   ```

   ```bash
   cd server
   npm install
   ```

4. **Environment Variables**

   To run this project, you will need to add the following environment variables to your `.env` file those API_KEY and API_SECRET can get from paypal signup:

   - `ADMIN_EMAIL`: `<admin_email>`
   - `ADMIN_PASSWORD`: `<admin_password>`
   - `MONGODB_URL`: `<mongodb_url>`
   - `CLOUD_NAME`: `<cloud_name>`
   - `API_KEY`: `<api_key>`
   - `API_SECRET`: `<api_secret>`
   - `CLOUDINARY_URL`: `<cloudinary_url>`

5. Start the development server:

   ```bash
   cd client
   npm start
   ```

   ```bash
   cd server
   npm start
   ```

6. Access the website at [http://localhost:3000](http://localhost:3000).

## Users

Eduphoria caters to three main types of users:

- Teacher
- Student
- Admin

## Features

### General Features

- All users can view the website and browse available courses.
- Access to courses requires signup and signin.
- Good authentication system using JWT tokens.
- Forgot password functionality is available.
- Implementation of mutations for getting data from the server using modern redux-toolkit.

### Student Features

- Students have their own dashboard.
- Enrollment in courses is open to students.
- Students can comment on enrolled courses.
- Access to chapters and lessons within enrolled courses.
- Profile and account editing capabilities.
- Multiple attempts for course quizzes.
- Certificate download upon course completion.

### Teacher Features

- Teachers can add courses upon approval by the admin.
- Dashboard for managing courses.
- Course creation, chapter and lesson addition, update, and deletion.
- Quiz question creation.
- Profile and account management.

### Admin Features

- User management including blocking and deletion.
- Approval or rejection of teacher requests.
- Course management including addition and deletion.
- Admin can send mails to students to share any important messages.

