window.scrollTo(0, 0);

const musicControl = $("#musicControl");
const playPauseIcon = document.querySelector("#playPause");
const bgMusic = document.querySelector("audio");

if (bgMusic) {
    bgMusic.load();
}

const bgMusicPlay = (play = true) => {
    if (bgMusic) {
        bgMusic.loop = true;
        bgMusic.controls = false;

        if (play == true) {
            bgMusic.play();
        } else {
            bgMusic.pause();
        }
    }
};

if (musicControl) {
    musicControl.on("click", (event) => {
        if (bgMusic.paused == true) {
            bgMusicPlay();
            playPauseIcon.classList.replace(
                "icofont-music-alt",
                "icofont-ui-pause"
            );
        } else {
            bgMusicPlay(false);
            playPauseIcon.classList.replace(
                "icofont-ui-pause",
                "icofont-music-alt"
            );
        }
    });
}

$("body").css("overflow-y", "hidden");

$("#btn-envelope").on("click", function () {
    // $(".envelope-wrap").css("transform", "translateY(-100%)");

    const coverWrap = document.querySelector(".envelope-wrap");
    const coverImage = coverWrap.querySelector("#image-cover");
    const coverTitle = coverWrap.querySelector("#title-cover");
    const coverHeader = coverWrap.querySelector(".header");

    const mainTitle = document.querySelector("#title-main");

    gsap.to(coverTitle, { y: "150%", duration: 0.75 });
    gsap.to(coverImage, { y: "-130%", duration: 1.25, delay: 0.25 });
    gsap.to(coverHeader, { display: "none" });
    gsap.to(coverWrap, { display: "none", delay: 0.4, duration: 0.5 });

    gsap.fromTo(mainTitle, { y: "130%" }, { y: 0, duration: 1, delay: 1 });
    $("body").css("overflow-y", "auto");
    bgMusicPlay();
});

var previousScroll = 70;
$(window).scroll(function (e) {
    // add/remove class to navbar when scrolling to hide/show
    var scroll = $(window).scrollTop();
    if (scroll >= previousScroll) {
        $("nav").addClass("navbar-hide");
    } else if (scroll < previousScroll) {
        $("nav").removeClass("navbar-hide");
        $("nav").addClass("scrolled");
    }

    if (scroll == 0) {
        $("nav").removeClass("navbar-hide");
        $("nav").removeClass("scrolled");
    }
    previousScroll = scroll;
});

if (document.querySelector(".countdown")) {
    const cd = document.querySelector(".countdown").getAttribute("date");
    Countdown(cd);
}

gsap.registerPlugin(ScrollTrigger);

// Parallax

// gsap.utils.toArray('.parallax-wrapper').forEach((imgWrap, i) => {
//     imgWrap.parallax = imgWrap.querySelector(".parallax");

//     gsap.fromTo(imgWrap.parallax, {
//         y: 0,
//     }, {
//         y: "80%",
//         ease: "none",
//         scrollTrigger: {
//             trigger: imgWrap,
//             start: "top top",
//             end: "bottom top",
//             scrub: true,
//             invalidateOnRefresh: true,
//         }
//     })

//     gsap.fromTo(imgWrap.parallax, {
//         y: "-80%",
//     }, {
//         y: 0,
//         ease: "none",
//         scrollTrigger: {
//             trigger: imgWrap,
//             start: "top bottom",
//             end: "bottom bottom",
//             scrub: true,
//             invalidateOnRefresh: true,
//         }
//     })
// })

// Progress Bar
let progress = document.querySelector(".progress");

gsap.to("body", {
    scrollTrigger: {
        onUpdate: (self) => (progress.style.width = `${self.progress * 100}%`),
    },
});

// Egift section
const giftWrap = document.querySelector(".egift-section");
const tabsWrap = document.querySelector(".tabs-gift");
if (giftWrap && tabsWrap) {
    const tab = tabsWrap.querySelectorAll(".tab");
    tab.forEach((el) => {
        el.classList.forEach((c) => {
            c === "active" &&
                giftWrap.querySelector(el.dataset.tab).classList.add("show");
        });

        el.addEventListener("click", (e) => {
            if (tabsWrap.querySelector(".active")) {
                tabsWrap.querySelector(".active").classList.remove("active");
                giftWrap.querySelector(".show").classList.remove("show");
            }

            el.classList.add("active");
            giftWrap.querySelector(el.dataset.tab).classList.add("show");
        });
    });
}

if (document.querySelector(".zoom-gallery")) {
    $(".zoom-gallery").magnificPopup({
        delegate: "a",
        type: "image",
        mainClass: "mfp-with-zoom mfp-img-mobile",
        gallery: {
            enabled: true,
        },
        zoom: {
            enabled: true,
            easing: "ease-in-out",
        },
    });
}

