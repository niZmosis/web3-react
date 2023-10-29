import { getImageUrlFromTrust } from '../../../utils/helpers'
import { plsMainChainId } from '../chainIds'
import { ChainConfig } from '../chains.interface'

const chainConfig: ChainConfig = {
  chainId: plsMainChainId,
  name: 'PulseChain',
  nativeCurrency: {
    name: 'Pulse',
    symbol: 'PLS',
    decimals: 18,
  },
  nativeWrappedToken: {
    address: '0xA1077a294dDE1B09bB078844df40758a5D0f9a27',
    decimals: 18,
    symbol: 'WPLS',
    name: 'Wrapped PLS',
  },
  rpcUrls: ['https://rpc.pulsechain.com'],
  walletConfig: {
    chainName: 'PulseChain',
    iconUrls: [getImageUrlFromTrust(plsMainChainId)],
    rpcUrls: ['https://rpc.pulsechain.com'],
    blockExplorerUrls: ['https://scan.pulsechain.com', 'https://otter.pulsechain.com/'],
  },
}

export default chainConfig
