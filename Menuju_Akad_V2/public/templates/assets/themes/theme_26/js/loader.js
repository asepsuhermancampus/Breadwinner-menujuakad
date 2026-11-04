document.onreadystatechange = () => {
  if (document.readyState !== "complete") {
    document.querySelector(".main-app").style.visibility = "hidden";
    document.querySelector(".loader-wrapper").style.visibility = "visible";
  } else {
    document.querySelector(".main-app").style.visibility = "visible";
    document.querySelector(".loader-wrapper").style.visibility = "hidden";
  }
};
