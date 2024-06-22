import React from "react";
import { mainnet, goerli } from "@starknet-react/chains";
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
  blastProvider,
  jsonRpcProvider,
} from "@starknet-react/core";

interface IStarknetNetworkProps {
  children: any;
}
const StarknetProvider = ({ children }: IStarknetNetworkProps) => {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [argent(), braavos()],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "onlyIfNoConnectors",
    // Randomize the order of the connectors.
    order: "random",
  });
  return (
    <StarknetConfig
      connectors={connectors}
      autoConnect
      chains={[mainnet]}
      provider={jsonRpcProvider({
        rpc: () => ({
          nodeUrl:
            "https://starknet-mainnet.core.chainstack.com/9f0d58d1b789fb58ae2145e8afa8ddb5",
        }),
      })}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
};

export default StarknetProvider;
