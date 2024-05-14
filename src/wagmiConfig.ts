import { createConfig, http } from "wagmi";
import { klaytn } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

import { createWeb3Modal } from "@web3modal/wagmi/react";

const projectId = process.env.REACT_APP_PROJECT_ID || "";
const walletId = process.env.REACT_APP_WALLET_ID || "";

const metadata = {
  name: "ABC DApp",
  description: "Wallet Connect Web3Modal v4.0 Sample",
  url: "https://abc-dapp.com",
  icons: [
    "https://explorer-api.walletconnect.com/v3/logo/lg/f9854c79-14ba-4987-42e1-4a82abbf5700?projectId=2f05ae7f1116030fde2d36508f472bfb",
  ],
};

export const wagmiConfig = createConfig({
  chains: [klaytn],
  transports: {
    [klaytn.id]: http(),
  },
  connectors: [
    walletConnect({
      projectId,
      metadata,
      showQrModal: false,
    }),
    injected({ shimDisconnect: true }),
  ],
});

export const modal = createWeb3Modal({
  wagmiConfig: wagmiConfig,
  projectId,
  includeWalletIds: [walletId],
});
