import { useEffect, useRef, useState } from "react";

import PostsList, { PostsListRefType } from "../components/Post/PostsList";

import { getPostsLazy } from "../store/api/api";

import { TPost } from "../types";

// icons
const arrowIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
    <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
  </svg>
);

const HomePage = () => {
  const postsListRef = useRef<PostsListRefType>(null);
  const scrollTopBtnRef = useRef<HTMLButtonElement>(null);

  const [getPosts, { isLoading, isError, data }] = getPostsLazy();

  const prevNum = useRef(0);
  const prevPosts = useRef<TPost[]>([]);

  const [page, setPage] = useState(1);

  const [allPosts, setAllPosts] = useState<TPost[]>([]);

  useEffect(() => {
    if (prevNum.current < page) {
      getPosts(page)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .then((_) => {
          postsListRef.current?.loading
            ? postsListRef.current?.setLoading(false)
            : null;
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch((_) => {
          postsListRef.current?.loading
            ? postsListRef.current?.setLoading(false)
            : null;
        });
      prevNum.current += 1;
    }
  }, [page, getPosts]);

  const sameObjects = <T,>(obj1: T, obj2: T): boolean => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  useEffect(() => {
    if (data && !isError && !isLoading) {
      if (!sameObjects(prevPosts.current, data.data)) {
        prevPosts.current = data.data;

        setAllPosts((p) => [...p, ...data.data]);
      }
    }
  }, [page, data, isError, isLoading]);

  useEffect(() => {
    const scrollFn = () => {
      const lastPage = data?.meta.last_page;

      const totalHeight = document.documentElement.scrollHeight;
      const scrolled = scrollY + innerHeight;

      if (scrolled >= totalHeight - 550) {
        if (page !== lastPage && !postsListRef.current?.loading) {
          setPage((p) => p + 1);
          postsListRef.current?.setLoading(true);
        }
      }

      scrollTopBtnRef.current?.classList.toggle("active", scrollY >= 300);
    };

    window.addEventListener("scroll", scrollFn);
    return () => window.removeEventListener("scroll", scrollFn);
  }, []);

  if (isError) return <h2>something went wrong!</h2>;

  return (
    <div>
      <ul className="posts-list">
        <PostsList
          ref={postsListRef}
          isLoading={isLoading}
          isError={isError}
          postsList={allPosts}
        />
      </ul>

      <button
        onClick={() => scroll({ behavior: "smooth", top: 0 })}
        ref={scrollTopBtnRef}
        className="scroll-to-top-btn"
      >
        {arrowIcon}
      </button>
    </div>
  );
};
export default HomePage;
