import axios from 'axios'
import AlunaLogger from '../libs/AlunaLogger'
import env from '@beam-australia/react-env'

const fetchWithToken = (url: string, token: string, params: object = null) => {
  const logger = AlunaLogger('fetchWithToken')

  // let data = new FormData()

  return axios({
    baseURL: `${env('PUBLIC_ALUNA_API')}/`,
    method: 'GET',
    url,
    params,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.data)
    .catch((error) => {
      console.log(error.response.data)

      logger.error('fetch !res.ok', error.response.data)
      throw error.response
    })
}

export default fetchWithToken
