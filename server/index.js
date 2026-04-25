const express = require('express');
const cors = require('cors');
const path = require('path'); // أضف هذا السطر في الأعلى
const db = require('./db');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// --- السطر الناقص لعرض الصور ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// ------------------------------

const carRoutes = require('./routes/cars');
app.use('/api/cars', carRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const reservationRoutes = require('./routes/reservation'); // تأكد من اسم الملف
app.use('/api/reservations', reservationRoutes);


const evaluationRoutes = require('./routes/evaluation');
app.use('/api/evaluations', evaluationRoutes);

app.get('/', (req, res) => {
    res.send('Server is running and Database is linked!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});