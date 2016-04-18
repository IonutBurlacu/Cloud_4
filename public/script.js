$(document).ready(function(){

    var socket = io.connect('https://websocketchat-1280.appspot.com');

    $('.chat-box input').on('keypress', function(event){
        if(event.which == 13){
            socket.emit('message', {message: $(this).val()});
            $('.chat').append('<div class="right">'+$(this).val()+'</div>');
            $(this).val('');
        }
    });

    socket.on('message', function(content){
        $('.chat').append('<div class="left">'+content.message+'</div>');
    });

});