import { useWeb3Contract, useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { formatUnits } from "@ethersproject/units";
import { useBetween } from "use-between";
import { useStakeTokens } from "../../hooks/useStakeTokens";
import BalanceBox from "./BalanceBox";

export default function UnstakedBalance({ token }) {
  const { isUnstakingBalanceUpdate, setIsUnstakingBalanceUpdate } =
    useBetween(useStakeTokens);
  const { isWeb3Enabled, account } = useMoralis();
  const { address: tokenAddress, abi: tokenAbi, image: tokenImage } = token;
  const [balance, setBalance] = useState("0");

  const { runContractFunction: balanceOf } = useWeb3Contract({
    abi: tokenAbi,
    contractAddress: tokenAddress,
    functionName: "balanceOf",
    params: {
      account: account,
    },
  });

  async function updateUI() {
    const balanceFromCall = (await balanceOf()).toString();
    const formattedTokenBalance = balanceFromCall
      ? Math.round(
          (parseFloat(formatUnits(balanceFromCall, 18)) + Number.EPSILON) * 1e5
        ) / 1e5
      : 0;
    setBalance(formattedTokenBalance);
  }

  useEffect(() => {
    if (isWeb3Enabled || isUnstakingBalanceUpdate) {
      setIsUnstakingBalanceUpdate(false);
      updateUI();
    }
  }, [isWeb3Enabled, token, account, isUnstakingBalanceUpdate]);

  return (
    <BalanceBox label={`Unstaked`} amount={balance} tokenImgSrc={tokenImage} />
  );
}
