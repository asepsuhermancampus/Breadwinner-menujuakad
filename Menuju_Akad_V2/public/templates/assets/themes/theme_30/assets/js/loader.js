document.onreadystatechange = () => {
  if (document.readyState !== "complete") {
    document.querySelector(".main-app").style.display = "none";
    document.querySelector(".loader-wrapper").style.display = "flex";
  } else {
    document.querySelector(".main-app").style.display = "block";
    document.querySelector(".loader-wrapper").style.display = "none";
  }
};