import express from "express";
import {
  addShow,
  getNowPlayingMovies,
  getShow,
  getShows,
} from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router();

/**
 * @swagger
 * /show/now-playing:
 *   get:
 *     summary: Lấy danh sách phim đang chiếu
 *     description: API để lấy danh sách các phim đang chiếu từ TMDB (The Movie Database) API
 *     tags: [Shows]
 *     responses:
 *       200:
 *         description: Lấy danh sách phim thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 movies:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID của phim từ TMDB
 *                         example: 533535
 *                       title:
 *                         type: string
 *                         description: Tên phim
 *                         example: "Deadpool & Wolverine"
 *                       overview:
 *                         type: string
 *                         description: Mô tả nội dung phim
 *                         example: "A listless Wade Wilson toils away in civilian life..."
 *                       poster_path:
 *                         type: string
 *                         description: Đường dẫn poster phim
 *                         example: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg"
 *                       backdrop_path:
 *                         type: string
 *                         description: Đường dẫn ảnh nền phim
 *                         example: "/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg"
 *                       release_date:
 *                         type: string
 *                         description: Ngày phát hành phim
 *                         example: "2024-07-24"
 *                       vote_average:
 *                         type: number
 *                         description: Điểm đánh giá trung bình
 *                         example: 7.7
 *                       genre_ids:
 *                         type: array
 *                         items:
 *                           type: integer
 *                         description: Danh sách ID thể loại phim
 *                         example: [28, 35, 878]
 *                       adult:
 *                         type: boolean
 *                         description: Phim dành cho người lớn hay không
 *                         example: false
 *                       original_language:
 *                         type: string
 *                         description: Ngôn ngữ gốc
 *                         example: "en"
 *                       popularity:
 *                         type: number
 *                         description: Độ phổ biến của phim
 *                         example: 1234.56
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Thông báo lỗi
 *                   example: "Internal server error"
 */
showRouter.get("/now-playing", protectAdmin, getNowPlayingMovies);
showRouter.post("/add", protectAdmin, addShow);
showRouter.get("/all", getShows);
showRouter.get("/:movieId", getShow);

export default showRouter;
