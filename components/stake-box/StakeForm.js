import { useWeb3Contract } from "react-moralis";
import { Input, Button, useNotification } from "web3uikit";
import { useState } from "react";
import { ethers } from "ethers";
import { useBetween } from "use-between";
import { useStakeTokens } from "../../hooks/useStakeTokens";
import cubeFarmAbi from "../../constants/chain-info/contracts/CubeFarm.json";

export default function StakeForm({ token, cubeFarmAddress }) {
  const { setIsStakingBalanceUpdate, setIsUnstakingBalanceUpdate } =
    useBetween(useStakeTokens);
  const { address: tokenAddress, abi: tokenAbi } = token;
  const [priceToHandleWith, setPriceToHandleWith] = useState(0);
  const [isApproveAndStake, setIsApproveAndStake] = useState(false);

  const dispatch = useNotification();

  const { runContractFunction: approve } = useWeb3Contract({
    abi: tokenAbi,
    contractAddress: tokenAddress,
    functionName: "approve",
    params: {
      spender: cubeFarmAddress,
      amount: ethers.utils.parseEther(priceToHandleWith || "0"),
    },
  });

  const {
    runContractFunction: stakeTokens,
    isLoading: isLoadingStake,
    isFetching: isFetchingStake,
  } = useWeb3Contract({
    abi: cubeFarmAbi.abi,
    contractAddress: cubeFarmAddress,
    functionName: "stakeTokens",
    params: {
      _amount: ethers.utils.parseEther(priceToHandleWith || "0"),
      _token: tokenAddress,
    },
  });

  const {
    runContractFunction: unstakeTokens,
    isLoading: isLoadingUnstake,
    isFetching: isFetchingUnstake,
  } = useWeb3Contract({
    abi: cubeFarmAbi.abi,
    contractAddress: cubeFarmAddress,
    functionName: "unstakeTokens",
    params: {
      _amount: ethers.utils.parseEther(priceToHandleWith || "0"),
      _token: tokenAddress,
    },
  });

  const handleApproveToken = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Your tokens have been approved, they will now be staked!",
      title: "Tokens approved!",
      position: "topR",
    });
    setIsApproveAndStake(false);
    await stakeTokens({
      onError: handleStakeTokensError,
      onSuccess: handleStakeTokensSuccess,
    });
  };

  const handleStakeTokensSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Your tokens have been staked!",
      title: "Tokens staked!",
      position: "topR",
    });
    setIsStakingBalanceUpdate(true);
    setIsUnstakingBalanceUpdate(true);
    setPriceToHandleWith(0);
  };

  const handleStakeTokensError = async (error) => {
    let message;
    if (error.code == 4001) message = "Your transaction have been canceled!";
    else
      message = "Check the amount is above 0 or your actual balance is enough!";
    dispatch({
      type: "error",
      message: message,
      title: "Error staking tokens!",
      position: "topR",
    });
    setPriceToHandleWith(0);
  };

  const handleUnstakeTokensSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Your tokens have been unstaked!",
      title: "Tokens unstaked!",
      position: "topR",
    });
    setIsStakingBalanceUpdate(true);
    setIsUnstakingBalanceUpdate(true);
    setPriceToHandleWith(0);
  };

  const handleUnstakeTokensError = async (error) => {
    let message;
    if (error.code == 4001) message = "Your transaction have been canceled!";
    else message = "Check your staked balance is above 0 or enough!";
    dispatch({
      type: "error",
      message: message,
      title: "Error unstaking tokens!",
      position: "topR",
    });
    setPriceToHandleWith(0);
  };

  return (
    <div className="flex items-center flex-col p-4">
      <Input
        type="number"
        width="250px"
        value={priceToHandleWith}
        onChange={(event) => {
          setPriceToHandleWith(event.target.value);
        }}
        validation={{
          numberMin: 0,
        }}
      ></Input>

      <div className="p-4 grid gap-4 grid-cols-2 grid-rows-1">
        <Button
          text="Stake"
          size="large"
          theme="colored"
          color="blue"
          onClick={async function () {
            setIsApproveAndStake(true);
            await approve({
              onError: (error) => {
                setIsApproveAndStake(false);
                console.log(error);
              },
              onSuccess: handleApproveToken,
            });
          }}
          disabled={isApproveAndStake || isLoadingStake || isFetchingStake}
          isLoading={isApproveAndStake || isLoadingStake || isFetchingStake}
        />

        <Button
          text="Unstake"
          size="large"
          theme="colored"
          color="yellow"
          onClick={async function () {
            await unstakeTokens({
              onError: handleUnstakeTokensError,
              onSuccess: handleUnstakeTokensSuccess,
            });
          }}
          disabled={isLoadingUnstake || isFetchingUnstake}
          isLoading={isLoadingUnstake || isFetchingUnstake}
        />
      </div>
    </div>
  );
}
