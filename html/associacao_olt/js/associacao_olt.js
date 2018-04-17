$(document).ready(function () {
    var instancia;
    var listaSerial;

    // Habilita loading
    $("#loading").css("display", "block");
    // Disabilita formulario
    $("#formSelectOlt").css("display", "none");

    // Desabilita mensagem
    $("#mensagem").css("display", "none");

    if (window.location.href) {
        var link = window.location.href;
        var split = link.split("=");
        instancia = split[1];
    }
    var paramObj = { "parameter": instancia, "executor": "G0034481", "system": null, "paramType": null, "requestDate": null };

    if (window.XDomainRequest) {
        request = new XDomainRequest();
        request.open("POST", "http://10.40.198.168:7171/customerAPI/certification/ontsDisp");
    } else if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
        request.open("POST", "http://10.40.198.168:7171/customerAPI/certification/ontsDisp");
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    }

    request.send(JSON.stringify(paramObj));
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                listaSerial = JSON.parse(request.responseText);
                var select = document.getElementById("selectOlt");
                for (var index = 0; index < listaSerial.length; index++) {
                    select.options[select.options.length] =
                        new Option(listaSerial[index].serial + " / Slot: " + listaSerial[index].slot + " - Porta: " + listaSerial[index].porta, listaSerial[index].serial);
                }
                // Desaabilita loading
                $("#loading").css("display", "none");
                // Habilita formulario
                $("#formSelectOlt").css("display", "block");
            }
        }
    };

    $("#assoc_id").click(function () {
        // Hide form
        $("#formSelectOlt").css("display", "none");
        // Loading On
        $("#loading").css("display", "block");
        // Get selected option from select
        var selectedOlt = $("#selectOlt").val();
        // Validação do request.
        if (selectedOlt === "") {
            alert("Por favor selecione uma das opções.");
        } else {
            // Request
            // Change to request and modify the msg
            setTimeout(function () {
                $("#loading").css("display", "none"); // Loading Off
                $("#mensagem").css("display", "block"); // Mensagem On
                $("#textoMensagem").text("Selecionado o serial: " + selectedOlt + " & Instancia: " + instancia); // Mount msg in screen
            }, 1000);
        }
    });

});