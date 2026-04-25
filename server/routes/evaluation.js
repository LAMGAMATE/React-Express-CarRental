const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. جلب متوسط التقييمات لسيارة معينة
router.get('/average/:voiture_id', (req, res) => {
    const { voiture_id } = req.params;
    const sql = `SELECT AVG(etoiles) as averageRating, COUNT(*) as totalReviews 
                 FROM evaluation WHERE voiture_id = ?`;
    
    db.query(sql, [voiture_id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({
            averageRating: result[0].averageRating || 0,
            totalReviews: result[0].totalReviews || 0
        });
    });
});

// 2. إضافة أو تحديث تقييم (المنطق الجديد)
router.post('/add', (req, res) => {
    const { utilisateur_id, voiture_id, etoiles } = req.body;

    // الخطوة الأولى: التحقق إذا كان المستخدم قد قيم هذه السيارة مسبقاً
    const checkSql = "SELECT id FROM evaluation WHERE utilisateur_id = ? AND voiture_id = ?";
    
    db.query(checkSql, [utilisateur_id, voiture_id], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length > 0) {
            // الخطوة الثانية: إذا وجدنا تقييم سابق، نقوم بتحديثه
            const updateSql = "UPDATE evaluation SET etoiles = ?, dateCreation = NOW() WHERE id = ?";
            db.query(updateSql, [etoiles, results[0].id], (errUp) => {
                if (errUp) return res.status(500).json(errUp);
                return res.json({ message: "Évaluation mise à jour avec succès" });
            });
        } else {
            // الخطوة الثالثة: إذا لم يسبق له التقييم، نضيف تقييماً جديداً
            const insertSql = "INSERT INTO evaluation (utilisateur_id, voiture_id, etoiles, dateCreation) VALUES (?, ?, ?, NOW())";
            db.query(insertSql, [utilisateur_id, voiture_id, etoiles], (errIn) => {
                if (errIn) return res.status(500).json(errIn);
                return res.status(201).json({ message: "Évaluation ajoutée مع succès" });
            });
        }
    });
});


// جلب جميع تقييمات مستخدم معين (مع تفاصيل السيارة)
router.get('/user/:utilisateur_id', (req, res) => {
    const { utilisateur_id } = req.params;
    const sql = `
        SELECT e.*, v.marque, v.modele, v.image_url 
        FROM evaluation e 
        JOIN voiture v ON e.voiture_id = v.id 
        WHERE e.utilisateur_id = ?
        ORDER BY e.dateCreation DESC`;
    
    db.query(sql, [utilisateur_id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// حذف تقييم
router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM evaluation WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Évaluation supprimée" });
    });
});

module.exports = router;