const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken');
const {secretKey} = require('./config')


const generateAccessToken = (id, roles) => { // нужно чтобы спрятать внутрь токена эту информацию
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secretKey, {expiresIn: "24h"})
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({message: "error during registration", errors})
            }
            const {username, password} = req.body
            const candidate = await User.findOne({username})// находим юзера с введеным юзернеймом
            if (candidate) { // если такой пользователь существует возвращаем ошибку
                return res.status(400).json({message: "User exist"})
            }
            const hashPassword = bcrypt.hashSync(password, 7);// если пользователя нет - хешируем пароль
            const userRole = await Role.findOne({value: "USER"})// получаем роль
            const user = new User({username, password: hashPassword, roles: [userRole.value]}) // создаем пользователя с хешированым паролем и полученной ролью
            await user.save()// сохраняем пользователя в DB
            res.json('The user has been successfully  registered') // возвращаем ответ на клиент
        } catch (e) {
            console.log(e)
            res.status(400).json({message: "Registration error"})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if(!user) {
                return res.status(400).json({message: `User ${username} was not found`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if(!validPassword) {
                return res.status(400).json({message: "Wrong password"})
            }
            const token = generateAccessToken(user._id, user.roles)// _ - значит что id = constant , его генерирует mongoDB
            res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: "Login error"})
        }
    }

    async getUsers(req, res) {
        try {
            // const userRole = new Role(); // вместо энпоинта для создания изера
            // const adminRole = new Role({value: "ADMIN"})
            // await userRole.save()
            // await adminRole.save()
            // res.json(adminRole)
            const users = await User.find()
            res.json(users)
        } catch (e) {
            console.log(e)
        }
    }

}

module.exports = new authController();