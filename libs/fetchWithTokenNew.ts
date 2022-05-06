import fetch from 'isomorphic-unfetch'

const fetchWithToken = async (
  url: string,
  method: string = 'GET',
  token: string
): Promise<JSON> => {
  //TODO: get rid of the need for this on every call
  console.log('token: ', token)

  const tokens =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdWkiOiJhc2Rmc2Rmb2lpeXV0aXV5dGxrbiIsImNsYXNzaWZpY2F0aW9uIjpudWxsLCJsb2dvdXRFbnRyeSI6eyJfaWQiOiI2MTI1NmRmNTM1ZWM1YzI2Y2ZlNDVlYjMiLCJleHAiOjE2Mjk4NDI5MzMsIm5hbWUiOiJuaW1idXMifSwiaWF0IjoxNjI5ODUwMzA1LCJuYmYiOjE2Mjk4NTAzMDUsImV4cCI6MTYyOTg1MzkwNX0.g444_EcIT0FaVAkoBLasTO9TuzOM6w6o_3TqSFU1GkM'

  const res = await fetch(url, {
    method,
    headers: new Headers({
      Authorization: `Bearer ${tokens}`,
      'Content-Type': 'application/json',
    }),
  })
  return res.json()
}

export default fetchWithToken
