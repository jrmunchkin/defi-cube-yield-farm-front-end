import { useWeb3Contract, useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { formatUnits } from "@ethersproject/units";
import { useBetween } from "use-between";
import { useStakeTokens } from "../../hooks/useStakeTokens";
import cubeFarmAbi from "../../constants/chain-info/contracts/CubeFarm.json";
import BalanceBox from "./BalanceBox";

export default function StakedBalance({ token, cubeFarmAddress }) {
  const { isStakingBalanceUpdate, setIsStakingBalanceUpdate } =
    useBetween(useStakeTokens);
  const { isWeb3Enabled, account } = useMoralis();
  const { address: tokenAddress, image: tokenImage } = token;
  const [balance, setBalance] = useState("0");

  const { runContractFunction: getUserTokenBalance } = useWeb3Contract({
    abi: cubeFarmAbi.abi,
    contractAddress: cubeFarmAddress,
    functionName: "getUserTokenBalance",
    params: {
      _user: account,
      _token: tokenAddress,
    },
  });

  async function updateUI() {
    const balanceFromCall = (await getUserTokenBalance()).toString();
    const formattedTokenBalance = balanceFromCall
      ? Math.round(
          (parseFloat(formatUnits(balanceFromCall, 18)) + Number.EPSILON) * 1e5
        ) / 1e5
      : 0;
    setBalance(formattedTokenBalance);
  }

  useEffect(() => {
    if (isWeb3Enabled || isStakingBalanceUpdate) {
      setIsStakingBalanceUpdate(false);
      updateUI();
    }
  }, [isWeb3Enabled, token, account, isStakingBalanceUpdate]);

  return (
    <BalanceBox label={`Staked`} amount={balance} tokenImgSrc={tokenImage} />
  );
}
