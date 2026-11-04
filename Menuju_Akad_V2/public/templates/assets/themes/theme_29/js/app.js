const musicControl = $("#musicControl")
const playPauseIcon = document.querySelector("#playPause")
const bgMusic = document.querySelector("audio");

if (bgMusic) {
    bgMusic.load();
}

const bgMusicPlay = (play = true) => {
    if (bgMusic) {
        bgMusic.loop = true
        bgMusic.controls = false

        if (play == true) {
            bgMusic.play()
        } else {
            bgMusic.pause()
        }
    }
}

$(document).ready(() => {
  AOS.init({
    easing: "ease-out-back",
    duration: 1000,
  });


  if (musicControl) {
      musicControl.on("click", (event) => {
          if (bgMusic.paused == true) {
              bgMusicPlay()
              playPauseIcon.classList.replace('icofont-music-alt', 'icofont-ui-pause')
          } else {
              bgMusicPlay(false)
              playPauseIcon.classList.replace('icofont-ui-pause', 'icofont-music-alt')
          }
      })
  }

  var previousScroll = 70;
		$(window).scroll(function(e) {

	        // add/remove class to navbar when scrolling to hide/show
	        var scroll = $(window).scrollTop();
	        if (scroll >= previousScroll) {
	            $('nav').addClass("navbar-hide");
	        }else if (scroll < previousScroll) {
	            $('nav').removeClass("navbar-hide");
	            $('nav').addClass("scrolled");
	        }

	        if(scroll == 0){
	            $('nav').removeClass("navbar-hide");
	            $('nav').removeClass("scrolled");
	        }
	        previousScroll = scroll;
	    });

  $(document).scroll(function () {
    $('nav').toggleClass('scrolled', $(this).scrollTop() > $('nav').height())
  });

  $('body').css('overflowY', 'hidden');
  // $('.main-app').css("visibility", 'hidden');

  $("#btn-envelope").on('click', function () {
    $("#envelope-wrap").css('transform', 'translateY(-100%)')
    $("#envelope-wrap").css('opacity', 0)
    bgMusicPlay();
    $('body').css('overflowY', 'auto');
    $('.main-app').css('visibility', 'visible');
  })

    if (document.querySelector('.default-gallery')) {
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
    
    //countdown
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
          $(".days .angka").text(days);
          $(".hours .angka").text(hours);
          $(".minutes .angka").text(minutes);
          $(".seconds .angka").text(seconds);
        }
      }, 1000);
    };

    // countdown
    const date = $(".countdown").attr("date");
    Countdown(date);
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


const siteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content');

if (siteName === "radian-shesa.menujuakad.com") {
	document.addEventListener('DOMContentLoaded', function() {
	  // Target specifically within section-5-2
	  const section = document.querySelector('.section-5-2');
	  
	  if (section) {
		const formKehadiran = section.querySelector('.form-kehadiran');
		const rowJustify = section.querySelector('.row.justify-content-center');
		
		if (formKehadiran && rowJustify) {
		  // Move form-kehadiran after row justify-content-center
		  rowJustify.after(formKehadiran);
		  console.log('Elements repositioned within section-5-2!');
		}
	  }
	  
	  // Find the email input field
    const emailInput = document.querySelector('input[name="email"]');
    
    if (emailInput) {
        // Change the input type from email to text
        emailInput.type = 'text';
        
        // Change the name from email to address
        emailInput.name = 'address';
		
		//Change placeholdder
		emailInput.placeholder = 'Transport';
        
        // Update the label text from "Email" to "Transport"
        const emailLabel = document.querySelector('label[for="email"]');
        if (emailLabel) {
            emailLabel.textContent = 'Transport';
            // Also update the 'for' attribute to match the new input name if needed
            // But since we're keeping the same ID, this might not be necessary
        }
        
        // Update the error message label if it exists
        const emailError = document.querySelector('label[for="email"] + label.error');
        if (emailError && emailError.textContent.includes('email')) {
            emailError.textContent = 'This field is required.';
            // You could also change the error message to be more specific about dietary requirements
        }
        
        // Optional: Update the ID of the input field if needed
        // emailInput.id = 'address';
        // Then you would also need to update the label's 'for' attribute
    }
	});
}