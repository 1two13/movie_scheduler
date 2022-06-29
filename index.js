const key = "ec0349e18bd5a15f1fcf54bad2b7f06c";
const movieBox = document.getElementById("movieBox");

function nowMovie() {
  // 어제 날짜 구하기
  let today = new Date();
  let yesterday = new Date(today.setDate(today.getDate() - 1));
  let yesterdayY = yesterday.getFullYear();
  let yesterdayM = yesterday.getMonth() + 1;
  let yesterdayD = yesterday.getDate();
  // 만약 yesterdayM가 1자리일 경우, 앞에 0 붙이기
  if (String(yesterdayM).length === 1) yesterdayM = "0" + yesterdayM;
  // 만약 yesterdayD가 1자리일 경우, 앞에 0 붙이기
  if (String(yesterdayD).length === 1) yesterdayD = "0" + yesterdayD;
  yesterday = `${yesterdayY}${yesterdayM}${yesterdayD}`;

  // 일별 박스오피스 API
  const dayApi = `https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${key}&targetDt=${yesterday}`;

  const reqPromise = fetch(dayApi, {
    headers: { Accept: "application/json" },
    method: "GET",
  });

  reqPromise
    .then((res) => {
      if (res.status >= 200 && res.status < 300) return res.json();
      else return Promise.reject(new Error(`Got status ${res.status}`));
    })
    .then((movieBoxEl) => {
      movieBox.innerHTML = movieBoxEl.boxOfficeResult.dailyBoxOfficeList
        .map(
          (movie) =>
            ` 
              <div>
                <div>No.${movie.rank}</div>
                <div>${movie.movieNm}</div> 
                <div>누적 관객수 ${Math.round(movie.audiAcc / 10000)}만 명 | 
                  ${movie.openDt} 개봉
                </div>
              </div>
            `
        )
        .join("");
    })
    .catch((err) => alert(err));
}

function comingMovie() {
  let year = new Date().getFullYear();
  let curPage = 1;

  // 개봉 예정작 API
  let comingApi = `https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${key}&openStartDt=${year}&itemPerPage=100&curPage=${curPage}`;

  const reqPromise = fetch(comingApi, {
    headers: { Accept: "application/json" },
    method: "GET",
  });

  reqPromise
    .then((res) => {
      if (res.status >= 200 && res.status < 300) return res.json();
      else return Promise.reject(new Error(`Got status ${res.status}`));
    })
    .then((movieBoxEl) => {
      movieBox.innerHTML = movieBoxEl.movieListResult.movieList
        .filter((upcoming) => upcoming.prdtStatNm === "개봉예정")
        .sort((a, b) => a.openDt - b.openDt)
        .map(
          (movie) =>
            `
              <div>
                <div>${movie.movieNm}</div>
                <div>${movie.openDt} 개봉 예정</div>
              </div>
            `
        )
        .join("");
    })
    .catch((err) => alert(err));
}

window.addEventListener("load", () => {
  nowMovie();
});
