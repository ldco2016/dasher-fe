import useSWR from 'swr'
import fetchWithToken from '../libs/fetchWithToken'
import env from '@beam-australia/react-env'

// Getting this specific with hooks is probably not necessary yet
function useClinics() {
  const { data, error } = useSWR<any>(
    `${env('PUBLIC_ALUNA_API')}/organizations`,
    fetchWithToken
  )

  return {
    clinics: data?.reverse(),
    isLoading: !error && !data,
    isError: error,
  }
}

export default useClinics
