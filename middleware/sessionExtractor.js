const Session = require('../models/session')
const User = require('../models/user')

const sessionExtractor = async (req, res, next) => {
  const session = await Session.findOne({
    where: {
      id: req.decodedToken.sessionId,
    },
  })

  if (!session) {
    return res.status(401).json({
      error: 'session expired',
    })
  }

  const user = await User.findByPk(session.user_id)

  if (!user) {
    return res.status(401).json({
      error: 'user not found',
    })
  }

  if (user.disabled) {
    return res.status(401).json({
      error: 'user disabled',
    })
  }

  req.user = user

  next()
}

module.exports = {
  sessionExtractor,
}