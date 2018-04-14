$(document).ready(function () {

    // Habilita loading
    $("#loading").css("display", "block");

    // Disabilita formulario
    $("#formSelectOlt").css("display", "none");

    $.ajax({
        url: "http://10.40.198.168:7171/customerAPI/certification/ontsDisp",
        data: { "parameter": "1630144903", "executor": "G0034481", "system": null, "paramType": null, "requestDate": null },
        dataType: "json",
        beforeSend: function () {
            alert("Fazendo Ajax");
        },
        success: function (result) {

            console.log(result);
            
            // Desabilita loading
            $("#loading").css("display", "none");

            // Habilita formulario
            $("#formSelectOlt").css("display", "block");
        }
    });

    $("#assoc_id").click(function () {

        // Faz o ajax passando as informações para associar...
        // $("#formSelectOlt").css("display", "none");
        // $("#loading").css("display", "block");


    });

});