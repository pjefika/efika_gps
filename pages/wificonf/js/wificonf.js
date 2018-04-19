$(document).ready(function () {


    
    /**
    * Importar para todos os scripts e Manter o padrão \/
    * 
    */
    function setFormOption(show) {
        $("#form").css("display", show);
    }

    function setLoadingOptions(show, msg) {
        $("#loading").css("display", show);
        $("#loadingMensagem").text(msg);
    }

    function setMensagensOptions(show, msg) {
        $("#mensagem").css("display", show);
        $("#textoMensagem").text(msg);
    }

    function getSelectedValue() {
        input_ping = $("#input_ping").val();
    }
});