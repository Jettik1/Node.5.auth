const jwt = require('jsonwebtoken')
const {secretKey} = require('../config')


module.exports = function (roles) { // передаем роли которые нужны для доступа
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
    
        try {
            const token = req.headers.authorization.split(' ')[1] // делим токен по пробелу и получаем только его тип, 2ую часть под индексом 1
            if (!token) {
                return res.status(403).json({message: "Пользователь не авторизован"})
            }
            const {roles: userRoles} = jwt.verify(token, secretKey) // получаем из токена массив ролей и определяем их как userRoles
            let hasRole = false
            userRoles.forEach(role => { // итерируемся по ролям пользователя
                if (roles.includes(role)) { // проверяем имеет ли он хотя бы 1 роль, которая нужна для запроса 
                    hasRole = true
                }
            })
            if (!hasRole) {
                return res.status(403).json({message: "You dont have premission "})
            }
            next()
        } catch (e) {
            console.log(e)
            return res.status(403).json({message: "Пользователь не авторизован"})
        }
    }
} 