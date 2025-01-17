const express = require('express');
const userController = require('../controllers/userController');
const jwtAuthenticate = require('../config/jwtAuthenticate');

const router = express.Router();
const upload = require('../utils/multer');

router.post('/authenticate', userController.authenticate);

router.get('/getAllUsers', jwtAuthenticate, userController.getAllUsers);
router.post('/saveUser',upload.single('profilePicture'), userController.saveUser);
router.get('/getAllDepartments', userController.getAllDepartments);
router.post('/saveDepartment', userController.saveDepartment);

router.get('/getAllRoles', userController.getAllRoles);
router.post('/saveRole', userController.saveRole);

router.get('/getAllDepartmentRoleMappings', userController.getAllDepartmentRoleMappings);
router.post('/saveDepartmentRoleMapping', userController.saveDepartmentRoleMapping);

router.get('/getMenus', userController.getMenus);
router.get('/getRolePermissions', userController.getRolePermissions);






module.exports = router;
