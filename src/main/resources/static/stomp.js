const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/stomp/chats'
});

stompClient.onConnect = (frame) => {
    setConnected(true);
    showChatrooms();
    stompClient.subscribe('/sub/chats/news',
        (chatMessage) => {
            toggleNewMessageIcon(JSON.parse(chatMessage.body), true);
        });
    console.log('Connected: ' + frame);
};

function toggleNewMessageIcon(chatroomId, toggle) {
    if (toggle) {
        $("#new_" + chatroomId).show();
    } else {
        $("#new_" + chatroomId).hide();
    }
}

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    $("#create").prop("disabled", !connected);
}

function connect() {
    stompClient.activate();
}

function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

function sendMessage() {
    let chatroomId = $("#chatroom-id").val();
    stompClient.publish({
        destination: "/pub/chats/" + chatroomId,
        body: JSON.stringify(
            {'message': $("#message").val()})
    });
    $("#message").val("")
}

function createChatroom() {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/chats?title=' + $("#chatroom-title").val(),
        success: function (data) {
            console.log('data: ', data);
            showChatrooms();
            enterChatroom(data.id, true);
        },
        error: function (request, status, error) {
            console.log('request: ', request);
            console.log('error: ', error);
        },
    })
}

function showChatrooms() {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: '/chats',
        success: function (data) {
            console.log('data: ', data);
            renderChatrooms(data);
        },
        error: function (request, status, error) {
            console.log('request: ', request);
            console.log('error: ', error);
        },
    })
}

function renderChatrooms(chatrooms) {
    $("#chatroom-list").html("");
    for (let i = 0; i < chatrooms.length; i++) {
        $("#chatroom-list").append(
            "<tr onclick='joinChatroom(" + chatrooms[i].id + ")'><td>"
            + chatrooms[i].id + "</td><td>" + chatrooms[i].title
            + "<img src='new.png' id='new_" + chatrooms[i].id + "' style='display: "
            + getDisplayValue(chatrooms[i].hasNewMessage) + "'/></td><td>"
            + chatrooms[i].memberCount + "</td><td>" + chatrooms[i].createdAt
            + "</td></tr>"
        );
    }
}

function getDisplayValue(hasNewMessage) {
    if (hasNewMessage) {
        return "inline";
    }

    return "none";
}

let subscription;

function enterChatroom(chatroomId, newMember) {
    $("#chatroom-id").val(chatroomId);
    $("#messages").html("");
    showMessages(chatroomId);
    $("#conversation").show();
    $("#send").prop("disabled", false);
    $("#leave").prop("disabled", false);
    toggleNewMessageIcon(chatroomId, false);

    if (subscription != undefined) {
        subscription.unsubscribe();
    }

    subscription = stompClient.subscribe('/sub/chats/' + chatroomId,
        (chatMessage) => {
            showMessage(JSON.parse(chatMessage.body));
        });

    if (newMember) {
        stompClient.publish({
            destination: "/pub/chats/" + chatroomId,
            body: JSON.stringify(
                {'message': "님이 방에 들어왔습니다."})
        })
    }
}

function showMessages(chatroomId) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: '/chats/' + chatroomId + '/messages',
        success: function (data) {
            console.log('data: ', data);
            for (let i = 0; i < data.length; i++) {
                showMessage(data[i]);
            }
        },
        error: function (request, status, error) {
            console.log('request: ', request);
            console.log('error: ', error);
        },
    })
}

function showMessage(chatMessage) {
    $("#messages").append(
        "<tr><td>" + chatMessage.sender + " : " + chatMessage.message
        + "</td></tr>");
}

function joinChatroom(chatroomId) {
    let currentChatroomId = $("#chatroom-id").val();

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/chats/' + chatroomId + getRequestParam(currentChatroomId),
        success: function (data) {
            console.log('data: ', data);
            enterChatroom(chatroomId, data);
        },
        error: function (request, status, error) {
            console.log('request: ', request);
            console.log('error: ', error);
        },
    })
}

function getRequestParam(currentChatroomId) {
    if (currentChatroomId == "") {
        return "";
    }

    return "?currentChatroomId=" + currentChatroomId;
}

function leaveChatroom() {
    let chatroomId = $("#chatroom-id").val();
    $.ajax({
        type: 'DELETE',
        dataType: 'json',
        url: '/chats/' + chatroomId,
        success: function (data) {
            console.log('data: ', data);
            showChatrooms();
            exitChatroom(chatroomId);
        },
        error: function (request, status, error) {
            console.log('request: ', request);
            console.log('error: ', error);
        },
    })
}

function exitChatroom(chatroomId) {
    $("#chatroom-id").val("");
    $("#conversation").hide();
    $("#send").prop("disabled", true);
    $("#leave").prop("disabled", true);
}

$(function () {
    $("form").on('submit', (e) => e.preventDefault());
    $("#connect").click(() => connect());
    $("#disconnect").click(() => disconnect());
    $("#create").click(() => createChatroom());
    $("#leave").click(() => leaveChatroom());
    $("#send").click(() => sendMessage());
});