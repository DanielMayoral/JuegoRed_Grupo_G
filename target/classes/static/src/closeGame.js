import { user } from "./main.js";

window.onbeforeunload = function(){
    $.ajax ({
        method: "PUT",
        url: "http://localhost:8080/logout",
        data: JSON.stringify(user),
        processData: false,
        headers: { "Content-type": "application/json" }
    });
 }
