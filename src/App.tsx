import React, { useCallback } from "react";
import "./App.css";

import { modal } from "./wagmiConfig";

import {
  useAccount,
  useDisconnect,
  useConnect,
  useSignMessage,
  useSignTypedData,
  useSendTransaction,
  useEstimateGas,
} from "wagmi";
import { parseEther, type Address } from "viem";

function App() {
  const account = useAccount();
  const { status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessage } = useSignMessage();
  const { signTypedData } = useSignTypedData();
  const { sendTransaction } = useSendTransaction();

  async function handleConnect() {
    try {
      modal.open();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDisconnect() {
    try {
      disconnect();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSignMessage() {
    const data = "hello world!";
    signMessage({ message: data });
  }
  async function handleSignTypedData() {
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
      chainId: 1001,
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
    signTypedData(data);
  }

  const sendTransactionData = {
    to: process.env.REACT_APP_TEST_ACCOUNT as Address,
    value: parseEther("0.001"),
  };
  const { data: gas, error: prepareError } =
    useEstimateGas(sendTransactionData);
  const handleSendTransaction = useCallback(() => {
    if (prepareError) {
      console.error(prepareError);
    } else {
      sendTransaction({ ...sendTransactionData, gas });
    }
  }, [sendTransaction, prepareError]);

  return (
    <div className="App" style={{ textAlign: "center", padding: "0 2rem" }}>
      <h1>Wallet Connect v4.0 Sample</h1>
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
      </div>
    </div>
  );
}

export default App;
