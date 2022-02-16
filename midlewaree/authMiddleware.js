
const jwt = require('jsonwebtoken')
const {secretKey} = require('../config')

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1] // делим токен по пробелу и получаем только его тип, 2ую часть под индексом 1
        if (!token) {
            return res.status(403).json({message: "Пользователь не авторизован"})
        }
        const decodedData = jwt.verify(token, secretKey) // в этой переменной лежит объект с id и ролями пользователя , который мы создали в "../authControlles/payload"
        req.user = decodedData // Создаем новое поле user и помещаем туда данные 
        next()
    } catch (e) {
        console.log(e)
        return res.status(403).json({message: "Пользователь не авторизован"})
    }
};