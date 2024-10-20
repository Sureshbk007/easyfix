import { useRef, useState } from "react";

function Details() {
  const containerRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const updateButtonVisibility = () => {
    const container = containerRef.current;
    setShowLeft(container.scrollLeft > 0);
    setShowRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth
    );
  };
  const scrollLeft = () => {
    containerRef.current.scrollLeft -= 320;
    updateButtonVisibility();
  };
  const scrollRight = () => {
    containerRef.current.scrollLeft += 320;
    updateButtonVisibility();
  };

  return (
    <div className="relative flex items-center group">
      <button
        onClick={scrollLeft}
        className={`${
          showLeft ? "block" : "invisible"
        } absolute left-0  h-full ml-2 opacity-0 group-hover:opacity-100 transition-all`}
      >
        <span className="h-12 bg-slate-500 p-3 text-white  rounded-full bg-opacity-80 hover:bg-slate-700">
          &lt;
        </span>
      </button>

      <div
        className="w-80 h-80 flex overflow-x-auto scroll-smooth hide-scrollbar gap-2 snap-x snap-mandatory"
        ref={containerRef}
        onScroll={updateButtonVisibility}
      >
        <div className="flex-shrink-0 w-80 h-80 bg-blue-300 snap-start">
          Item 1
        </div>
        <div className="flex-shrink-0 w-80 h-80 bg-green-300 snap-start">
          Item 2
        </div>
        <div className="flex-shrink-0 w-80 h-80 bg-red-300 snap-start">
          Item 3
        </div>
        <div className="flex-shrink-0 w-80 h-80 bg-slate-300 snap-start">
          Item 4
        </div>
        <div className="flex-shrink-0 w-80 h-80 bg-gray-300 snap-start">
          Item 5
        </div>
        <div className="flex-shrink-0 w-80 h-80 bg-blue-300 snap-start">
          Item 1
        </div>
        <div className="flex-shrink-0 w-80 h-80 bg-green-300 snap-start">
          Item 2
        </div>
        <div className="flex-shrink-0 w-80 h-80 bg-red-300 snap-start">
          Item 3
        </div>
        <div className="flex-shrink-0 w-80 h-80 bg-slate-300 snap-start">
          Item 4
        </div>
        <div className="flex-shrink-0 w-80 h-80 bg-gray-300 snap-start">
          Item 5
        </div>
      </div>

      <button
        onClick={scrollRight}
        className={`${
          showRight ? "block" : "invisible"
        } absolute right-0 mr-2 opacity-0 group-hover:opacity-100 transition-all`}
      >
        <span className=" bg-slate-500 p-3 text-white  rounded-full bg-opacity-80 hover:bg-slate-700">
          &gt;
        </span>
      </button>
    </div>
  );
}

export default Details;
