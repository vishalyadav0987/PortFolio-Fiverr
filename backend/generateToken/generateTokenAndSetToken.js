const jwt = require('jsonwebtoken')

const generateAndSetToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })

  console.log(token);
  

  res.cookie('token', token, {
    httpOnly: true,
    secure: true, 
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  return token
}

module.exports = generateAndSetToken