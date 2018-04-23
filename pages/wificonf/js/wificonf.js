$(document).ready(function () {
    // http://10.40.195.81/fabio/efika_gps/pages/wificonf/wificonf.html?instancia=123456
    // Variaveis do sistema
    var instancia;
    var _data;

    var user_pass;

    getInstancia();

    $("#setchannel").click(function () {
        setMensagensOptions("none", null);
        getSelectedValue();
        // console.log(user_pass);
        if (user_pass.ssid == "" && user_pass.password == "" || user_pass.ssid == "") {
            setMensagensOptions("block", "Por favor preencha os campos.");
        } else {
            setFormOption("none");
            setLoadingOptions("block", "Aguarde...");
            setTimeout(function () {
                setLoadingOptions("none", null);
                setMensagensOptions("block", "Configuração realizada com sucesso."); // Success msg
            }, 1000);
        }
    });

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
                setMensagensOptions("none", null);
                /**
                * Monta o obj de acordo com o caso de uso... 
                */
                mountCommand();
            } else {
                setMensagensOptions("block", "A instância inserida é inválida");
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

    function setMensagensOptions(show, msg) {
        $("#mensagem").css("display", show);
        $("#textoMensagem").text(msg);
    }

    function getSelectedValue() {
        user_pass = {
            ssid: $("#input_ssid").val(),
            password: $("#input_password").val()
        }
    }
});