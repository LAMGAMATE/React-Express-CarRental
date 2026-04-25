const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// إعداد مكان تخزين الصور
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // سيتم حفظ الصور في مجلد اسمه uploads
    },
    filename: (req, file, cb) => {
        // تسمية الصورة برقم فريد + اسمها الأصلي لمنع التكرار
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// مسار إضافة سيارة مع صورة (استخدام upload.single)
router.post('/add', upload.single('image'), (req, res) => {
    const { marque, modele, prixParJour, stock, carburant, description } = req.body; // أضفنا description
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = "INSERT INTO Voiture (marque, modele, prixParJour, stock, carburant, image_url, description) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [marque, modele, prixParJour, stock, carburant, image_url, description], (err, result) => {
        if (err) return res.status(500).json({ message: "Erreur serveur" });
        res.status(201).json({ message: "Véhicule ajouté avec succès !" });
    });
});


// مسار جلب جميع السيارات لعرضها في الـ Home
router.get('/all', (req, res) => {
    // نجلب فقط السيارات المتاحة (isAvailable = 1)
    const sql = "SELECT * FROM Voiture";
    
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erreur lors de la récupération des voitures" });
        }
        res.status(200).json(result); // نرسل القائمة للـ React
    });
});


// 1. مسار حذف سيارة
router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM Voiture WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la suppression" });
        res.status(200).json({ message: "Voiture supprimée avec succès !" });
    });
});

// 2. مسار جلب سيارة واحدة (نحتاجه عند الضغط على Modifier)
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM Voiture WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Erreur" });
        res.status(200).json(result[0]);
    });
});



// مسار تحديث معلومات السيارة
router.put('/update/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { marque, modele, prixParJour, stock, carburant, description } = req.body;
    
    let sql;
    let params;

    // إذا تم رفع صورة جديدة، نقوم بتحديث مسار الصورة أيضاً
    if (req.file) {
        const image_url = `/uploads/${req.file.filename}`;
        sql = "UPDATE Voiture SET marque=?, modele=?, prixParJour=?, stock=?, carburant=?, description=?, image_url=? WHERE id=?";
        params = [marque, modele, prixParJour, stock, carburant, description, image_url, id];
    } else {
        sql = "UPDATE Voiture SET marque=?, modele=?, prixParJour=?, stock=?, carburant=?, description=? WHERE id=?";
        params = [marque, modele, prixParJour, stock, carburant, description, id];
    }

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ message: "Erreur lors de la mise à jour" });
        res.status(200).json({ message: "Véhicule mis à jour avec succès !" });
    });
});

module.exports = router;