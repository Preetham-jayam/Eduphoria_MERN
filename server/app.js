const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const morgan = require('morgan');
const HttpError = require('./models/http-error');
const rfs = require('rotating-file-stream');
const path=require('path');
const app = express();
require('dotenv').config();
const { MONGODB_URL } = process.env;

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: path.join(__dirname, 'logs')
});


app.use(morgan('combined', { stream: accessLogStream }));


const corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));
app.use(morgan('dev'));

app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));
app.use("/images", express.static(__dirname + "/images"));
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

// Routes
const authRoutes = require("./routes/auth");
const teacherRoutes = require('./routes/teacher');
const courseRoutes = require('./routes/course');
const studentRoutes = require('./routes/student');
const adminRoutes = require('./routes/admin');

app.use("/api/user", authRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/student', studentRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});


mongoose
  .connect(MONGODB_URL)
  .then(() => {
    const server = app.listen(8000, () => {
      console.log("App Listening to port 8000");
    });
    console.log('MongoDB Connected...');
    
  })
  .catch((err) => console.log("MongoDB connection error:", err));
