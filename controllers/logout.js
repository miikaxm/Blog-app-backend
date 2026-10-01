const router = require('express').Router()
const Session = require('../models/session')
const { tokenExtractor } = require('../middleware/tokenExtractor')

router.delete('/', tokenExtractor, async (req, res) => {
  await Session.destroy({
    where: {
      id: req.decodedToken.sessionId
    }
  })

  res.status(204).end()
})

module.exports = router