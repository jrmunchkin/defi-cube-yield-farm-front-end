import { useMoralis } from "react-moralis";
import { constants } from "ethers";
import networkMapping from "../constants/chain-info/deployments/map.json";
import brownieConfig from "../constants/brownie-config.json";
import helperConfig from "../helper-config.json";
import cubeTokenAbi from "../constants/chain-info/contracts/CubeToken.json";
import wethTokenAbi from "../constants/chain-info/contracts/MockWETH.json";
import daiTokenAbi from "../constants/chain-info/contracts/MockDAI.json";
import linkTokenAbi from "../constants/chain-info/contracts/MockLINK.json";
import StakeBox from "./stake-box/StakeBox";
import RewardsBox from "./rewards-box/RewardsBox";

export default function Main() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);

  if (!isWeb3Enabled) {
    return (
      <div className="flex items-center flex-col">
        <h1 className="text-white text-2xl p-4">Please connect your wallet!</h1>
      </div>
    );
  }

  if (!chainId || !networkMapping[chainId]) {
    return (
      <div className="flex items-center flex-col">
        <h1 className="text-white text-2xl p-4">Please use Goerli network!</h1>
      </div>
    );
  }

  const networkName = chainId ? helperConfig[chainId] : "dev";
  const cubeFarmAddress = chainId
    ? networkMapping[chainId]["CubeFarm"][0]
    : constants.AddressZero;
  const cubeTokenAddress = chainId
    ? networkMapping[chainId]["CubeToken"][0]
    : constants.AddressZero;
  const wethTokenAddress = chainId
    ? brownieConfig["networks"][networkName]["weth_token"]
    : constants.AddressZero;
  const daiTokenAddress = chainId
    ? brownieConfig["networks"][networkName]["fau_token"]
    : constants.AddressZero;
  const linkTokenAddress = chainId
    ? brownieConfig["networks"][networkName]["link_token"]
    : constants.AddressZero;

  const supportedTokens = [
    {
      address: cubeTokenAddress,
      abi: cubeTokenAbi.abi,
      name: "CUBE",
      image: "/images/cube.png",
    },
    {
      address: wethTokenAddress,
      abi: wethTokenAbi.abi,
      name: "WETH",
      image: "/images/eth.png",
    },
    {
      address: daiTokenAddress,
      abi: daiTokenAbi.abi,
      name: "DAI",
      image: "/images/dai.png",
    },
    {
      address: linkTokenAddress,
      abi: linkTokenAbi.abi,
      name: "LINK",
      image: "/images/link.png",
    },
  ];

  return (
    <div>
      <RewardsBox cubeFarmAddress={cubeFarmAddress} />
      <StakeBox
        supportedTokens={supportedTokens}
        cubeFarmAddress={cubeFarmAddress}
      />
    </div>
  );
}
