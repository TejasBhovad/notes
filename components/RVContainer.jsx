import Link from "next/link";
import Doc from "./logo/Doc";
import { formatDistance } from "date-fns";
const RVContainer = ({ type, name, url, last_viewed }) => {
  return (
    <Link
      href={url}
      className="bg-util/80 hover:bg-util border-border border-[1.5px] w-full sm:w-1/2 lg:w-1/3 h-20 rounded-md p-3 flex"
    >
      <div className="h-full aspect-square flex items-center justify-center">
        <Doc size={40} />
      </div>
      <div className="w-full h-full flex flex-col justify-center overflow-hidden">
        <span className="text-text font-semibold truncate w-full">{name}</span>
        <span className="text-textMuted text-sm truncate">
          viewed{" "}
          {formatDistance(new Date(last_viewed), new Date(), {
            addSuffix: true,
          })}
        </span>
      </div>
    </Link>
  );
};

export default RVContainer;
