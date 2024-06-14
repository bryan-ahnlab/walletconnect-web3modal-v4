import { createConfig, http } from "wagmi";
import { klaytn, mainnet, polygon } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

import { createWeb3Modal } from "@web3modal/wagmi/react";

const projectId = process.env.REACT_APP_PROJECT_ID || "";
const walletId = process.env.REACT_APP_WALLET_ID || "";

const metadata = {
  name: "ABC DApp",
  description: "Wallet Connect Web3Modal v4.0 Sample",
  url: "https://abc-dapp.com",
  icons: ["https://app.myabcwallet.com/v1/s3/image/icon/launcher.png"],
};

export const wagmiConfig = createConfig({
  chains: [mainnet, klaytn, polygon],
  transports: {
    [mainnet.id]: http(),
    [klaytn.id]: http(),
    [polygon.id]: http(),
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
