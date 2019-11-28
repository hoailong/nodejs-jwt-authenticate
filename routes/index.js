const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const friendController = require('../controllers/friendController');

router.get('/', (req, res)=>{
    res.send('ok');
});
router.get("/login", (req, res)=>{
    res.render('login', {
        title: 'Login Demo'
    });
});
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.use(auth.isAuth);
router.get("/friends", friendController.friendLists);

module.exports = router;