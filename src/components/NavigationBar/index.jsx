import { PuzzlePieceIcon } from "@heroicons/react/24/outline";
import { QueueListIcon } from "@heroicons/react/24/outline";
import { CircleStackIcon } from "@heroicons/react/24/outline";

const index = () => {
  return (
    <div className="btm-nav  h-14">
      <button className="text-success">
        <CircleStackIcon className="size-6" />
      </button>
      <button className="text-success active">
        <QueueListIcon className="size-6" />
      </button>
      <button className="text-success">
        <PuzzlePieceIcon className="size-6" />
      </button>
    </div>
  );
};

export default index;
