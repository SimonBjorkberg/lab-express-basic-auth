const { Router } = require('express')
const router = new Router

const User = require('../models/User.model')

const bcrypt = require('bcryptjs')
const salt = 10

router.get('/signup', (req, res, next) => {
    res.render('./auth/sign-up')
})

module.exports = router;