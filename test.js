import { db } from "./firebaseConfig";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import moment from "moment";

// Hàm tạo suất chiếu cho 7 ngày tới
export const createShowtimesForNextWeek = async () => {
  try {
    const moviesRef = collection(db, "movies");
    const movieDocs = await getDocs(moviesRef);

    const movies = movieDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const cinemasRef = collection(db, "cinemas");
    const cinemaDocs = await getDocs(cinemasRef);

    const startHour = 9;

    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const formattedDate = date.toISOString().split("T")[0];
      const showtimesRef = doc(db, "showtimes", formattedDate);
      const showtimeDoc = await getDoc(showtimesRef);

      if (showtimeDoc.exists()) {
        console.log(`Suất chiếu đã tồn tại cho ngày ${formattedDate}. Bỏ qua.`);
        continue; // Bỏ qua nếu đã tồn tại
      }

      const showtimesData = {};

      cinemaDocs.forEach(async (cinemaDoc) => {
        const cinemaName = cinemaDoc.data().name;
        showtimesData[cinemaName] = [];

        let currentTime = new Date(date);
        currentTime.setHours(startHour, 0, 0, 0);

        // Tiếp tục tạo suất chiếu cho đến 24h
        while (currentTime.getHours() < 24) {
          // Chọn ngẫu nhiên 1 phim từ danh sách
          const randomMovie = movies[Math.floor(Math.random() * movies.length)];
          const movieRuntime = parseInt(randomMovie.runtime, 10); // Chuyển đổi runtime sang số

          if (isNaN(movieRuntime)) {
            console.error(
              `Runtime không hợp lệ cho phim: ${randomMovie.title}`
            );
            continue; // Bỏ qua phim này nếu runtime không hợp lệ
          }

          const roundedMinutes = Math.ceil(currentTime.getMinutes() / 10) * 10;
          currentTime.setMinutes(roundedMinutes);

          const showtime = {
            id: `${cinemaName}-${formattedDate}-${currentTime.getHours()}-${currentTime.getMinutes()}`, // ID cho suất chiếu
            movieId: randomMovie.id,
            time: `${currentTime.getHours()}:${currentTime
              .getMinutes()
              .toString()
              .padStart(2, "0")}`, // Định dạng thời gian
            seats: [],
          };

          showtimesData[cinemaName].push(showtime);

          // Cập nhật thời gian cho suất chiếu tiếp theo
          currentTime.setMinutes(currentTime.getMinutes() + movieRuntime + 20); // Cách nhau 20 phút cộng thêm thời gian chạy của phim

          // Làm tròn số phút của suất chiếu tiếp theo
          currentTime.setMinutes(Math.ceil(currentTime.getMinutes() / 10) * 10);

          // Kiểm tra xem thời gian đã vượt quá 24h chưa
          if (currentTime.getHours() < 9) {
            break; // Dừng lại nếu đã đến 24h
          }
        }
      });

      // Lưu dữ liệu vào Firestore
      await setDoc(showtimesRef, showtimesData);

      console.log(
        `Suất chiếu đã được lưu thành công cho ngày ${formattedDate}:`,
        showtimesData
      );
    }
  } catch (error) {
    console.error("Đã xảy ra lỗi khi tạo suất chiếu:", error);
  }
};

