import React from "react";
import "./App.css";

import { useCallback } from "react";

import {
  useAccount,
  useDisconnect,
  useConnect,
  useSignMessage,
  useSignTypedData,
  useSendTransaction,
  useEstimateGas,
  useSwitchChain,
} from "wagmi";
import {
  parseEther,
  type Address,
  recoverTypedDataAddress,
  Signature,
  SignTypedDataReturnType,
} from "viem";

import { modal } from "./wagmiConfig";

const testAccount = process.env.REACT_APP_TEST_ACCOUNT || "";

function App() {
  const account = useAccount();
  const { status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { signTypedDataAsync } = useSignTypedData();
  const { sendTransactionAsync } = useSendTransaction();

  const handleConnect = useCallback(async () => {
    try {
      modal.open();
    } catch (error) {
      console.error(`handleConnect: ${error}`);
    }
  }, [modal]);

  const handleDisconnect = useCallback(async () => {
    try {
      disconnect();
    } catch (error) {
      console.error(`handleDisconnect: ${error}`);
    }
  }, [disconnect]);

  const handleSignMessage = useCallback(async () => {
    try {
      const data = "hello world!";
      const response = await signMessageAsync({ message: data });
      console.info(`handleSignMessage: ${response}`);
    } catch (error) {
      console.error(`handleSignMessage: ${error}`);
    }
  }, [signMessageAsync]);

  const handleSignTypedData = useCallback(async () => {
    try {
      const types = {
        Person: [
          { name: "name", type: "string" },
          { name: "wallet", type: "address" },
        ],
        Mail: [
          { name: "from", type: "Person" },
          { name: "to", type: "Person" },
          { name: "contents", type: "string" },
        ],
      } as const;
      const message = {
        from: {
          name: "Cow",
          wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
        },
        to: {
          name: "Bob",
          wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
        },
        contents: "Hello, Bob!",
      } as const;
      const domain = {
        name: "Ether Mail",
        version: "1",
        chainId: 8217,
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      } as const;
      const data: {
        domain: typeof domain;
        message: typeof message;
        primaryType: "Mail";
        types: typeof types;
      } = {
        domain,
        message,
        primaryType: "Mail",
        types,
      };
      let signature: SignTypedDataReturnType | Signature =
        await signTypedDataAsync(data);
      console.info(`handleSignTypedData - signature: ${signature}`);
      const response = await recoverTypedDataAddress({ ...data, signature });
      console.info(`handleSignTypedData - signing address: ${account.address}`);
      console.info(`handleSignTypedData - recovered address: ${response}`);
      console.info(
        `handleSignTypedData - verified: ${
          (account.address as unknown as String) == (response as String)
        }`
      );
    } catch (error) {
      console.error(`handleSignTypedData: ${ErrorEvent}`);
    }
  }, [signTypedDataAsync, account]);

  const sendTransactionAsyncData = {
    to: testAccount as Address,
    value: parseEther("0.001"),
  };
  const { data: gas, error: prepareError } = useEstimateGas(
    sendTransactionAsyncData
  );
  const handleSendTransaction = useCallback(async () => {
    if (prepareError) {
      console.error(`useEstimateGas: ${prepareError}`);
    } else {
      try {
        const response = await sendTransactionAsync({
          ...sendTransactionAsyncData,
          gas,
        });
        console.info(`handleSendTransaction: ${response}`);
      } catch (error) {
        console.error(`handleSendTransaction: ${error}`);
      }
    }
  }, [sendTransactionAsync, prepareError, gas, sendTransactionAsyncData]);

  const { chains, switchChain } = useSwitchChain();

  return (
    <div className="App" style={{ textAlign: "center", padding: "0 2rem" }}>
      <h1>Wallet Connect Web3Modal v4.0 Sample</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <button
          className="button"
          onClick={handleConnect}
          disabled={account.status === "connected"}
        >
          Connect
        </button>
        <button
          className="button"
          onClick={handleDisconnect}
          disabled={account.status !== "connected"}
        >
          Disconnect
        </button>
        <button
          className="button"
          onClick={handleSignMessage}
          disabled={account.status !== "connected"}
        >
          Sign Message
        </button>
        <button
          className="button"
          onClick={handleSignTypedData}
          disabled={account.status !== "connected"}
        >
          Sign Typed Data
        </button>
        <button
          className="button"
          onClick={handleSendTransaction}
          disabled={account.status !== "connected"}
        >
          Send Transaction
        </button>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <span style={{ wordBreak: "break-all" }}>
            connect status: {status} {error?.message}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <span style={{ wordBreak: "break-all" }}>
            account status: {account.status}
          </span>
          {account.status === "connected" ? (
            <span style={{ wordBreak: "break-all" }}>
              account address: {account.addresses}
            </span>
          ) : null}
          {account.status === "connected" ? (
            <span style={{ wordBreak: "break-all" }}>
              account chainId: {account.chainId}
            </span>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            gap: "1rem",
          }}
        >
          {chains.map((chain) => (
            <button
              className="button"
              key={chain.id}
              onClick={() => switchChain({ chainId: chain.id })}
              disabled={account.status !== "connected"}
            >
              {chain.name}
            </button>
          ))}
        </div>
        {/* Web Components */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
            padding: "0.5rem 1rem",
            borderRadius: "20px",
          }}
        >
          <a
            href="https://docs.walletconnect.com/appkit/react/core/components#w3m-button-"
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <span
              style={{
                wordBreak: "break-all",
                color: "white",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              w3m-button:
            </span>
          </a>
          <w3m-button />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
            padding: "0.5rem 1rem",
            borderRadius: "20px",
          }}
        >
          <a
            href="https://docs.walletconnect.com/appkit/react/core/components#w3m-account-button-"
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <span
              style={{
                wordBreak: "break-all",
                color: "white",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              w3m-account-button:
            </span>
          </a>
          <w3m-account-button />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
            padding: "0.5rem 1rem",
            borderRadius: "20px",
          }}
        >
          <a
            href="https://docs.walletconnect.com/appkit/react/core/components#w3m-connect-button-"
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <span
              style={{
                wordBreak: "break-all",
                color: "white",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              w3m-connect-button:
            </span>
          </a>
          <w3m-connect-button />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
            padding: "0.5rem 1rem",
            borderRadius: "20px",
          }}
        >
          <a
            href="https://docs.walletconnect.com/appkit/react/core/components#w3m-connect-button-"
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <span
              style={{
                wordBreak: "break-all",
                color: "white",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              w3m-network-button:
            </span>
          </a>
          <w3m-network-button />
        </div>
      </div>
    </div>
  );
}

export default App;
