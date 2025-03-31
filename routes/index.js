const express = require('express')
const homer = require('./home')
const router = express.Router()

router.use('/', homer)


module.exports = router