export const getShowtimesByMovieIdForNext7Days = async (idmovie) => {
  try {
    const showtimesCollection = collection(db, "showtimes");
    const now = moment(); // Thời gian hiện tại
    const allShowtimes = [];

    // Lặp qua 7 ngày tới
    for (let i = 0; i < 7; i++) {
      const date = moment().add(i, "days").format("YYYY-MM-DD"); // Ngày trong tương lai định dạng yyyy-mm-dd

      // Lấy document của ngày cụ thể
      const dateDocRef = doc(showtimesCollection, date);
      const dateDocSnap = await getDoc(dateDocRef);

      if (dateDocSnap.exists()) {
        const dateData = dateDocSnap.data(); // Lấy dữ liệu từ tài liệu
        // Duyệt qua các rạp
        for (const [cinemaId, showtimes] of Object.entries(dateData)) {
          // Lọc suất chiếu theo movieId và thời gian sau hiện tại
          const filteredShowtimes = showtimes.filter((showtime) => {
            const showtimeMoment = moment(
              `${date} ${showtime.time}`,
              "YYYY-MM-DD HH:mm"
            ); // Kết hợp ngày và thời gian

            return (
              showtime.movieId.toString() === idmovie.toString() &&
              showtimeMoment.isAfter(now)
            ); // Kiểm tra thời gian sau hiện tại
          });
          filteredShowtimes.forEach((showtime) => {
            allShowtimes.push({
              cinemaId: cinemaId,
              date,
              time: showtime.time,
              seats: showtime.seats,
            });
          });
        }
      } else {
        console.log(`Tài liệu cho ngày ${date} không tồn tại.`);
      }
    }

    return allShowtimes;
  } catch (error) {
    console.error("Error fetching showtimes: ", error);
    return [];
  }
};
export const getShowtimesForNext7Days = async () => {
  try {
    const showtimesCollection = collection(db, 'showtimes');
    const moviesCollection = collection(db, 'movies'); // Tạo tham chiếu đến bảng movies
    const now = moment(); // Thời gian hiện tại
    const allShowtimes = {};

    // Lấy danh sách phim
    const moviesSnapshot = await getDocs(moviesCollection);
    const moviesData = {};
    const moviesDataImg = {};
    moviesSnapshot.forEach((doc) => {
      const movie = doc.data();
      moviesData[movie.id] = movie.title; // Lưu id phim và tên phim
      moviesDataImg[movie.id] = movie.poster_path; //Lưu ảnh
    });

    for (let i = 0; i < 7; i++) {
      const date = moment().add(i, 'days').format('YYYY-MM-DD'); // Ngày trong tương lai định dạng yyyy-mm-dd

      // Lấy document của ngày cụ thể
      const dateDocRef = doc(showtimesCollection, date);
      const dateDocSnap = await getDoc(dateDocRef);

      if (dateDocSnap.exists()) {
        const dateData = dateDocSnap.data();

        // Kiểm tra nếu dateData là object và không null/undefined
        if (dateData && typeof dateData === 'object') {
          allShowtimes[date] = {};

          // Duyệt qua các rạp (cinemas)
          for (const [cinemaId, showtimes] of Object.entries(dateData)) {
            // Kiểm tra nếu showtimes không undefined
            if (showtimes) { 
              let filteredShowtimes = [];

              // Nếu là ngày đầu tiên (ngày hiện tại), lọc suất chiếu theo giờ hiện tại
              if (i === 0) {
                filteredShowtimes = showtimes.filter(showtime => {
                  const showtimeMoment = moment(`${date} ${showtime.time}`, 'YYYY-MM-DD HH:mm');
                  return showtimeMoment.isAfter(now);
                });
              } else {
                // Các ngày tiếp theo sẽ hiển thị toàn bộ suất chiếu, không lọc
                filteredShowtimes = showtimes;
              }

              // Thêm thuộc tính title vào suất chiếu
              filteredShowtimes = filteredShowtimes.map(showtime => ({
                ...showtime,
                title: moviesData[showtime.movieId] || 'Unknown Movie', // Thay thế 'Unknown Movie' nếu không tìm thấy
                img: moviesDataImg[showtime.movieId] || 'Unknown Movie', // Thay thế 'Unknown Movie' nếu không tìm thấy
              }));

              // Thêm suất chiếu đã lọc vào dữ liệu tổng
              allShowtimes[date][cinemaId] = filteredShowtimes;
            } else {
              console.warn(`No showtimes found for cinema: ${cinemaId} on date: ${date}`);
            }
          }
        } else {
          console.warn(`Invalid data format for date: ${date}`);
        }
      } else {
        console.log(`Tài liệu cho ngày ${date} không tồn tại.`);
      }
    }
    return allShowtimes;
  } catch (error) {
    console.error('Error fetching showtimes: ', error);
    return {};
  }
};

// Gọi hàm
