export default function BalanceBox({ label, amount, tokenImgSrc }) {
  return (
    <div className="box-border rounded-lg p-4 border-2 bg-white">
      <div className="flex font-bold items-center flex-col">
        <div>{label}</div>
        <div className="inline-flex items-center gap-2">
          <div>{amount}</div>
          <img className="w-8" src={tokenImgSrc} alt="token logo"></img>
        </div>
      </div>
    </div>
  );
}
