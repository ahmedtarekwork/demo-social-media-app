import { useEffect, useRef, useState } from "react";

// components
import PostsList, { type PostsListRefType } from "../components/Post/PostsList";
import ScrollToTopBtn from "../components/ScrollToTopBtn";

import { getPostsLazy } from "../store/api/api";

import type { TPost } from "../types";

const HomePage = () => {
  const postsListRef = useRef<PostsListRefType>(null);
  // const scrollTopBtnRef = useRef<HTMLButtonElement>(null);

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
    };

    window.addEventListener("scroll", scrollFn);
    return () => window.removeEventListener("scroll", scrollFn);
  }, []);

  if (isError) return <h2>something went wrong!</h2>;

  return (
    <div>
      <h1 className="home-page-title pb-1 mb-3 text-success border-bottom border-success border-2">
        Home Page
      </h1>

      <PostsList
        ref={postsListRef}
        isLoading={isLoading}
        isError={isError}
        postsList={allPosts}
      />

      <ScrollToTopBtn />
    </div>
  );
};
export default HomePage;