AOS.init({
    easing: "ease-out-back",
    duration: 2000,
});

const gallery = document.querySelector(".gallery");
const gridLg = [0, 7, 10];
if (gallery) {
    const galleryItems = gallery.querySelectorAll("a");

    galleryItems.forEach((el, index) => {
        gridLg.includes(index) && el.classList.add("grid-lg");
    });
}

/*
Setup: wrap your content <div> in another <div> that will serve as the viewport.
Call this function FIRST (before you create your ScrollTriggers); it sets the
default "scroller" for you (otherwise it'd be the window/body, but it should be
the content <div>)
*/
// smoothScroll("#content");
//
// // this is the helper function that sets it all up. Pass in the content <div> and then the wrapping viewport <div> (can be the elements or selector text). It also sets the default "scroller" to the content so you don't have to do that on all your ScrollTriggers.
// function smoothScroll(content, viewport, smoothness) {
//     content = gsap.utils.toArray(content)[0];
//     smoothness = smoothness || 1;
//
//     gsap.set(viewport || content.parentNode, {
//         overflow: "hidden",
//         position: "fixed",
//         height: "100%",
//         width: "100%",
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//     });
//     gsap.set(content, { overflow: "visible", width: "100%" });
//
//     let getProp = gsap.getProperty(content),
//         setProp = gsap.quickSetter(content, "y", "px"),
//         setScroll = ScrollTrigger.getScrollFunc(window),
//         removeScroll = () => (content.style.overflow = "visible"),
//         killScrub = (trigger) => {
//             let scrub = trigger.getTween
//                 ? trigger.getTween()
//                 : gsap.getTweensOf(trigger.animation)[0]; // getTween() was added in 3.6.2
//             scrub && scrub.pause();
//             trigger.animation.progress(trigger.progress);
//         },
//         height,
//         isProxyScrolling;
//
//     function refreshHeight() {
//         height = content.clientHeight;
//         content.style.overflow = "visible";
//         document.body.style.height = height + "px";
//         return height - document.documentElement.clientHeight;
//     }
//
//     ScrollTrigger.addEventListener("refresh", () => {
//         removeScroll();
//         requestAnimationFrame(removeScroll);
//     });
//     ScrollTrigger.defaults({ scroller: content });
//     ScrollTrigger.prototype.update = (p) => p; // works around an issue in ScrollTrigger 3.6.1 and earlier (fixed in 3.6.2, so this line could be deleted if you're using 3.6.2 or later)
//
//     ScrollTrigger.scrollerProxy(content, {
//         scrollTop(value) {
//             if (arguments.length) {
//                 isProxyScrolling = true; // otherwise, if snapping was applied (or anything that attempted to SET the scroll proxy's scroll position), we'd set the scroll here which would then (on the next tick) update the content tween/ScrollTrigger which would try to smoothly animate to that new value, thus the scrub tween would impede the progress. So we use this flag to respond accordingly in the ScrollTrigger's onUpdate and effectively force the scrub to its end immediately.
//                 setProp(-value);
//                 setScroll(value);
//                 return;
//             }
//             return -getProp("y");
//         },
//         scrollHeight: () => document.body.scrollHeight,
//         getBoundingClientRect() {
//             return {
//                 top: 0,
//                 left: 0,
//                 width: window.innerWidth,
//                 height: window.innerHeight,
//             };
//         },
//     });
//
//     return ScrollTrigger.create({
//         animation: gsap.fromTo(
//             content,
//             { y: 0 },
//             {
//                 y: () => document.documentElement.clientHeight - height,
//                 ease: "none",
//                 onUpdate: ScrollTrigger.update,
//             }
//         ),
//         scroller: window,
//         invalidateOnRefresh: true,
//         start: 0,
//         end: refreshHeight,
//         refreshPriority: -999,
//         scrub: smoothness,
//         onUpdate: (self) => {
//             if (isProxyScrolling) {
//                 killScrub(self);
//                 isProxyScrolling = false;
//             }
//         },
//         onRefresh: killScrub, // when the screen resizes, we just want the animation to immediately go to the appropriate spot rather than animating there, so basically kill the scrub.
//     });
// }

$("img").on("load", function () {
    ScrollTrigger.refresh();
});

$('iframe, img').on('load', function () {
    AOS.refresh();
    console.log('AOS Refreshed');
});

$(window).on('resize', function(){
    console.log('Window Resized');
    setTimeout(function() {
        AOS.refresh();
    }, 1000);
});
