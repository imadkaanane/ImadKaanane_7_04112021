const rateLimit = require('express-rate-limit')

module.exports = rateLimit({
    expire  : 1 * 60 * 1000, // 1 min
    total: 10 // 10 rates/1minute
})

