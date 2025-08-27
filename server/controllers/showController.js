import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import { inngest } from "../inngest/index.js";

// API để lấy danh sách phim đang chiếu từ TMDB API
export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
      }
    );
    const movies = data.results;
    res.status(200).json({ success: true, movies: movies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API để thêm show vào cơ sở dữ liệu
export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;
    let movie = await Movie.findById(movieId);

    if (!movie) {
      // lấy thông tin phim và diễn viên cùng lúc từ TMDB API
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
      ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditsData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };

      // tạo movie mới và lưu xuống csdl
      movie = await Movie.create(movieDetails);
    }

    const showsToCreate = [];

    showsInput.forEach((show) => {
      // show có dạng { dateTime: "2025-08-20T04:24:00.000Z" }
      showsToCreate.push({
        movie: movieId,
        showDateTime: show.dateTime, // giữ nguyên ISO string
        showPrice,
        occupiedSeats: {},
      });
    });

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    //  Trigger Inngest event
    await inngest.send({
      name: "app/show.added",
      data: { movieTitle: movie.title },
    });

    res
      .status(201)
      .json({ success: true, message: "Show Added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get all shows from the database
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    // filter unique shows
    const uniqueShows = new Set(shows.map((show) => show.movie));

    res.status(200).json({ success: true, shows: Array.from(uniqueShows) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get a single show from the database
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;
    // get all upcoming shows for the movie
    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    });

    const movie = await Movie.findById(movieId);
    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];
      if (!dateTime[date]) {
        dateTime[date] = [];
      }
      dateTime[date].push({ time: show.showDateTime, showId: show._id });
    });

    res.status(200).json({ success: true, movie, dateTime });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get trailer
export const getTrailer = async (req, res) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: "Movie not found" });
    }

    // Call TMDB API to get the trailer
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos`,
      {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
      }
    );

    const trailers = response.data.results.filter(
      (video) => video.type === "Trailer"
    );

    res.status(200).json({ success: true, trailers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
