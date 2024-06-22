const EvenEnd = () => {
  return (
    <>
      <span className="text-[16px]">Event ended</span>
      <div className="w-[50%] text-[20px]">
        <div
          className="js-countdown-single-timer flex w-full justify-evenly"
          data-countdown="2022-09-07T19:40:30"
          data-expired="This auction has ended"
        >
          <span className="countdown-days flex items-end">
            <div className="">{0}</div>
            <div className="block tracking-tight">d</div>
          </span>
          <span className="countdown-hours flex items-end">
            <span className="js-countdown-hours-number">{0}</span>
            <span className="block tracking-tight">h</span>
          </span>
          <span className="countdown-minutes flex items-end">
            <span className="js-countdown-minutes-number">{0}</span>
            <span className="block tracking-tight">m</span>
          </span>
          <span className="countdown-seconds flex items-end">
            <span className="js-countdown-seconds-number">{0}</span>
            <span className="block tracking-tight">s</span>
          </span>
        </div>
      </div>
    </>
  );
};
export default EvenEnd;
