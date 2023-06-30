import useSWRV, { IConfig } from 'swrv'
import { AxiosResponse, AxiosError } from 'axios'
import { IKey, fetcherFn } from 'swrv/dist/types'
import { computed } from 'vue'

export default function useRequest<Data = unknown, Error = { message: string }> (key: IKey, fn?: fetcherFn<AxiosResponse<Data>>, config?: IConfig) {
  const { data: response, error, isValidating, mutate: revalidate } = useSWRV<
  AxiosResponse<Data>,
  AxiosError<Error>
  >(key, fn, {
    errorRetryInterval: 2000,
    revalidateDebounce: 10500,
    revalidateOnFocus: false,
    dedupingInterval: 100000,
    shouldRetryOnError: false,
    ...config
  })

  const data = computed<Data>(() => {
    return response.value?.data
  })

  return {
    data,
    response,
    error,
    isValidating,
    revalidate
  }
}
