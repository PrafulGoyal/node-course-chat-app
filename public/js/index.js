var socket = io();


socket.on('connect', function () {
console.log('connected to server');

});

socket.on('disconnect', function()  {
console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  $('#messages').append(html);
  // var li = $('<li></li>');
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);
  // $('#messages').append(li);
});
socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#location-message-template').html();
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });
  $('#messages').append(html);
//   var li = $('<li></li>');
//   var a = $('<a>My Current Location</a>');
//   li.text(`${message.from} ${formattedTime}: `);
//   a.attr({
//     'href':  message.url,
//     "target": "_blank"
// });
//   li.append(a);
//   $('#messages').append(li);
});

$(document).ready(function () {
  $('#message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
      from: 'User',
      text: $('[name=message]').val()
    }, function () {
       $('[name=message]').val('');
    });
  });
});

var locationButton = $('#send-location');
locationButton.on('click', function () {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }
  locationButton.attr('disabled', 'disabled').text('Send location ...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('unable to fetch location');
  });
});
