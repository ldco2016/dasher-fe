import jwt from 'next-auth/jwt'
import env from '@beam-australia/react-env'
const secret = env('secret')

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret, raw: true })
  if (token) {
    // Signed in
    //res.status(200).json(JSON.stringify(token.accessToken, null, 2))

    res.status(200).json(JSON.parse(atob(token.split('.')[1])))
  } else {
    // Not Signed in
    res.status(401)
  }
  res.end()
}
