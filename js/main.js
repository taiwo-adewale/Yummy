document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
    * Sticky header on scroll
    */
  const selectHeader = document.querySelector('#navbar');
  if (selectHeader) {
    document.addEventListener('scroll', () => {
      if(window.scrollY > 100) {
        selectHeader.classList.remove('py-lg-20')
        selectHeader.classList.add('py-lg-3')
        selectHeader.classList.add('sticked')
      } else {
        selectHeader.classList.remove('sticked')
        selectHeader.classList.remove('py-lg-3')
        selectHeader.classList.add('py-lg-20')
      }
    });
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  var myOffcanvas = document.querySelector('.offcanvas');
  var bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);

  let navbarlinks = document.querySelectorAll('.offcanvas a');

  navbarlinks.forEach(navbarlink => {
    navbarlink.addEventListener('click', (e) => {
      if(document.querySelector('.offcanvas.show')) {
        e.preventDefault();
        myOffcanvas.style.transition = 'none';
        location.hash = ""
        bsOffcanvas.toggle();
        setTimeout(scrollToHash, 50);

        function scrollToHash() {
          location.hash = navbarlink.hash;
        }
      }

      myOffcanvas.style.transition = 'transform 0.3s ease-in-out';
    })
  })

  /**
   * Lazy loading Images with Intersection Observer
   */
  let lazyImages = [].slice.call(document.querySelectorAll('.lazy'))

  let lazyImageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        let lazyImage = entry.target;
        lazyImage.src = lazyImage.dataset.src;
        lazyImage.classList.remove('lazy');
        lazyImageObserver.unobserve(lazyImage);
      }
    })
  },
  {
    rootMargin: "250px"
  })

  lazyImages.forEach(lazyImage => {
    lazyImageObserver.observe(lazyImage);
  })

  /**
   * Events Carousel
   */
  var swiper = new Swiper(".events-slider", {
    speed: 1000,
    loop: true,
    slidesPerView: "auto",
    spaceBetween: 30,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      250: {
        slidesPerView: 1,
      },

      992: {
        slidesPerView: 3,
      }
    }
  });

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    const togglescrollTop = function() {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
    window.addEventListener('load', togglescrollTop);
    document.addEventListener('scroll', togglescrollTop);
    scrollTop.addEventListener('click', window.scrollTo({
      top: 0,
      behavior: 'smooth'
    }));
  }

  /**
   * Initialize AOS
   */
  AOS.init({
    offset: 50,
    duration: 500,
    easing: 'ease-in-quad',
    delay: 0,
    once: true  ,
  });

  /**
   * Form validation
   */
  let contactForm = document.forms['contactForm'];
  let reservationForm = document.forms['reservationForm'];

  contactForm.addEventListener('submit', submitForm);
  reservationForm.addEventListener('submit', submitForm);
  

  /**
   * Form regexs
   */
   const nameRegex = /^[a-zA-z]+([\s][a-zA-Z]+)*$/;
   const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
   const phoneRegex = /^[0-9\-\(\)\/\+\s]*$/;
   const dateRegex = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
   const timeRegex = /^(0?[1-9]|1[0-2]):([0-5]\d)\s?((?:A|P)\.?M\.?)$/i;
   const messageRegex = /^[-@.\/#&+\w\s]*$/;

  /**
     * Form functions
     */

  let hasError = false;

  // Function that runs as soon as you submit the form
  function submitForm(e) {
    e.preventDefault();
    hasError = false;
    const submitBtn = e.target.querySelector('button[type=submit]');

    submitBtn.setAttribute('disabled', '');
    submitBtn.querySelector('.text').classList.add('d-none');
    submitBtn.querySelector('.spinner-border').classList.remove('d-none');

    validateForm(e);
  }

  // function that sets the error messages
  const setError = (element, message) => {
    const formGroup = element.parentElement;
    const errorDisplay = formGroup.querySelector('.error-message');

    errorDisplay.innerHTML = '<i class="bi bi-exclamation-circle-fill mx-1"></i>' + message;
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    hasError = true;
  }

  // function that shows if you filled a field with the right type of information
  const setSuccess = element => {
    const formGroup = element.parentElement;
    const errorDisplay = formGroup.querySelector('.error-message');

    errorDisplay.innerHTML = '';
    formGroup.classList.add('success');
    formGroup.classList.remove('error');
  }

  // validate form function
  const validateForm = (e) => {
    const form = e.target;
    const submitBtn = e.target.querySelector('button[type=submit]');

    const name = form['name'];
    const email = form['email'];
    const subject = form['subject'];
    const phone = form['phone'];
    const date = form['date'];
    const time = form['time'];
    const people = form['people'];
    const message = form['message'];

    if (name.value === '') {
      setError(name, 'Name cannot be empty');
    } else if (!name.value.match(nameRegex)) {
      setError(name, 'Name can only contain alphabets and spaces in between words');
    } else {
      setSuccess(name);
    }

    if (email.value === '') {
      setError(email, 'Email cannot be empty');
    } else if (!email.value.match(emailRegex)) {
      setError(email, 'Invalid email format');
    } else {
      setSuccess(email);
    }

    if(subject) {
      if (subject.value === '') {
        setError(subject, 'Subject cannot be empty');
      } else if (!subject.value.match(messageRegex)) {
        setError(subject, 'Subject can only contain alphanumeric characters and these characters - @ . # + &');
      } else {
        setSuccess(subject);
      }
    }

    if(phone) {
      if (phone.value === '') {
        setError(phone, 'Phone number cannot be empty');
      } else if (!phone.value.match(phoneRegex)) {
        setError(phone, 'Invalid phone number');
      } else {
        setSuccess(phone);
      }
    }

    if(date) {
      if (date.value === '') {
        setError(date, 'Date cannot be empty');
      } else if (!date.value.match(dateRegex)) {
        setError(date, 'Date can be in either dd/mm/yyyy, dd-mm-yyyy or dd.mm.yyyy format');
      } else {
        setSuccess(date);
      }
    }

    if(time) {
      if (time.value === '') {
        setError(time, 'Time cannot be empty');
      } else if (!time.value.match(timeRegex)) {
        setError(time, 'Time must be in 12hour format with either am or pm eg 1:30pm or 4:05am');
      } else {
        setSuccess(time);
      }
    }

    if(people) {
      if (people.value === '') {
        setError(people, 'Number of people cannot be empty');
      } else if (!Number.isInteger(parseInt(people.value))) {
        setError(people, "Number of people must be an integer");
      } else if (parseInt(people.value) < 1) {
        setError(people, "Number of people must be greater than 0");
      } else {
        setSuccess(people);
      }
    }

    if (message.value === '') {
      setError(message, 'Message cannot be empty');
    } else if (!message.value.match(messageRegex)) {
      setError(message, 'Message can only contain alphanumeric characters and these characters - @ . # + &');
    } else {
      setSuccess(message);
    }    


    // if there are errors in the form
    if(hasError) {
      submitBtn.removeAttribute('disabled');
      submitBtn.querySelector('.text').classList.remove('d-none');
      submitBtn.querySelector('.spinner-border').classList.add('d-none');
    } else {

      // if there are no errors in the form, send information to server side for a recheck
      /*
      let data = new FormData(form);

      fetch('form_validator.php', {
        method: 'POST',
        body: data,
      })
      .then(res => res.json())
      .then(data => {

        // looping through the response from the php page (its in object format)
        if(Object.keys(data).length !== 0) {

          // check if a field exists, then set either error or success 
          if(data.name) {
            setError(name, data.name)
          } else{
            setSuccess(name)
          }

          if(data.email) {
            setError(email, data.email)
          } else{
            setSuccess(email)
          }

          if(data.subject) {
            setError(subject, data.subject)
          } else{
            if(subject) {
              setSuccess(subject);
            }
          }

          if(data.phone) {
            setError(phone, data.phone)
          } else{
            if(phone) {
              setSuccess(phone);
            }
          }

          if(data.date) {
            setError(date, data.date)
          } else{
            if(date) {
              setSuccess(date);
            }
          }

          if(data.time) {
            setError(time, data.time)
          } else{
            if(time) {
              setSuccess(time);
            }
          }

          if(data.people) {
            setError(people, data.people)
          } else{
            if(people) {
              setSuccess(people);
            }
          }

          if(data.message) {
            setError(message, data.message)
          } else{
            setSuccess(message);
          }

          submitBtn.removeAttribute('disabled');
          submitBtn.querySelector('.text').classList.remove('d-none');
          submitBtn.querySelector('.spinner-border').classList.add('d-none');

        } else {

          //reset form
          form.reset()

          let inputCont = form.querySelectorAll('.form-group');
          let errorMsg = form.querySelectorAll('.error-message');

          inputCont.forEach(cont => {
            cont.classList.remove('success');
            cont.classList.remove('error');
          })

          errorMsg.forEach(msg => {
            msg.innerHTML = '';
          })

          submitBtn.removeAttribute('disabled');
          submitBtn.querySelector('.text').classList.remove('d-none');
          submitBtn.querySelector('.spinner-border').classList.add('d-none');

          // show success message
          form.querySelector('.success-message').classList.remove('d-none');

        }

      })
      .catch(err => console.log(err)) */

      //show success message without server side check
      form.reset()

      let inputCont = form.querySelectorAll('.form-group');
      let errorMsg = form.querySelectorAll('.error-message');

      inputCont.forEach(cont => {
        cont.classList.remove('success');
        cont.classList.remove('error');
      })

      errorMsg.forEach(msg => {
        msg.innerHTML = '';
      })

      submitBtn.removeAttribute('disabled');
      submitBtn.querySelector('.text').classList.remove('d-none');
      submitBtn.querySelector('.spinner-border').classList.add('d-none');

      // show success message
      form.querySelector('.success-message').classList.remove('d-none');
    }
  }
  
});
