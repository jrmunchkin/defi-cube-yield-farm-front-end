import { useWeb3Contract, useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { formatUnits } from "@ethersproject/units";
import { Button, useNotification } from "web3uikit";
import { useBetween } from "use-between";
import { Reload } from "@web3uikit/icons";
import { useStakeTokens } from "../../hooks/useStakeTokens";
import cubeFarmAbi from "../../constants/chain-info/contracts/CubeFarm.json";

export default function RewardsBox({ cubeFarmAddress }) {
  const { setIsUnstakingBalanceUpdate } = useBetween(useStakeTokens);
  const { isWeb3Enabled, account } = useMoralis();
  const [pendingRewards, setPendingRewards] = useState("0");

  const dispatch = useNotification();

  const { runContractFunction: getTotalPendingRewards } = useWeb3Contract({
    abi: cubeFarmAbi.abi,
    contractAddress: cubeFarmAddress,
    functionName: "getTotalPendingRewards",
    params: {
      _user: account,
    },
  });

  const {
    runContractFunction: claimYieldRewards,
    isLoading: isLoading,
    isFetching: isFetching,
  } = useWeb3Contract({
    abi: cubeFarmAbi.abi,
    contractAddress: cubeFarmAddress,
    functionName: "claimYieldRewards",
    params: {},
  });

  async function updateUI() {
    const pendingRewardsFromCall = (await getTotalPendingRewards()).toString();
    const formattedPendingRewardsBalance = pendingRewardsFromCall
      ? Math.round(
          (parseFloat(formatUnits(pendingRewardsFromCall, 18)) +
            Number.EPSILON) *
            1e5
        ) / 1e5
      : 0;
    setPendingRewards(formattedPendingRewardsBalance);
  }

  const handleClaimRewardsSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Your rewards have been claimed!",
      title: "Tokens claimed!",
      position: "topR",
    });
    setIsUnstakingBalanceUpdate(true);
    updateUI();
  };

  const handleClaimRewardsError = async (error) => {
    let message;
    if (error.code == 4001) message = "Your transaction have been canceled!";
    else message = "Are you sure you have rewards to claim?";
    dispatch({
      type: "error",
      message: message,
      title: "Error claiming tokens!",
      position: "topR",
    });
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled, account]);

  return (
    <div className="flex items-center flex-col">
      <h1 className="text-white text-2xl p-4"> Claim your CUBE rewards! </h1>
      <div className="box-border rounded-lg border-2 bg-white">
        <div className="flex items-end flex-col">
          <Button
            icon={<Reload fontSize="30px" />}
            iconLayout="icon-only"
            theme="outline"
            onClick={async function () {
              await updateUI();
            }}
          />
        </div>
        <div className="flex items-center p-4 flex-col">
          <div className="inline-flex items-center gap-2">
            <div className="font-bold text-xl">{pendingRewards}</div>
            <img className="w-10" src="/images/cube.png" alt="token logo"></img>
          </div>
          <div className="p-4">
            <Button
              text="Claim Rewards!"
              size="xl"
              theme="colored"
              color="green"
              onClick={async function () {
                await claimYieldRewards({
                  onError: handleClaimRewardsError,
                  onSuccess: handleClaimRewardsSuccess,
                });
              }}
              disabled={isLoading || isFetching}
              isLoading={isLoading || isFetching}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
