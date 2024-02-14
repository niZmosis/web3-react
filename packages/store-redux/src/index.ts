import { getAddress } from '@ethersproject/address'
import type { PayloadAction } from '@reduxjs/toolkit'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import type { Actions, Web3ReactReduxStore, Web3ReactState, Web3ReactStateUpdate } from '@web3-react/types'

/**
 * MAX_SAFE_CHAIN_ID is the upper bound limit on what will be accepted for `chainId`
 * `MAX_SAFE_CHAIN_ID = floor( ( 2**53 - 39 ) / 2 ) = 4503599627370476`
 *
 * @see {@link https://github.com/MetaMask/metamask-extension/blob/b6673731e2367e119a5fee9a454dd40bd4968948/shared/constants/network.js#L31}
 */
export const MAX_SAFE_CHAIN_ID = 4503599627370476

export function validateChainId(chainId: number): void {
  if (!Number.isInteger(chainId) || chainId <= 0 || chainId > MAX_SAFE_CHAIN_ID) {
    throw new Error(`Invalid chainId ${chainId}`)
  }
}

function normalizeAccountData(account: string | { address: string }): string {
  // If the account is an object and has an 'address' property, return that.
  if (typeof account === 'object' && account !== null && 'address' in account) {
    return account.address
  }
  // Otherwise, return the account as it is (assuming it's a string).
  return account
}

export function validateAccount(account: string): string {
  return getAddress(normalizeAccountData(account))
}

const DEFAULT_STATE: Web3ReactState = {
  chainId: undefined,
  accounts: undefined,
  accountIndex: undefined,
  activating: false,
  addingChain: undefined,
  switchingChain: undefined,
  watchingAsset: undefined,
}

export function createWeb3ReactStoreAndActions(connectorName?: string): [Web3ReactReduxStore, Actions] {
  const web3ReactSlice = createSlice({
    name: connectorName ?? 'Web3React',
    initialState: DEFAULT_STATE,
    reducers: {
      update: (
        existingState: Web3ReactState,
        action: PayloadAction<Web3ReactStateUpdate & { skipValidation?: boolean }>
      ) => {
        const stateUpdate = { ...action.payload }

        // validate chainId statically, independent of existing state
        if (stateUpdate.chainId !== undefined && !stateUpdate.skipValidation) {
          validateChainId(stateUpdate.chainId)
        }

        // validate accounts statically, independent of existing state
        if (!!stateUpdate?.accounts?.length && !stateUpdate.skipValidation) {
          stateUpdate.accounts = stateUpdate.accounts.map((account) => validateAccount(account))
        }

        // determine the next chainId and accounts
        const chainId = stateUpdate.chainId ?? existingState.chainId
        const newAccounts = stateUpdate.accounts ?? existingState.accounts

        let accountIndex = existingState.accountIndex
        const existingAccounts = existingState.accounts

        // Used to determine if a prop was explicity set to undefined or just missing from the update
        const stateUpdatePropertyNames = Object.getOwnPropertyNames(stateUpdate)
        const isUpdatingAccountIndex = stateUpdatePropertyNames.includes('accountIndex')

        if (isUpdatingAccountIndex) {
          // Explicitly set accountIndex is provided in the update
          const newIndex = stateUpdate.accountIndex
          const newAccountsLength = newAccounts?.length ?? 0

          accountIndex = newIndex !== undefined && newIndex < newAccountsLength ? newIndex : 0

          if (newAccountsLength === 0) {
            accountIndex = undefined
          }
        } else if (newAccounts && existingAccounts) {
          // Get accountIndex based on account addition or removal

          const newAccountLength = newAccounts.length
          const existingAccountLength = existingAccounts.length

          if (newAccountLength > existingAccountLength) {
            if (existingAccountLength === 0) {
              // No existing accounts
              accountIndex = 0
            } else {
              // Account added
              accountIndex = newAccounts.indexOf(newAccounts[newAccountLength - 1])
            }
          } else if (newAccountLength < existingAccountLength) {
            // Account removed
            const removedAccount = existingAccounts.find((acc) => !newAccounts.includes(acc))

            if (removedAccount) {
              const removedIndex = existingAccounts.indexOf(removedAccount)
              const existingAccountIndex = existingState.accountIndex ?? 0

              if (removedIndex === existingState.accountIndex) {
                accountIndex = newAccountLength > 0 ? 0 : undefined
              } else if (removedIndex < existingAccountIndex) {
                accountIndex = Math.max(0, existingAccountIndex - 1)
              }
            }
          }
        } else if (newAccounts) {
          if (newAccounts.length > 0) {
            // No existing accounts
            accountIndex = 0
          } else {
            // No accounts
            accountIndex = undefined
          }
        } else {
          // No accounts
          accountIndex = undefined
        }

        // Ensure that the activating flag is cleared when appropriate
        let activating = stateUpdate.activating ?? existingState.activating
        if (activating && chainId && newAccounts) {
          activating = false
        }

        const addingChain = stateUpdatePropertyNames.includes('addingChain')
          ? stateUpdate.addingChain
          : existingState.addingChain
        const switchingChain = stateUpdatePropertyNames.includes('switchingChain')
          ? stateUpdate.switchingChain
          : existingState.switchingChain
        const watchingAsset = stateUpdatePropertyNames.includes('watchingAsset')
          ? stateUpdate.watchingAsset
          : existingState.watchingAsset

        existingState = {
          chainId,
          accountIndex,
          accounts: newAccounts,
          activating,
          addingChain,
          switchingChain,
          watchingAsset,
        }

        return existingState
      },

      resetState: (existingState: Web3ReactState) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        existingState = DEFAULT_STATE

        return existingState
      },
    },
  })

  const store = configureStore({
    reducer: web3ReactSlice.reducer,
    devTools: { name: connectorName },
  })

  const { update, resetState } = web3ReactSlice.actions

  const actions: Actions = {
    startActivation: (): (() => Web3ReactState) => {
      store.dispatch(update({ activating: true }))

      // return a function that cancels the activation if nothing else has happened
      return (): Web3ReactState => {
        store.dispatch(
          update({
            activating: false,
            addingChain: undefined,
            switchingChain: undefined,
          })
        )

        return store.getState()
      }
    },
    update: (stateUpdate: Web3ReactStateUpdate, skipValidation?: boolean) => {
      store.dispatch(update({ ...stateUpdate, skipValidation }))

      return store.getState()
    },
    resetState: () => {
      store.dispatch(resetState())
      return store.getState()
    },
    getState: () => store.getState(),
  }

  return [store, actions]
}
