
//global variables used throughout the functions ( ex: moveLeft)
let currentSlide = 0;
let numberOfUsers = 12;

//on 'dom content loaded' perform ajax request with parameters for selected response
$(function() {
  exclude = "gender,login.username,registered,phone,id,nat";
  english = "au,ca,dk,es,fi,fr,gb,ie,nl,nz,us"
  $.ajax({
      url: 'https://randomuser.me/api/?results='+numberOfUsers+'&exc='+exclude+'&nat='+english,
      dataType: 'json',
      success: function(data) {
        users = data.results;
        orignal = data.results;
        renderPage(users);
}
});
});

//setup before functions
var typingTimer;                //timer identifier
var doneTypingInterval = 500;  //time in ms (.5 seconds)

//on keyup, start the countdown to execute search function
$('.search').keyup(function(){
    clearTimeout(typingTimer);
    let input = $('.search').val();
    //if user wants original list (delete current search input)
    if(input === ""){
      $('.container-fluid > div').remove();
      $('#lightbox').remove();
      numberOfUsers = orignal.length;
      renderPage(orignal);
    }
    else if ($('.search').val()) {
        typingTimer = setTimeout(searchUsers($('.search').val()), doneTypingInterval);
    }
});

//go through array obj where name or email matches search input
function searchUsers(input){
  var finalArray = [];
  userAdded = [];
  for(var i = 0; i < orignal.length; i++){
    if(((((users[i].name.first).indexOf(input) > -1) || ((users[i].name.last).indexOf(input) > -1) || ((users[i].login.username).indexOf(input) > -1)) && userAdded.indexOf(i) < 0)) {
      finalArray.push(users[i]);
      userAdded.push(i);
    }
  }
  $('.container-fluid > div').remove();
  $('#lightbox').remove();
  numberOfUsers = finalArray.length;
  renderPage(finalArray);
}

//once ajax or searchUsers has obj list ready to go render the front page list for employee directory
function renderPage(users){
  let string = "";
  //loop through each user creating the box layout in a grid format
  $.each(users, function(index, user) { //create the modal view here as well and add function for div
      string += "<div class='col-sm-4 user' data-slide="+index+" onClick=\"handleClick(this)\">";
      string += "<img class='front-page-img' src="+user.picture.medium+" alt='thumb pic' data-slide="+index+">";
      string += "<h5 data-slide="+index+">"+user.name.first+" "+user.name.last+"</h5>";
      string += "<p data-slide="+index+">"+user.email+"</p>";
      string += "<p data-slide="+index+">"+user.location.city+"</p>";
      string += "</div>";
    });

  $('h4').after(string);
  //create lightbox used for modal view
  $('div.user').on('click', function(event) {
    let curr = (event.target);
    //get current slide number from user click
    let slideNum = $(curr).attr('data-slide');
    //tests of lightbox div is created
    if ($('#lightbox').length > 0) {
      $('#lightbox').fadeIn('400');
    } else {
      //only going to run once during initial click
      let lightbox =
          '<div id="lightbox">' +
          '<div id="background"></div>' +
          '<p>Click to close</p>' +
          '<div id="slideshow">' +
          '<ul></ul>' +
          '<div class="nav">' +
          '<a href="#prev" class="prev slide-nav" onClick="moveLeft(this)">prev</a>' +
          '<a href="#next" class="next slide-nav" onClick="moveRight(this)">next</a>' +
          '</div>' +
          '</div>' +
          '</div>';
          //attach lightbox div to end of body
          $('body').append(lightbox);
          let size = 0;
          //create the acutal modal view for each user within the lightbox as one of the ul item
          $('.container-fluid').find('.user').each(function(i, el) {
            $('#slideshow ul').append(
            "<div>" +
            "<img class='modal-img' src="+users[i].picture.large+" alt='thumb pic' data-slide="+i+">" +
            "<p data-slide="+i+">"+users[i].name.first+" "+users[i].name.last+"</p>" +
            "<p data-slide="+i+">"+users[i].login.username+"</p>" +
            "<p data-slide="+i+">"+users[i].email+"</p>" +
            "<hr>" +
            "<p data-slide="+i+">"+users[i].cell+"</p>" +
            "<p data-slide="+i+">"+users[i].location.street+" "+users[i].location.city+", "+users[i].location.state+" "+users[i].location.postcode+"</p>" +
            "<p data-slide="+i+">Birthday: "+users[i].dob.substr(0,10)+"</p>"+
            "</div>"
          );
          size++;
          });
    }
    //only show the slide number that user has clicked.
    $('#slideshow ul > div').hide();
    $('#slideshow ul > div:eq('+slideNum +')').show();

    //dismiss the modal view when user clicks anywhere outside the modal view
    $('#background').on('click', function(event) {
      $('#lightbox').fadeOut(300);
    }); //end of lightbox exit function


    // toggle the navigation (prev and next) when mouse enters
    $('body').on(
      { mouseenter: function() {
        $('.nav').fadeIn(300);
      }, mouseleave: function() {
        $('.nav').fadeOut(300);
      }
      },'#slideshow');

      let currentSlide = slideNum; //assign user clicked slide number to var slideNumber
  });
}
//update current slide global variable
function handleClick(event) {
  //console.log( $(event).attr('data-slide'));
  currentSlide = Number($(event).attr('data-slide'));
  // console.log("setting the currentSlide to ", currentSlide)
}
//called when prev nav button is  clicked
function moveLeft(event) {
  console.log("moveleft");
  let destination = currentSlide - 1;
  //if user clicks previous on first modal view user then it will wrap around to the last
  if (destination < 0) {
    destination = numberOfUsers-1;
  }

  $('#slideshow ul > div:eq(' + currentSlide + ')').fadeOut(750);
  currentSlide = destination;
  $('#slideshow ul > div:eq(' + destination + ')').fadeIn(750);
}

//called when next nav button is clicked
function moveRight(event) {

  let destination = currentSlide + 1;
//if modal view is the last one then user will be transfered the first one
  if (destination > (numberOfUsers-1)) {
    destination = 0;
  }
  $('#slideshow ul > div:eq(' + currentSlide + ')').fadeOut(750);
  currentSlide = destination;
  $('#slideshow ul > div:eq(' + destination + ')').fadeIn(750);
}
