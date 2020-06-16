// Set the date we're counting down to
var countDownDate = new Date("Sept 12, 2020 16:30:00").getTime();
function update_countdown() {

    // Get today's date and time
    var now = new Date().getTime();
  
    // Find the distance between now and the count down date
    var distance = countDownDate - now;
  
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
    // Display the result in the element with id="demo"
    document.getElementById("count-down").innerHTML = `Mariés dans ${days} jour${days > 1 ? 's' : ''} ${hours} heure${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''} ${seconds} seconde${seconds > 1 ? 's' : ''}`;
  
    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(x);
      document.getElementById("count-down").innerHTML = "On se marie maintenant !";
    }
  }
// Initialize count down
update_countdown();
// Update the count down every 1 second
setInterval(update_countdown, 1000);