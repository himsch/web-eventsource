$(function () {
  if (!window.EventSource) {
    alert("No EventSource!");
    return;
  }

  var $chatLog = $("#chat-log");
  var $chatMsg = $("#chat-message");

  var isBlank = function (string) {
    return string == null || string.trim() === "";
  };
  var username;
  while (isBlank(username)) {
    username = prompt("What's your name?");
    if (!isBlank(username)) {
      $("#user-name").html(`<b>${username}</b>`);
    }
  }

  $("#input-form").on("submit", function (e) {
    e.preventDefault();
    $.post("/messages", {
      msg: $chatMsg.val(),
      name: username,
    });
    $chatMsg.val("");
    $chatMsg.focus();
  });

  var addMessage = function (data) {
    var text = "";
    if (!isBlank(data.name)) {
      text = `<strong>${data.name}</strong>`;
    }
    text += data.msg;
    $chatLog.prepend(`<div><span>${text}</span></div>`);
  };

  // EventSource
  var es = new EventSource("/stream");
  es.onopen = function (e) {
    $.post("/users", {
      name: username,
    });
  };
});
