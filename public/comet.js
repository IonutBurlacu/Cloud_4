$(document).ready(function(){
    var username;
    var timestamp = Date.now();

    $('.username-wrapper form').on('submit', function(e){
        e.preventDefault();
        if($('#username').val() == ""){
            alert("Please insert an username!");
        } else {
            username = $('#username').val();
            $('.username-wrapper').fadeOut(300);
        }
    });

    //get first tweets
    $.get('http://localhost:8080/tweets', function(response){
        for(var i = 0; i < response.tweets.length; i++){
            $('.form').after(
                '<div class="tweet"><h3 class="username">'+
                response.tweets[i].username+
                '</h3><span class="timestamp">'+
                new Date(response.tweets[i].timestamp).toUTCString()+
                '</span><p class="content">'+
                response.tweets[i].content+
                '</p></div>');
        }
    });

    $('.form button').on('click', function(){
        if ($('.form textarea').val() == "") {
            alert("Text can't be empty!");
        } else {
            var content = $('.form textarea').val();
            $.post('http://localhost:8080/comet', {content: content, username: username}, function(response){
                $('.form').after(
                    '<div class="tweet"><h3 class="username">'+
                    username+
                    '</h3><span class="timestamp">'+
                    new Date(response.date).toUTCString()+
                    '</span><p class="content">'+
                    content+
                    '</p></div>');
                $('.form textarea').val('');
            });
        }
    });

    window.setInterval(function(){
        $.get('http://localhost:8080/tweets?timestamp=' + timestamp, function(response){
            if (response.tweets.length > 0) timestamp = Date.now();
            for(var i = 0; i < response.tweets.length; i++){
                if(response.tweets[i].username != username){
                    $('.form').after(
                       '<div class="tweet"><h3 class="username">'+
                       response.tweets[i].username+
                       '</h3><span class="timestamp">'+
                       new Date(response.tweets[i].timestamp).toUTCString()+
                       '</span><p class="content">'+
                       response.tweets[i].content+
                       '</p></div>');
                }
            }
        });
    }, 3000);
});