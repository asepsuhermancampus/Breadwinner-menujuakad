const Countdown = (date) => {
  console.log(date);
  const ct = new Date(date).getTime();

  const x = setInterval(() => {
    let now = new Date().getTime();

    let distance = ct - now;

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance <= 0) {
      clearInterval(x);
    } else {
      $(".days .angka").text(days.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }));
      $(".hours .angka").text(hours.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }));
      $(".minutes .angka").text(minutes.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }));
      $(".seconds .angka").text(seconds.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }));
    }
  }, 1000);
};
