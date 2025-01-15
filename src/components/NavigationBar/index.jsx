import { PuzzlePieceIcon } from "@heroicons/react/24/outline";
import { QueueListIcon } from "@heroicons/react/24/outline";
import { CircleStackIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const index = () => {
  return (
    <div className="btm-nav h-14">
      <Link to="/Profile" className="text-success">
        <CircleStackIcon className="size-6" />
      </Link>
      <Link to="/" className="text-success active">
        <QueueListIcon className="size-6" />
      </Link>
      <Link to="/practice" className="text-success">
        <PuzzlePieceIcon className="size-6" />
      </Link>
    </div>
  );
};




export default index;
