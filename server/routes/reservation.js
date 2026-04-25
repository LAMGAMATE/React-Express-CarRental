const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. إضافة حجز جديد
router.post('/add', (req, res) => {
    const { utilisateur_id, voiture_id, dateDebut, dateFin, prixTotal, statut, clientDetails } = req.body;

    const completeReservation = (userId) => {
        const checkActiveBooking = `
            SELECT id FROM reservation 
            WHERE utilisateur_id = ? 
            AND statut IN ('en_attente', 'confirmee')
            AND dateFin >= CURDATE()
        `;

        db.query(checkActiveBooking, [userId], (errCheck, activeResults) => {
            if (errCheck) return res.status(500).json({ message: "Erreur DB Check", error: errCheck });

            if (activeResults.length > 0) {
                return res.status(400).json({ message: "Désolé! Vous avez déjà une réservation en cours." });
            }

            const sqlInsert = `INSERT INTO reservation (utilisateur_id, voiture_id, dateDebut, dateFin, prixTotal, statut) VALUES (?, ?, ?, ?, ?, ?)`;
            db.query(sqlInsert, [userId, voiture_id, dateDebut, dateFin, prixTotal, statut], (err, result) => {
                if (err) return res.status(500).json({ message: "Erreur insertion", error: err });

                if (statut === 'confirmee') {
                    db.query("UPDATE voiture SET stock = stock - 1 WHERE id = ? AND stock > 0", [voiture_id]);
                }
                res.status(201).json({ message: "Réservation effectuée", id: result.insertId });
            });
        });
    };

    if (clientDetails && !utilisateur_id) {
        db.query("SELECT id FROM utilisateur WHERE cin = ?", [clientDetails.cin], (err, users) => {
            if (users.length > 0) { completeReservation(users[0].id); }
            else {
                const sqlCreateUser = `INSERT INTO utilisateur (cin, nomComplet, phone, role, password, email) VALUES (?, ?, ?, 'client', '123456', ?)`;
                db.query(sqlCreateUser, [clientDetails.cin, clientDetails.nomComplet, clientDetails.phone, `client_${Date.now()}@agency.com`], (errC, resC) => {
                    if (errC) return res.status(500).json({ message: "Erreur creation user" });
                    completeReservation(resC.insertId);
                });
            }
        });
    } else {
        completeReservation(utilisateur_id);
    }
});

// 2. تحديث الحالة (تأكيد أو إتمام الحجز)
router.put('/update-status/:id', (req, res) => {
    const reservationId = req.params.id;
    const { newStatut } = req.body; 

    db.query("SELECT voiture_id, statut FROM reservation WHERE id = ?", [reservationId], (err, result) => {
        if (err || result.length === 0) return res.status(404).json({ message: "Réservation non trouvée" });

        const { voiture_id, statut } = result[0];

        // من انتظار إلى تأكيد: ننقص المخزون
        if (statut === 'en_attente' && newStatut === 'confirmee') {
            db.query("UPDATE voiture SET stock = stock - 1 WHERE id = ? AND stock > 0", [voiture_id]);
        }
        // من تأكيد إلى إتمام (نهاية الرحلة): نرجع المخزون
        if (statut === 'confirmee' && newStatut === 'terminee') {
            db.query("UPDATE voiture SET stock = stock + 1 WHERE id = ?", [voiture_id]);
        }

        db.query("UPDATE reservation SET statut = ? WHERE id = ?", [newStatut, reservationId], (errUpdate) => {
            if (errUpdate) return res.status(500).json({ message: "Erreur Update" });
            res.json({ message: "Statut mis à jour" });
        });
    });
});

// 3. الحذف النهائي (للحالات الخاطئة فقط)
router.delete('/delete/:id', (req, res) => {
    const reservationId = req.params.id;
    db.query("SELECT voiture_id, statut FROM reservation WHERE id = ?", [reservationId], (err, result) => {
        if (result && result.length > 0) {
            const { voiture_id, statut } = result[0];
            db.query("DELETE FROM reservation WHERE id = ?", [reservationId], (errDel) => {
                if (!errDel && statut === 'confirmee') {
                    db.query("UPDATE voiture SET stock = stock + 1 WHERE id = ?", [voiture_id]);
                }
                res.json({ message: "Supprimée" });
            });
        } else {
            res.status(404).json({ message: "Non trouvée" });
        }
    });
});

// 4. جلب حجوزات مستخدم (History)
router.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    const sql = `
        SELECT r.id, r.utilisateur_id, r.voiture_id, r.dateDebut, r.dateFin, 
               r.prixTotal, r.statut, r.createdAt, -- تأكد من إضافة هذا الحقل هنا
               v.marque, v.modele, v.image_url 
        FROM reservation r 
        JOIN voiture v ON r.voiture_id = v.id 
        WHERE r.utilisateur_id = ? 
        ORDER BY r.id DESC
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: "Erreur DB", error: err });
        res.json(results);
    });
});

// 5. جلب كل الحجوزات للأدمن
router.get('/all', (req, res) => {
    const sql = `
        SELECT r.*, v.marque, v.modele, u.nomComplet, u.phone, u.cin
        FROM reservation r
        JOIN voiture v ON r.voiture_id = v.id
        JOIN utilisateur u ON r.utilisateur_id = u.id
        ORDER BY r.id DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: "Erreur DB", error: err });
        res.json(results);
    });
});

module.exports = router;