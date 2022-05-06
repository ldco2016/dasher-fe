import useSWR from 'swr'
import fetchWithToken from 'libs/fetchWithToken'
import { useAppContext } from 'context'

function useSWRWithToken(endpoint: any, dependency: Boolean = true) {
  const { state } = useAppContext()
  const {
    token: { accessToken },
  } = state

  const { data, error, mutate } = useSWR<any>(
    // Make sure there is an accessToken and null does not appear in the uri
    accessToken && endpoint.indexOf(null) === -1 && dependency
      ? endpoint
      : null,

    (url: string, params: object = null) =>
      fetchWithToken(url, accessToken, params)
  )

  return {
    data,
    isLoading: !error && !data,
    error,
    mutate,
  }
}

export default useSWRWithToken
