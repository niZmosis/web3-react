import type { Web3ReactHooks } from '@web3-react/core'
import type { Connector } from '@web3-react/types'
import type { StaticImageData } from 'next/image'
import type { ReactNode } from 'react'

import { isReadOnlyConnector } from '../../utils/connectors'
import AccountsView from './displayViews/AccountsView'
import BlockNumberView from './displayViews/BlockNumberView'
import ChainView from './displayViews/ChainView'
import ConnectorTitleView from './displayViews/ConnectorTitleView'
import ConnectWithSelectView from './displayViews/ConnectWithSelectView'
import NetworkView from './displayViews/NetworkView'
import SelectionView from './displayViews/SelectionView'
import SpacerView from './displayViews/SpacerView'
import StatusView from './displayViews/StatusView'
import WatchAssetView from './displayViews/WatchAssetView'

interface Props {
  connector: Connector
  chainId: ReturnType<Web3ReactHooks['useChainId']>
  accountIndex?: ReturnType<Web3ReactHooks['useAccountIndex']>
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>
  isActive: ReturnType<Web3ReactHooks['useIsActive']>
  error: Error | undefined
  setError: (error: Error | undefined) => void
  ENSNames?: ReturnType<Web3ReactHooks['useENSNames']>
  ENSAvatars?: ReturnType<Web3ReactHooks['useENSAvatars']>
  provider?: ReturnType<Web3ReactHooks['useProvider']>
  addingChain?: ReturnType<Web3ReactHooks['useAddingChain']>
  switchingChain?: ReturnType<Web3ReactHooks['useSwitchingChain']>
  watchingAsset?: ReturnType<Web3ReactHooks['useWatchingAsset']>
  accounts?: string[]
  walletLogoUrl?: string | StaticImageData
  hide?: boolean
  children?: ReactNode
}

export function Card({
  connector,
  chainId,
  accountIndex,
  isActivating,
  isActive,
  error,
  setError,
  ENSNames,
  ENSAvatars,
  provider,
  accounts,
  addingChain,
  switchingChain,
  watchingAsset,
  walletLogoUrl,
  hide,
  children,
}: Props) {
  const isReadOnly = accounts?.length ? isReadOnlyConnector(connector, accounts[accountIndex ?? 0]) : false

  return (
    <div
      style={{
        display: hide ? 'none' : 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        margin: '1rem',
        paddingTop: '1rem',
        paddingBottom: '1rem',
        overflow: 'hidden',
        border: '1px solid',
        borderRadius: '1rem',
        borderColor: '#30363d',
        backgroundColor: 'rgb(14,16,22)',
        boxSizing: 'border-box',
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
        <ConnectorTitleView connector={connector} walletLogoUrl={walletLogoUrl} />
        <StatusView
          connector={connector}
          accounts={accounts}
          accountIndex={accountIndex}
          isActivating={isActivating}
          isActive={isActive}
          error={error}
          isReadOnly={isReadOnly}
        />
        <SelectionView connector={connector} />
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
        <ConnectWithSelectView
          connector={connector}
          chainId={chainId}
          isActivating={isActivating}
          isActive={isActive}
          error={error}
          setError={setError}
          addingChain={addingChain}
          switchingChain={switchingChain}
        />
        {isActive && (
          <WatchAssetView
            connector={connector}
            chainId={chainId}
            watchingAsset={watchingAsset}
            isReadOnly={isReadOnly}
          />
        )}
        {children && (
          <>
            <SpacerView />
            {children}
          </>
        )}
      </div>
    </div>
  )
}
