const Router = require('express')
const controller = require('./authController')
const {check} = require('express-validator')
const authMiddleware = require('./midlewaree/authMiddleware')
const roleMiddleware = require('./midlewaree/roleMiddleware')

const router = new Router(); 

router.post('/registration', [
    check('username', "the user name cannot be empty").notEmpty(),
    check('password', "The password cannot be empty and have less than 4 characters").notEmpty().isLength({min:4, max:20})
], controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers) // доступ к контроллеру по роли ADMIN

module.exports = router;