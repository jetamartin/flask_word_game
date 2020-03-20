$(function() {

  $("h1").on("click", function(evt) {
    console.log("Hello");
  })

  $("#word_form").on("submit", function(evt) { 
    evt.preventDefault();
    console.log("submitted");
    })
})
