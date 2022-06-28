function nowMovie() {
  const key = "ec0349e18bd5a15f1fcf54bad2b7f06c";

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

  const movieBox = document.getElementById("movieBox");

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

window.addEventListener("load", () => {
  nowMovie();
});
