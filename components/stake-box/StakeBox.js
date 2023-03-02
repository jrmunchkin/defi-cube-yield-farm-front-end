import { TabList, Tab } from "web3uikit";
import UnstakedBalance from "./UnstakedBalance";
import StakedBalance from "./StakedBalance";
import StakeForm from "./StakeForm";

export default function StakeBox({ supportedTokens, cubeFarmAddress }) {
  return (
    <div className="flex items-center flex-col p-8">
      <h1 className="text-white text-2xl p-4"> Stake your tokens! </h1>
      <div className="box-border w-350 rounded-lg border-2 p-5 bg-white">
        <TabList defaultActiveKey={0} tabStyle="bulbSeperate">
          {supportedTokens.map((token, index) => {
            return (
              <Tab tabKey={index} tabName={token.name}>
                <div className="flex items-center flex-col">
                  <div className="grid gap-4 grid-cols-2 mt-4 grid-rows-1">
                    <UnstakedBalance token={token} />
                    <StakedBalance
                      token={token}
                      cubeFarmAddress={cubeFarmAddress}
                    />
                  </div>
                  <StakeForm token={token} cubeFarmAddress={cubeFarmAddress} />
                </div>
              </Tab>
            );
          })}
        </TabList>
      </div>
    </div>
  );
}
