import { useWeb3React } from '@web3-react/core'

import { network } from '../../../config/connectors/network'
import { getName, isReadOnlyConnector } from '../../../utils/connectors'
import Button from '../../controls/Button'
import AccountsView from '../displayViews/AccountsView'
import BlockNumberView from '../displayViews/BlockNumberView'
import ChainView from '../displayViews/ChainView'
import NetworkView from '../displayViews/NetworkView'
import SignerButton from '../displayViews/SignerButton'
import SpacerView from '../displayViews/SpacerView'
import StatusView from '../displayViews/StatusView'
import LatestTransactionView from '../displayViews/TransactionCountButton'

export default function SelectedConnectorCard({ hide }: { hide: boolean }) {
  const {
    connector,
    chainId,
    accountIndex,
    accounts,
    ENSNames,
    ENSAvatars,
    provider,
    isActivating,
    isActive,
    setSelectedConnector,
    addingChain,
    switchingChain,
    hooks: { usePriorityConnector },
  } = useWeb3React()

  const isReadOnly = accounts?.length ? isReadOnlyConnector(connector, accounts[accountIndex ?? 0]) : false

  const account = (accounts?.[accountIndex] as string) ?? undefined
  const priorityConnector = usePriorityConnector()
  const isPriority = priorityConnector === connector
  const priorityConnectorName = getName(priorityConnector)

  return (
    <div
      style={{
        display: hide ? 'none' : 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        margin: '1rem',
        paddingTop: '1rem',
        paddingBottom: '1rem',
        overflow: 'auto',
        border: '2px solid',
        borderRadius: '1rem',
        borderColor: 'rgba(168, 56, 253, 0.4)',
        backgroundColor: 'rgba(168, 56, 253, 0.15)',
      }}
    >
      <div
        style={{
          width: '100%',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          boxSizing: 'border-box',
          display: hide ? 'none' : 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <b>{`${getName(connector)} (Selected)`}</b>
        <StatusView
          connector={connector}
          accounts={accounts}
          accountIndex={accountIndex}
          isActivating={isActivating}
          isActive={isActive}
          isReadOnly={isReadOnly}
        />
        <NetworkView chainId={chainId} addingChain={addingChain} switchingChain={switchingChain} />
        <ChainView connector={connector} chainId={chainId} addingChain={addingChain} switchingChain={switchingChain} />
        <BlockNumberView connector={connector} provider={provider} chainId={chainId} />
      </div>
      <AccountsView
        connector={connector}
        provider={provider}
        accountIndex={accountIndex}
        accounts={accounts}
        chainId={chainId}
        ENSNames={ENSNames}
        ENSAvatars={ENSAvatars}
        showOnlySelected={false}
      />
      <div
        style={{
          width: '100%',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          boxSizing: 'border-box',
          display: hide ? 'none' : 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        {isActive && connector !== network && (
          <SignerButton connector={connector} provider={provider} account={account} disabled={isReadOnly} />
        )}
        <LatestTransactionView provider={provider} account={account} />
        <SpacerView />
        <Button style={{ marginBottom: '16px' }} onClick={() => setSelectedConnector()} disabled={isPriority}>
          {`Reset to Priority (${priorityConnectorName})`}
        </Button>
      </div>
    </div>
  )
}
