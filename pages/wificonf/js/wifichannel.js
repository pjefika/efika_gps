$(document).ready(function () {
    // http://10.40.195.81/efika_gps/pages/wificonf/wifichannel.html?instancia=123456789
    // Variaveis do sistema
    var instancia;
    var _data;

    var channel;

    getInstancia();

    $("#setchannel").click(function () {
        setChannel();
    });

    $(document).keypress(function (e) {
        if (e.which == 13) {
            setChannel();
        }
    });

    function setChannel() {
        getSelectedValue();
        if (channel === undefined || channel == "") {
            setMensagensOptions("block", "Por favor preencha todos os campos.", "msg-error");
        } else {
            setFormOption("none");
            setLoadingOptions("block", "Aguarde...");
            setTimeout(function () {
                setLoadingOptions("none", null);
                setMensagensOptions("block", "Troca para o canal " + channel + " realizada com sucesso", "msg-success"); // Success msg
            }, 1000);
        }
    }

    /**
    * Importar para todos os scripts e Manter o padrão \/
    * 
    */
    function getInstancia() {
        if (window.location.href) {
            var link = window.location.href;
            var split = link.split("=");
            if (split[1]) {
                instancia = split[1];
                setLoadingOptions("block", "Aguarde...");
                setFormOption("none");
                setMensagensOptions("none", null, null);
                /**
                * Monta o obj de acordo com o caso de uso... 
                */
                mountCommand();
            } else {
                setMensagensOptions("block", "A instância inserida é inválida", "msg-error");
                setFormOption("none");
            }
        }
    }

    function mountCommand() {
        _data = { "parameter": instancia, "executor": "G0034481", "system": null, "paramType": null, "requestDate": null };
        setLoadingOptions("none", null);
        setFormOption("block");
    }

    function setFormOption(show) {
        $("#form").css("display", show);
    }

    function setLoadingOptions(show, msg) {
        $("#loading").css("display", show);
        $("#loadingMensagem").text(msg);
    }

    function setMensagensOptions(show, msg, type) {
        $("#mensagem").removeClass();
        $("#mensagem").addClass(type)
        $("#mensagem").css("display", show);
        $("#textoMensagem").text(msg);
    }

    function getSelectedValue() {
        channel = $("#channel").val();
    }
});