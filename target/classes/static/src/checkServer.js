$(document).ready(function() {
    function checkServerConection(){
        $.ajax ({
            url: "http://localhost:8080/checkServer"
        }).fail(function() {
            window.alert("EServidor desconectado");
        })
    }
    setInterval(checkServerConection, 3000);
});