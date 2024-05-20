import { useEffect, useRef } from "react";
import { IoIosArrowUp } from "react-icons/io";

type Props = {
  offset?: number;
};

const ScrollToTopBtn = (props: Props) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const offset = "offset" in props ? props.offset || 0 : 300;

  useEffect(() => {
    const scrollFn = () =>
      btnRef.current?.classList.toggle("active", scrollY >= offset);

    window.addEventListener("scroll", scrollFn);
    return () => window.removeEventListener("scroll", scrollFn);
  }, []);

  return (
    <button
      onClick={() => scroll({ behavior: "smooth", top: 0 })}
      ref={btnRef}
      className="scroll-to-top-btn btn btn-success d-flex align-items-center justify-content-center position-fixed"
    >
      <IoIosArrowUp />
    </button>
  );
};
export default ScrollToTopBtn;
