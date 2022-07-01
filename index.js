const key = "f5eef3421c602c6cb7ea224104795888";
const movieBox = document.getElementById("movieBox");
let year = new Date().getFullYear();
let curPage = 1;
let movieList = [];

// 무비차트를 클릭할 때 실행되는 함수
function movieChart() {
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

// (totCnt / 100) 만큼 반복문으로 도는 함수
async function init() {
  movieBox.innerText = "";
  while (true) {
    let comingApi = `https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${key}&openStartDt=${year}&itemPerPage=100&curPage=${curPage}`;
    // console.log(comingApi);
    const result = await fetch(comingApi, {
      headers: { Accept: "application/json" },
      method: "GET",
    })
      .then((res) => res.json())
      .catch((err) => alert(err));
    // console.log(result.movieListResult.movieList.length);
    if (result.movieListResult.movieList.length === 0) break;
    movieList.push(...result.movieListResult.movieList);
    curPage++;
  }
}

// init 함수를 화면에 표시해주는 함수
// 개봉 예정작을 클릭할 때 실행되는 함수
function displayInit() {
  movieBox.innerHTML = "";
  // 날짜를 기준으로 오름차순으로 정렬하기
  movieList.sort((a, b) => a.openDt - b.openDt);
  for (let i = 0; i < movieList.length; i++) {
    // genreAlt가 성인물(에로)를 포함하고 있지 않고, prdtStatNm가 개봉예정인 영화만 보여주기
    if (
      !movieList[i].genreAlt.includes("성인물(에로)") &&
      movieList[i].prdtStatNm === "개봉예정"
    ) {
      movieBox.innerHTML = `
        ${movieBox.innerHTML} 
        <div>
          <div>${movieList[i].movieNm}</div>
          <div>
            ${movieList[i].openDt.slice(0, 4)}.${movieList[i].openDt.slice(
        4,
        6
      )}.${movieList[i].openDt.slice(6, 8)} 개봉
          </div>
        </div>`;
    }
  }
}

window.addEventListener("load", () => {
  movieChart();
  init();
});
