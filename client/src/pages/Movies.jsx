import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import Loading from "../components/Loading";
import InfiniteScroll from "react-infinite-scroll-component";

const fetchAllMovies = async ({ pageParam = 1 }) => {
  const res = await axios.get(`/show/all`, {
    params: { page: pageParam },
  });
  return res.data;
};

const Movies = () => {
  const { data, fetchNextPage, hasNextPage, status } = useInfiniteQuery({
    queryKey: ["allMovies"],
    queryFn: fetchAllMovies,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
  });

  const allMovies = data?.pages.flatMap((page) => page.shows) || [];

  if (status === "loading") return <div>Loading...</div>;
  if (status === "error") return <div>Error fetching movies</div>;

  console.log(allMovies);

  return (
    <>
      {/* Phần header + background */}
      <div className="relative mt-40 px-6 md:px-16 lg:px-40 xl:px-44">
        <BlurCircle top="150px" left="0px" />
        <BlurCircle bottom="50px" right="50px" />
        <h1 className="text-lg font-medium my-16">Now Showing</h1>
      </div>

      {/* Danh sách phim */}
      <div className="px-6 md:px-16 lg:px-40 xl:px-44">
        <InfiniteScroll
          dataLength={allMovies.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={
            <div className="flex justify-center py-10">
              <Loading />
            </div>
          }
          endMessage={""}
          className="flex flex-wrap max-sm:justify-center gap-8"
        >
          {allMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
};

export default Movies;
