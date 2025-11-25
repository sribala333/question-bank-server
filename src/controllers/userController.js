const { query } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const messages = require('../constants/messages'); 
const redisClient = require('../config/redis');


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const findUserByEmail = async (email) => { return await prisma.users.findUnique({ where: { email } }); };
const snakeToCamel = require('../utils/util');
const SECRET_KEY = process.env.SECRET_KEY;
 
// Login
exports.authenticate = async (req, res) => {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(400).json({ message: messages.error.INVALID_EMAIL_PWD });
    }
    if (user && !user.active) { return res.status(400).json({ message: messages.error.USER_NOT_FOUND }); }
   await setUserId(user.user_id);
    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
};

const setUserId = async (userId)=>{
    redisClient.set('userId', 3600, JSON.stringify(userId));
    // redisClient.set('userId', userId, (err, reply) => {
    //     if (err) throw err;
    //     console.log(reply); // OK
    //   });
    }
  

exports.getAllUsers = async (req, res) => {
    try {
        // const result = await query('SELECT * FROM users');
        const result = await prisma.users.findMany({
            select: {
                user_id: true,
                user_name: true,
                email: true,
                active: true,
                profile_picture:true,
                user_department_role_trans: {
                    where: {
                        active: true
                    },
                    select: {
                        dept_role_id: true,
                        department_role_trans: {
                            select: {
                                departments: { select: { department_name: true } },
                                roles: { select: { role_name: true } }
                            }
                        }
                    }
                }

            },
        });
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        const customUsers = result.map(user => ({
            userId: user.user_id,
            userName: user.user_name,
            email: user.email,
            active: user.active,
            profilePicture: user.profile_picture
            ? `${baseUrl}/${user.profile_picture.replace(/\\/g, '/')}` // Replace backslashes for URLs
            : null,
            // deptRoleDetails: user.user_department_role_trans.map(m => ({
            //     deptRoleId: m.dept_role_id,
            //     departmentName: m.department_role_trans.departments?.department_name || null,
            //     roleName: m.department_role_trans.roles?.role_name || null
            // })),
            // Used destructuring here to avoid repetitive property access (m.department_role_trans)
            deptRoleDetails: user.user_department_role_trans.map(({ dept_role_id, department_role_trans }) => ({
                deptRoleId: dept_role_id,
                departmentName: department_role_trans?.departments?.department_name || null,
                roleName: department_role_trans?.roles?.role_name || null
            })),
        }));
        res.json(customUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Save a new user
exports.saveUser = async (req, res) => {
    try {
        // console.log(req.body.roles,'Roles')
        // const roles = JSON.parse(req.body.roles); 

        // const { userId, userName, email, password, roles,  active } = JSON.parse(req.body);
        const userId = req.body.userId ? parseInt(req.body.userId, 10) : null;
        const active = req.body.active === 'true'; // Convert string to boolean
        const { userName, email, password, roles } = req.body;
     
        const parsedRoles = roles ? JSON.parse(roles) : [];
        const user = await findUserByEmail(email); 

        const profilePicturePath = req.file ? req.file.path : null; 

        if (!userId) {
            if (user) { return res.status(400).json({ message: messages.error.USER_EXISTS }); }
       
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await query(
                'INSERT INTO users (user_name, email, password_hash, profile_picture) VALUES ($1, $2, $3, $4) RETURNING *',
                [userName, email, hashedPassword, profilePicturePath]
            );

            const userId = result.rows[0].id;
            await updateRoles(parsedRoles, userId);
            res.status(200).json({ message: messages.success.USER_CREATED, user: updatedUser });
        } else {
            const updatedUser = await prisma.users.update({
                where: { user_id: userId },
                data: {
                    user_name: userName,
                    profile_picture: profilePicturePath || null,
                    active: active
                },
            });

            await updateRoles(parsedRoles, userId);
            res.status(200).json({ message: messages.success.USER_UPDATED, user: updatedUser });

        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Update Roles for the respective user
updateRoles = async (roles, userId) => {
    for (const role of roles) {
        await prisma.user_department_role_trans.upsert({
            where: {
                user_id_dept_role_id: { user_id: userId, dept_role_id: role.deptRoleId } // Use composite unique key
            },
            update: { active: role.active },
            create: { user_id: userId, dept_role_id: role.deptRoleId, active: role.active }
        });
    }
}

// Fetch all departments
exports.getAllDepartments = async (req, res) => {
    try {
        // const result = await query('SELECT * FROM departments'); 
        const result = await prisma.departments.findMany({
            select: {
                department_id: true,
                department_name: true,
            },
        });

        const deptList = result.map(snakeToCamel);
        res.json(deptList);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Save a new department
exports.saveDepartment = async (req, res) => {
    try {
        const { departmentName } = req.body;
        // const result = await query(
        //     'INSERT INTO departments (department_name) VALUES ($1) RETURNING *',
        //     [departmentName]
        // );
        await prisma.departments.create({
            data: {
                department_name: departmentName
            }
        })
        res.status(201).json({ messages: messages.success.DEPT_CREATED });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Fetch all roles
exports.getAllRoles = async (req, res) => {
    try {
        const result = await query('SELECT * FROM roles');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Save a new role
exports.saveRole = async (req, res) => {
    try {
        const { roleName } = req.body;
        const result = await query(
            'INSERT INTO roles (role_name) VALUES ($1) RETURNING *',
            [roleName]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Fetch all department-role mappings
exports.getAllDepartmentRoleMappings = async (req, res) => {
    try {
        const result = await query('SELECT * FROM department_role_trans');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Save a new department-role mapping
exports.saveDepartmentRoleMapping = async (req, res) => {
    try {
        const { departmentId, roleId } = req.body;
        const result = await query(
            'INSERT INTO department_role_trans (department_id, role_id) VALUES ($1, $2) RETURNING *',
            [departmentId, roleId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
}; 

exports.getMenus = async (req, res) => {
    try {
        const id = parseInt(req.query.id, 10);
        const result =
            await prisma.modules.findMany({
                orderBy: { order_no: 'asc' },
                select: {
                    module_id: true,
                    module_name: true,
                    icon: true,
                    order_no: true,
                    screens: {
                        orderBy: { order_no: 'asc' },
                        select:
                        {
                            screen_id: true,
                            screen_name: true,
                            route_url: true,
                            icon:true,
                            order_no: true,
                            role_permissions:
                            { 
                                where: { dept_role_id: id },
                                select:{
                                    can_create:true,
                                    can_delete:true,
                                    can_edit:true,
                                    can_view:true
                                },
                            }
                        }
                    }
                }

            })

            // Format the data 
            const menu = result.map(mod => {
                return {
                    moduleId: mod.module_id,
                    menuName: mod.module_name,
                    icon: mod.icon,
                    orderNo: mod.order_no,
                    children: mod.screens.filter(screen => screen.role_permissions.length > 0).map(screen => {
                        const rolePermissions = screen.role_permissions[0];
                        return {
                            menuId: screen.screen_id,
                            menuName: screen.screen_name,
                            icon: screen.icon,
                            route: screen.route_url,
                            orderNo: screen.order_no,
                            canCreate: rolePermissions.can_create,
                            canDelete:rolePermissions.can_delete,
                            canEdit:rolePermissions.can_edit,
                            canView:rolePermissions.can_view
                        };
                    })
                };
            });
      
            res.json(menu);
    } catch (err) {
        res.status(500).send(err.message);
    }
}; 

 
exports.getRolePermissions = async (req, res) => {
    try {  
        const deptRoleId = parseInt(req.query.id, 10);
 
        if (isNaN(deptRoleId)) {
            return res.status(400).send('Invalid Id. It must be a number.');
        } 
        const modules = await prisma.modules.findMany({
            include: {
                screens: true, 
            },
        }); 
        const rolePermissions = await prisma.role_permissions.findMany({
            where: { dept_role_id: deptRoleId },
            select: {
                screen_id: true,
                can_create: true,
                can_edit: true,
                can_view: true,
                can_delete: true,
            },
        });
 
        const result = modules.map((module) => ({
            module_id: module.module_id,
            module_name: module.module_name,
            screens: module.screens.map((screen) => {
                const permission = rolePermissions.find(
                    (rp) => rp.screen_id === screen.screen_id
                );

                return {
                    screen_id: screen.screen_id,
                    screen_name: screen.screen_name,
                    can_create: permission ? permission.can_create : false,
                    can_edit: permission ? permission.can_edit : false,
                    can_view: permission ? permission.can_view : false,
                    can_delete: permission ? permission.can_delete : false,
                };
            }),
        }));

        res.json(result);
    } catch (err) { 
        res.status(500).send('Internal Server Error');
    }
};
