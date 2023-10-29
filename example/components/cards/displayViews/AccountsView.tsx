import { formatUnits } from '@ethersproject/units'
import type { Web3ReactHooks } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import type { Connector } from '@web3-react/types'
import Image from 'next/image'

import { useBalances } from '../../../hooks/web3Hooks'
import { CHAINS } from '../../../utils/chains'
import { isEip2255Connector } from '../../../utils/connectors'
import CircleLoader from '../../feedback/CircleLoader'
import AddressEllipsis from './AddressEllipsis'
import Blockies from './Blockies'
import SpacerView from './SpacerView'

function setAccountIndex(connector: Connector, index: number) {
  connector.setAccountIndex(index)
}

type ColorOptions = {
  backgroundColor: string
  outlineColor: string
}

const grayColors: ColorOptions = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  outlineColor: 'transparent'
}
const greenColors: ColorOptions = {
  backgroundColor: 'rgba(56, 253, 72, 0.15)',
  outlineColor: 'rgba(56, 253, 72, 0.4)'
}
const orangeColors: ColorOptions = {
  backgroundColor: 'rgba(160, 80, 0, 0.15)',
  outlineColor: 'rgb(160, 80, 21)'
}

function getSelectionColorAndOutline({
  index,
  accounts,
  accountIndex,
  connector
}: {
  index: number
  accounts: string[]
  accountIndex: number
  connector: Connector
}): ColorOptions {
  // Default to gray if accounts are undefined or empty
  if (!accounts?.length) {
    return grayColors
  }

  const selectedAccount = accounts[accountIndex]
  const currentAccount = accounts[index]

  // Return gray if either selected or current accounts are undefined
  if (!selectedAccount || !currentAccount) {
    return grayColors
  }

  // Handle case for MetaMask connector
  if (isEip2255Connector(connector) && connector instanceof MetaMask) {
    // If the index matches the selected account index
    if (accountIndex === index) {
      // If the MetaMask's selected address does not match the current account, use orange
      if (connector.provider.selectedAddress.toLowerCase() !== currentAccount.toLowerCase()) {
        return orangeColors
      }
      // Otherwise, use green
      return greenColors
    }
    // If MetaMask's selected address matches the current account, use green
    else if (connector.provider.selectedAddress.toLowerCase() === currentAccount.toLowerCase()) {
      return greenColors
    }
  }
  // If the index matches the selected account index but it's not a MetaMask connector, use green
  else if (accountIndex === index) {
    return greenColors
  }

  // Default to gray
  return grayColors
}

export default function AccountsView({
  connector,
  provider,
  accountIndex,
  accounts,
  chainId,
  ENSNames,
  ENSAvatars,
  showOnlySelected
}: {
  connector: Connector
  provider?: ReturnType<Web3ReactHooks['useProvider']>
  accountIndex: ReturnType<Web3ReactHooks['useAccountIndex']>
  accounts: ReturnType<Web3ReactHooks['useAccounts']>
  chainId: ReturnType<Web3ReactHooks['useChainId']>
  ENSNames: ReturnType<Web3ReactHooks['useENSNames']>
  ENSAvatars: ReturnType<Web3ReactHooks['useENSAvatars']>
  showOnlySelected?: boolean
}) {
  const { balances, isLoading } = useBalances(connector, provider, chainId, accounts, false)

  if (accounts === undefined) return null

  const accountData = accounts
    .map((address, index) => ({
      account: address,
      ensName: ENSNames?.[index] ?? '',
      ensAvatar: ENSAvatars?.[index] ?? '',
      balance: balances?.[index] ?? '0'
    }))
    .slice(showOnlySelected ? accountIndex : 0, showOnlySelected ? Number(accountIndex) + 1 : accounts.length)

  return (
    !!accountData?.length && (
      <>
        <SpacerView style={{ marginLeft: '16px', width: `calc(100% - 32px)` }} />
        <div
          style={{
            maxHeight: '394px',
            overflowY: 'auto',
            padding: '0 16px',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center'
            }}
          >
            {accountData.map((accountInfo, index) => {
              const { account, ensName, ensAvatar, balance } = accountInfo ?? {}

              if (!account) return null

              const { backgroundColor, outlineColor } = getSelectionColorAndOutline({
                index,
                accounts,
                accountIndex,
                connector
              })

              return (
                <div
                  key={account}
                  style={{
                    overflow: 'hidden',
                    width: `calc(100% - 24px)`,
                    maxWidth: '100%',
                    backgroundColor,
                    borderRadius: '14px',
                    minHeight: '44px',
                    outline: '2px solid',
                    outlineColor,
                    marginTop: index !== 0 ? 16 : 2,
                    marginBottom: index !== accountData.length - 1 ? 0 : 2,
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    alignItems: 'flex-start',
                    cursor: 'pointer'
                  }}
                  onClick={() => setAccountIndex(connector, index)}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      overflow: 'hidden',
                      maxWidth: '100%',
                      marginBottom: '0.5em'
                    }}
                  >
                    {ensAvatar ? (
                      <Image
                        alt="ENS Avatar"
                        src={ensAvatar}
                        width={24}
                        height={24}
                        style={{
                          marginRight: '8px',
                          borderRadius: '50%',
                          overflow: 'hidden'
                        }}
                      />
                    ) : (
                      <Blockies diameter={24} account={account} alt={account} />
                    )}
                    <AddressEllipsis connector={connector} account={account} ensName={ensName} />
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center'
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.8em',
                        marginRight: '0.5em'
                      }}
                    >
                      Ξ
                    </p>
                    {isLoading ? (
                      <CircleLoader />
                    ) : !!balance && !!chainId ? (
                      <p style={{ margin: 0, fontSize: '0.8em' }}>
                        {` ${new Intl.NumberFormat(undefined).format(
                          Number(formatUnits(balance, CHAINS[chainId].nativeCurrency.decimals))
                        )}
                    `}
                      </p>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </>
    )
  )
}
