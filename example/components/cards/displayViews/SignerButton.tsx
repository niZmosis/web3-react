import type { Web3Provider } from '@ethersproject/providers'
import type { Connector } from '@web3-react/types'

import { useTimeout } from '../../../hooks/hooks'
import { useSignMessage } from '../../../hooks/web3Hooks'
import Button from '../../controls/Button'
import SpacerView from './SpacerView'

export default function SignerButton({
  connector,
  provider,
  account,
  disabled
}: {
  connector?: Connector
  provider?: Web3Provider
  account?: string
  disabled?: boolean
}) {
  const { start, isTimedOut } = useTimeout({
    startOnMount: false,
    timeout: 1_000
  })

  const { signMessage, isLoading } = useSignMessage({
    connector,
    provider,
    account,
    onSigned: start
  })

  return (
    <>
      <SpacerView />
      <b style={{ marginBottom: '1rem' }}>Write</b>
      <Button disabled={isLoading || isTimedOut || disabled} onClick={() => void signMessage()}>
        {isLoading ? 'Pending Signature...' : isTimedOut ? 'Message Signed!' : 'Sign Message'}
      </Button>
    </>
  )
}
