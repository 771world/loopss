import { MetamaskConnector, CoinbaseWalletConnector, BSC, BSCTestnet, Mainnet } from "@usedapp/core"

export const BASE_URL = "https://www.nashservers.com/loopss/"

export const CONTRACT_ADDRESS = "0xB1aC1c0f2E7E467f10Df232E82CC65e2CA4Cb0d2"

export const DAPP_CONFIG = {
  readOnlyChainId: BSC.chainId,
  readOnlyUrls: {
    [BSCTestnet.chainId]: process.env.REACT_APP_PROVIDER_TEST,
    [BSC.chainId]: process.env.REACT_APP_PROVIDER_MAINNET,
    [Mainnet.chainId]: "https://eth-mainnet.g.alchemy.com/v2/rbeUGLWOu1aehsuKbaNw_yhVKFXXdwbp",
  },
  metamask: new MetamaskConnector(),
  coinbase: new CoinbaseWalletConnector(),
}
