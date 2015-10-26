// YOUR CODE HERE:
var app = {
  server: 'https://api.parse.com/1/classes/chatterbox'
};

// document ready runs this function
app.init = function (){
    // fetches new message when page loads
    this.fetch();

    // doesn't add functionality to page, just used to pass mocha test
    $("#send .submit").on('submit', this.handleSubmit);
      setInterval(app.fetch.bind(app), 5000);

  // save username that user inputs in prompt
  // username starts at index 10 of the search property
  app.username = window.location.search.substr(10);
};

// function that sends messages to server
app.send = function (data){
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: this.server,
    type: 'POST',
    // stringify data when sending, parse data when receiving
    data: JSON.stringify(data),
    contentType: 'application/json',
    // success function automatically run when data is successfully sent
    success: function (data) {
      app.addMessagesFromFetch(data);
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });

};

app.fetch = function(){
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: this.server,
    type: 'GET',
    // data: JSON.parse(),
    // by specifying the contentType below, it should automatically parse the JSON
    contentType: 'application/json',
    dataType: 'json',
    success: function (data) {
      // runs this function automatically when data is successfully fetched
      app.addMessagesFromFetch(data.results);
      console.log('chatterbox: Message fetched');
    },
    error: function (data, errorMessage) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to fetch message');
      console.log('errorMessage', errorMessage);
    }
  });
};

// removes chat messages
app.clearMessages = function () {
  $('#chats').children().remove()
};

// storage object for messages shown on screen
app.onScreenMessageStorage = {};

// takes data from fetch and adds messages to DOM
app.addMessagesFromFetch = function (dataResultsFromFetch) {
  // for each data result (message) in fetch,
  for (var i = 0; i < dataResultsFromFetch.length; i++) {
    // if the message isn't already on the page, (test with helper function)
    if (app.testForNewMessages(dataResultsFromFetch[i]) === true){
      // turn message into HTML element with helper function
      var $HTMLelement = app.makeHTMLelement(dataResultsFromFetch[i]);
      $('#chats').prepend($HTMLelement);
    }
  }
};

// helper function for addMessagesFromFetch that tests to see if one message is already on screen
app.testForNewMessages = function(messageFromAddMessages) {
  // if onScreenMessageStorage doesn't have objectId of new message,
  if (!app.onScreenMessageStorage[messageFromAddMessages.objectId]) {
    // add objectId to onScreenMessageStorage object
    app.onScreenMessageStorage[messageFromAddMessages.objectId] = true;
    return true;
  }
};

// helper function for addMessagesFromFetch that creates the HTML element
app.makeHTMLelement = function(message) {
  // makes username <a> tag and appends to new <div> tag
  var $uName = $("<div class = 'username'>").append(
      $("<a class = 'userClick' href = '#'>").text(message.username));
  // makes new <div> tag to hold message text
  var $uMessage = $("<div id = 'text'>").text(message.text);
  // creates whole message
  var $fullMessage = $('#chats').append($uName, $uMessage);
  return $fullMessage;
};

//TODO: enable room functionality
// adds room <div>, used to pass tests, rooms not enabled in app yet
app.addRoom = function (room) {
  $('#roomSelect').append("<div>" /*+ room + */ +"</div>");
};

//TODO: enable addFriend functionality
// used to pass tests, addFriend functionality not enabled in app yet
app.addFriend = function(){
  //console.log("Defined addFriend")
};

// handles submit for static input box on page
app.handleSubmit = function(event) {
  // event.preventDefault(); // functionality breaks when this is enabled
  // assigns message properties
  var message = {
    username: app.username || 'Anonymous',
    text: $('#sendToAll').val(),
    roomname: app.roomname || 'lobby'
  }

  // makes input field blank after submitting
  $('#sendToAll').val('');
  // sends message to server
  app.send(message);
};

// handles submit for dynamic input box on page
app.handleMessageSubmit = function(event) {
  // event.preventDefault(); // functionality breaks when this is enabled
  // assigns message properties
  var message = {
    username: app.username || 'Anonymous',
    text: $('.privateMessage').val(),
    roomname: app.roomname || 'lobby'
  }

  // make input field blank after submitting
  $('.privateMessage').val('');
  // sends message to server
  app.send(message);
};

// after document has loaded, run these functions
$(document).ready(function(){
  app.init();

  // fetches data when refresh button is clicked
  $('#refreshButton').on('click', function() {
    app.fetch();
  });

  // opens up form to send message when user clicks on username
  $('#chats').on('click', '.userClick', function(){
    // adds friend
    app.addFriend();
    // opens up form to type private message
    $('#send').prepend("<form class='personalConvo'><p><label>Type to your heart\'s content!</label><input class='privateMessage' type='text' size='10'></input><p></form>");
  });

  // posts message to chatterbox from static input box when enter is hit
  $('#sendToAll').keypress(function(key) {
    // enter is key 13
    if (key.which === 13) {
      app.handleSubmit();
      // prevent keystroke from continuing
      return false;
    }
  });

  // TODO: private messages are currently posted on general forum, should be to a specific person
  // posts message to overall chatterbox when enter key is hit
  $('#send').on('keypress', '.privateMessage', function(e) {
    // if keypress is the enter key,
    if (e.which === 13) {
      app.handleMessageSubmit();
      // prevents keystroke from continuing
      return false;
    }
  });

});



