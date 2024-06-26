"use client";

import { useState, useEffect, ChangeEvent, useRef } from "react";
import PromptCard from "@components/PromptCard";
import { Post } from "@global-types";

const PromptCardList = ({
  data,
  handleTagClick,
}: {
  data: Post[];
  handleTagClick: (tag: string) => void;
}) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const searchByTag = useRef(false);
  const [posts, setPosts] = useState([]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        `/api/prompt${searchText === "" ? "" : "?query=" + searchText}`
      );
      const data = await response.json();

      setPosts(data);
    };

    if (searchByTag.current) {
      fetchPosts();
      searchByTag.current = false;
      return;
    }

    const timer = setTimeout(() => {
      fetchPosts();
    }, 250);

    return () => clearTimeout(timer);
  }, [searchText]);

  function handleTagClick(tag: string) {
    setSearchText(tag);
    searchByTag.current = true;
  }

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        ></input>
      </form>
      <PromptCardList data={posts} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;
