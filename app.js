/*
====================================================
🎓 Student Management System (Node.js + MongoDB + MVC)
====================================================

📘 Overview:
This single-file Node.js project demonstrates a
Student Management System using Express.js and MongoDB.
It follows MVC principles by including models, controllers,
and routes in one file for simplicity.

Features:
- CRUD operations on students
- Student properties: name, age, course
- Mongoose handles database interaction

Endpoints:
POST    /api/students       -> Create student
GET     /api/students       -> Get all students
GET     /api/students/:id   -> Get student by ID
PUT     /api/students/:id   -> Update student
DELETE  /api/students/:id   -> Delete student
====================================================
*/

// 1️⃣ Import Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// 2️⃣ Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

// 3️⃣ Connect MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/studentDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// =========================
// 4️⃣ Student Model
// =========================
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    course: { type: String, required: true }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

// =========================
// 5️⃣ Student Controller
// =========================
const studentController = {

    // Create Student
    createStudent: async (req, res) => {
        try {
            const student = new Student(req.body);
            const savedStudent = await student.save();
            res.status(201).json(savedStudent);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Get All Students
    getAllStudents: async (req, res) => {
        try {
            const students = await Student.find();
            res.json(students);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get Student by ID
    getStudentById: async (req, res) => {
        try {
            const student = await Student.findById(req.params.id);
            if (!student) return res.status(404).json({ message: 'Student not found' });
            res.json(student);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Update Student
    updateStudent: async (req, res) => {
        try {
            const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
            res.json(updatedStudent);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Delete Student
    deleteStudent: async (req, res) => {
        try {
            const deletedStudent = await Student.findByIdAndDelete(req.params.id);
            if (!deletedStudent) return res.status(404).json({ message: 'Student not found' });
            res.json({ message: 'Student deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

};

// =========================
// 6️⃣ Routes
// =========================
app.post('/api/students', studentController.createStudent);
app.get('/api/students', studentController.getAllStudents);
app.get('/api/students/:id', studentController.getStudentById);
app.put('/api/students/:id', studentController.updateStudent);
app.delete('/api/students/:id', studentController.deleteStudent);

// =========================
// 7️⃣ Start Server
// =========================
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

/*
====================================================
📄 Usage:

1. Start MongoDB locally.
2. Run: node app.js
3. Use Postman or browser to test endpoints.

====================================================
*/
