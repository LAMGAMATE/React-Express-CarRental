import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // استيراد المكون المسؤول عن التنبيهات
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar'; 
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Dashboard from './admin/pages/Dashboard';
import AddCar from './admin/pages/AddCar';
import CarDetails from './pages/CarDetails';
import ManageCars from './admin/pages/ManageCars'; 
import BookingPage from './pages/PageReservation'; 
import Home from './pages/Home'; 
import MyReservations from './pages/MyReservations';
import ManageReservations from './admin/pages/ManageReservations'; 
import MyReviews from './pages/MyReviews'; 
import EditCar from './admin/pages/EditCar'; 
import ManageUsers from './admin/pages/ManageUsers';
import EditUser from './admin/pages/EditUser';

function App() {
  return (
    <Router>
      {/* إضافة مكون Toaster هنا ليتمكن أي مكون فرعي (Page) 
          من إظهار رسائل النجاح أو الخطأ دون الحاجة لتعريفه بكل صفحة
      */}
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        gutter={8}
        toastOptions={{
          // يمكنك تخصيص التصميم هنا ليتناسب مع موقع تأجير السيارات الخاص بك
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
            fontSize: '14px',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4caf50',
            },
          },
          error: {
            duration: 4000,
            theme: {
              primary: '#e53935',
            },
          },
        }}
      />

      {/* النافبار يظهر في كل الصفحات */}
      <Navbar /> 

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* مسارات الأدمن (Admin Routes) */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/add-car" element={<AddCar />} />
          <Route path="/admin/cars" element={<ManageCars />} />
          <Route path="/admin/reservations" element={<ManageReservations />} />
          <Route path="/admin/edit-car/:id" element={<EditCar />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/edit-user/:id" element={<EditUser />} />

          {/* مسارات المستخدمين (User Routes) */}
          <Route path="/car/:id" element={<CarDetails />} />
          <Route path="/book/:carId" element={<BookingPage />} />
          <Route path="/my-reservations" element={<MyReservations />} />
          <Route path="/my-reviews" element={<MyReviews />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;