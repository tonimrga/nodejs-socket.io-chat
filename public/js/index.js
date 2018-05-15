var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function() {
  console.log('Disconnected from server.');
});

socket.on('newMessage', function(message) {
  console.log('new message.', message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#poruke').append(li);
});

socket.on('newMessageLocation', function(message) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');


  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);

  jQuery('#poruke').append(li);
});


jQuery('#message-form').on('submit', function(e){
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User: ',
    text: jQuery('[name=message]').val()
  }, function () {
    jQuery('[name=message]').val('')
  })
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser.')
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position) {
      locationButton.removeAttr('disabled').text("Send location");

      socket.emit('createLocation', {
         latitude: position.coords.latitude,
         longitude: position.coords.longitude
      });
    }, function () {
      locationButton.removeAttr('disabled').text("Send location");
      alert('Unable to fetch location.');
    });
});
