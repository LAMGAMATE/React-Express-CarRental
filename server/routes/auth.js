const express = require('express');
const router = express.Router();
const db = require('../db'); // استدعاء الاتصال بقاعدة البيانات

// مسار تسجيل مستخدم جديد
router.post('/register', (req, res) => {
    const { cin, nomComplet, email, password, phone } = req.body;

    const sql = "INSERT INTO Utilisateur (cin, nomComplet, email, password, phone) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [cin, nomComplet, email, password, phone], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "خطأ أثناء التسجيل، ربما البريد أو CIN موجود مسبقاً" });
        }
        res.status(201).json({ message: "تم إنشاء الحساب بنجاح!", userId: result.insertId });
    });
});

// مسار تسجيل الدخول
// مسار تسجيل الدخول المحدث
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM Utilisateur WHERE email = ? AND password = ?";
    
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Server error" });
        }
        
        if (result.length > 0) {
            const user = result[0];
            res.status(200).json({ 
                message: "Login successful!", 
                user: { 
                    id: user.id, 
                    nom: user.nomComplet, 
                    role: user.role,
                    email: user.email, // أضفنا هذا
                    phone: user.phone  // أضفنا هذا
                } 
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    });
});


router.put('/update-profile', (req, res) => {
    const { userId, email, phone, oldPassword, newPassword } = req.body;

    // 1. التأكد أولاً من كلمة السر القديمة
    const checkSql = "SELECT password FROM Utilisateur WHERE id = ?";
    db.query(checkSql, [userId], (err, result) => {
        if (err || result.length === 0) return res.status(500).json({ message: "User not found" });

        if (result[0].password !== oldPassword) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }

        // 2. إذا كانت صحيحة، نقوم بتحديث البيانات
        // سنحدث كلمة السر فقط إذا قام المستخدم بكتابة كلمة سر جديدة
        const finalPassword = newPassword ? newPassword : oldPassword;
        const updateSql = "UPDATE Utilisateur SET email = ?, phone = ?, password = ? WHERE id = ?";
        
        db.query(updateSql, [email, phone, finalPassword, userId], (err, updateResult) => {
            if (err) return res.status(500).json({ message: "Error updating profile" });
            res.status(200).json({ message: "Profile updated successfully!" });
        });
    });
});



// manage users


// جلب جميع المستخدمين (للأدمن فقط)
// 1. جلب جميع المستخدمين
router.get('/users/all', (req, res) => {
    const sql = "SELECT id, cin, nomComplet, email, phone, role FROM Utilisateur ORDER BY id DESC";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: "Erreur serveur" });
        res.status(200).json(result);
    });
});

// 2. جلب مستخدم واحد (للتعديل)
router.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM Utilisateur WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ message: "Erreur" });
        res.status(200).json(result[0]);
    });
});

// 3. تحديث بيانات مستخدم من طرف الأدمن
router.put('/users/update/:id', (req, res) => {
    const { id } = req.params;
    const { cin, nomComplet, email, phone } = req.body;
    const sql = "UPDATE Utilisateur SET cin=?, nomComplet=?, email=?, phone=? WHERE id=?";
    db.query(sql, [cin, nomComplet, email, phone, id], (err, result) => {
        if (err) return res.status(500).json({ message: "Erreur update" });
        res.status(200).json({ message: "Utilisateur mis à jour" });
    });
});

// 4. حذف مستخدم
router.delete('/users/delete/:id', (req, res) => {
    db.query("DELETE FROM Utilisateur WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: "Erreur delete" });
        res.status(200).json({ message: "Supprimé" });
    });
});

module.exports = router;