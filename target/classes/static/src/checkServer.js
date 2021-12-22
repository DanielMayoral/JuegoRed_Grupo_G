$(document).ready(function() {
    function checkServerConection(){
        $.ajax ({
            url: "http://"+location.host+"/checkServer"
        }).fail(function() {
            window.alert("Servidor desconectado");
        })
    }
    setInterval(checkServerConection, 3000);
});