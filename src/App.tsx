import React from "react";
import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { WagmiProvider } from "wagmi";
import {
  createConfig,
  http,
  useConnect,
  useAccount,
  useDisconnect,
  useEnsName,
  useEnsAvatar,
} from "wagmi";
import { klaytnBaobab } from "wagmi/chains";
import { walletConnect, injected } from "wagmi/connectors";

const projectId = process.env.REACT_APP_PROJECT_ID as string | "";
const walletId = process.env.REACT_APP_WALLET_ID as string | "";

const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const config = createConfig({
  chains: [klaytnBaobab],
  transports: {
    [klaytnBaobab.id]: http(),
  },
  connectors: [
    walletConnect({
      projectId,
      metadata,
      showQrModal: false,
      qrModalOptions: {
        explorerRecommendedWalletIds: [walletId],
      },
    }),
    injected({ shimDisconnect: true }),
  ],
});

const modal = createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  includeWalletIds: [walletId],
});

modal.subscribeEvents((event) => {
  console.log(event);
});

/*  */

/*  */

const App = () => {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <w3m-connect-button></w3m-connect-button>
        <w3m-network-button></w3m-network-button>
        <w3m-account-button></w3m-account-button>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
export default App;
