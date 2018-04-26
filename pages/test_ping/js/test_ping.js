$(document).ready(function () {
    // http://10.40.195.81/efika_gps/pages/test_ping/test_ping.html?instancia=1234567890
    // Variaveis do sistema
    var instancia;
    var _data;

    var input_ping;

    getInstancia();

    $("#ping").click(function () {
        pingar();
    });

    $(document).keypress(function (e) {
        if (e.which == 13) {
            pingar();
        }
    });

    function pingar() {
        getSelectedValue();
        console.log(input_ping);

        if (input_ping === undefined || input_ping == null || input_ping == "") {
            setMensagensOptions("block", "Por favor preencha o campo.", "msg-error");
        } else {
            setLoadingOptions("block", "Aguarde...");
            setFormOption("none");
            setMensagensOptions("none", null, null);
            setTimeout(function () {

                setTableResultOptions("block");

                document.getElementById("status").innerHTML = "Complete";
                document.getElementById("tempo").innerHTML = "34";
                document.getElementById("qntS").innerHTML = "4";
                document.getElementById("qntE").innerHTML = "0";
                document.getElementById("endereco").innerHTML = input_ping;
                document.getElementById("repeticoes").innerHTML = "4";

                setLoadingOptions("none", null);
                setMensagensOptions("block", "Ping realizado com sucesso.", "msg-success"); // Success msg
                setFormOption("block")
            }, 1000);
        }
    }

    function getInstancia() {
        if (window.location.href) {
            var link = window.location.href;
            var split = link.split("=");
            if (split[1]) {
                instancia = split[1];
                setLoadingOptions("block", "Aguarde...");
                setFormOption("none");
                setMensagensOptions("none", null, null);
                setTableResultOptions("none");
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

    function setMensagensOptions(show, msg, type) {
        $("#mensagem").removeClass();
        $("#mensagem").addClass(type)
        $("#mensagem").css("display", show);
        $("#textoMensagem").text(msg);
    }

    function setTableResultOptions(show) {
        $("#table_result").css("display", show);
    }

    function getSelectedValue() {
        input_ping = $("#input_ping").val();
    }
});