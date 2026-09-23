// @ts-nocheck

$(function () {

     $(".account").on("click", function () {
          $(this).toggleClass("active");
          $(".account-dropdown").slideToggle();
     });
     $(".account").on("blur", function () {
          $(this).removeClass("active");
          $(".account-dropdown").slideUp();
     })

     $("aside a.drop").on("click", function (e) {
          e.preventDefault();

          if ($(this).next().is(":visible")) {
               $(".cat-dropdown").fadeOut();
          }
          else {
               $(".cat-dropdown").fadeOut(0);
               $(this).next().fadeIn()
          }
     });
     $("aside a").on("blur", function () {
          $(".cat-dropdown").fadeOut();
     });



     if ($('.slides').length) {
          $(".slides").slick({
               autoplay: true,
               arrows: false,
               dots: true
          });

     }

     if ($('.ticker').length) {
          $(".ticker").slick({
               infinite: true,
               slidesToShow: 4,
               slidesToScroll: 4,
               arrows: true
          });
     }



     /**
      * @param {any} date1
      * @param {any} date2
      */
     function saleTimer(date1, date2) {
          // Get total difference in milliseconds and take the absolute value
          let difference_ms = Math.abs(date2.getTime() - date1.getTime());

          // Convert milliseconds to seconds
          let delta = difference_ms / 1000;

          // Calculate days, hours, minutes, and seconds
          const days = Math.floor(delta / 86400); // Number of seconds in a day (24 * 60 * 60)
          delta -= days * 86400; // Subtract the days in seconds

          const hours = Math.floor(delta / 3600) % 24; // Number of seconds in an hour (60 * 60)
          delta -= hours * 3600; // Subtract the hours in seconds

          const minutes = Math.floor(delta / 60) % 60; // Number of seconds in a minute
          delta -= minutes * 60; // Subtract the minutes in seconds

          const seconds = Math.floor(delta % 60); // Remaining seconds

          return {
               days: days,
               hours: hours,
               minutes: minutes,
               seconds: seconds
          };
     }

     function saleTime() {
          const startDate = new Date();
          const endDate = new Date(1766639337832 + (1000 * 60 * 60 * 24 * 4));
          const difference = saleTimer(startDate, endDate);


          if (difference.days < 10) { $(".days span").html('0' + difference.days) } else { $(".days span").html(difference.days.toString()) }
          if (difference.hours < 10) { $(".hours span").html('0' + difference.hours) } else { $(".hours span").html(difference.hours.toString()) }
          if (difference.minutes < 10) { $(".mins span").html('0' + difference.minutes) } else { $(".mins span").html(difference.minutes.toString()) }
          if (difference.seconds < 10) { $(".secs span").html('0' + difference.seconds) } else { $(".secs span").html(difference.seconds.toString()) }

     }

     // --- Example Usage ---
     saleTime();
     setInterval(saleTime, 1000);


     $("header form input").on("input", function () {
          const item = $(this).val();
          const searchList = $("header #searchlist");

          searchList.empty();

          if (typeof item === "string" && item.length >= 3) {
               fetch(`/api/search?product=${item}`)
                    .then(res => res.json())
                    .then(data => {

                         data.forEach((elem, ind) => {
                              searchList.append($('<option>').text(elem.name));
                         });

                    })
                    .catch(error => console.warn(error));
          }
     });

     async function categoryApi() {
          const x = await fetch("/api/category");
          const y = await x.json();
          y.forEach((elem, ind) => {
               $(".catapi").append(`<div class="col-2 col-t-4 col-p-6"><a href="${elem.slug}" class="cat-item">
                                   <img src="img/category-computer.svg" alt="${elem.slug}" width="56" height="56" loading="lazy" class="img-resp"><h3>${elem.name}</h3></a></div>`)
          });
     }

     categoryApi();

     // productsapi

     async function productsApi() {
          const x = await fetch("/api/products");
          const y = await x.json();

          y.forEach((elem, ind) => {
               $(".productsapi").append(`<div class="col-3">
                              <section class="product-sm">
                                   <div class="product-img">
                                        <div class="discount">-${elem.discount}%</div>
                                        <div class="wishlist"><a href="" class="fa-regular fa-heart"></a></div>
                                        <div class="preview"><a href="" class="fa-regular fa-eye"></a></div>
                                        <img src="${elem.img.thumb}" alt="${elem.name}" width="172" height="152" loading="lazy" class="img-resp">
                                        <a class="addtocart" href="">Add To Cart</a>
                                   </div>
                                   <div class="product-desc">
                                        <h3>${elem.name}</h3>
                                        <p class="price">${elem.mrp - (elem.mrp * elem.discount / 100)} <del>${elem.mrp}</del></p>
                                        <p class="rating">
                                             <span class="star-full">&starf;</span>
                                             <span class="star-full">&starf;</span>
                                             <span class="star-full">&starf;</span>
                                             <span class="star-full">&starf;</span>
                                             <span class="star">&starf;</span>
                                             <b>${elem.ratings}</b>
                                        </p>
                                   </div>
                              </section>
                         </div>`)
          })
     }

     productsApi();


});