import { useState } from "react";

export const useStakeTokens = () => {
  const [isStakingBalanceUpdate, setIsStakingBalanceUpdate] = useState(false);
  const [isUnstakingBalanceUpdate, setIsUnstakingBalanceUpdate] =
    useState(false);

  return {
    isStakingBalanceUpdate,
    setIsStakingBalanceUpdate,
    isUnstakingBalanceUpdate,
    setIsUnstakingBalanceUpdate,
  };
};
