const router = require('express').Router();
const {getUserInfo, updateUser} = require('../controllers/users');
const {userUpdateValidation} = require('../middleware/validate');

router.get('/me', getUserInfo);

router.patch('/me', userUpdateValidation, updateUser);

module.exports = router;