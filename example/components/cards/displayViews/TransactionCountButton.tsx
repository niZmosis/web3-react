import type { Web3Provider } from '@ethersproject/providers'
import { useEffect } from 'react'

import { useTimeout } from '../../../hooks/hooks'
import { useTransactionCount } from '../../../hooks/web3Hooks'
import Button from '../../controls/Button'
import SpacerView from './SpacerView'

export default function TransactionCountButton({
  provider,
  account,
  disabled,
}: {
  provider?: Web3Provider
  account?: string
  disabled?: boolean
}) {
  const { start, isTimedOut, reset } = useTimeout({
    startOnMount: false,
    timeout: 3_000,
  })

  const { transactionCount, isLoading, fetch } = useTransactionCount({ provider, account })

  const count = isTimedOut ? transactionCount : null

  useEffect(() => {
    if (!isLoading && transactionCount !== null) {
      start()
    }
  }, [isLoading, transactionCount, start])

  useEffect(() => {
    if (isTimedOut) {
      reset()
    }
  }, [isTimedOut, reset])

  return (
    <>
      <SpacerView />
      <b style={{ marginBottom: '1rem' }}>Read</b>
      <Button disabled={isLoading || isTimedOut || disabled} onClick={fetch}>
        {isLoading
          ? 'Fetching tx count...'
          : count
          ? `${count} - ${count === 1 ? 'Transaction' : 'Transactions'}`
          : 'TX Count'}
      </Button>
    </>
  )
}
