$(document).ready(function () {
    // http://10.40.195.81/efika_gps/pages/wificonf/wificonf.html?instancia=123456
    // Variaveis do sistema
    var instancia;
    var _data;

    var user_pass;

    var wifilist;

    getInstancia();

    $("#setwificonf_1").click(function () {
        setWifiConf(0);
    });

    $("#setwificonf_2").click(function () {
        setWifiConf(1);
    });

    function setWifiConf(i) {
        var wifi = wifilist[i]
        setMensagensOptions("none", null, null);
        getSelectedValue(i);
        // console.log(user_pass);
        if (wifi.ssid == "" && wifi.password == "" || wifi.ssid == "") {
            setMensagensOptions("block", "Por favor preencha os campos.", "msg-error");
        } else {
            setFormOption("none");
            setLoadingOptions("block", "Aguarde...");
            setTimeout(function () {
                setLoadingOptions("none", null);
                setMensagensOptions("block", "Configuração na rede " + wifi.ssid + " realizada com sucesso.", "msg-success"); // Success msg
                setFormOption("block");
            }, 1000);
        }
    }

    /**
     * Importar para todos os scripts e Manter o padrão \/
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
        getWifiList();
    }


    function getWifiList() {
        wifilist = [{ ssid: "user2.4Ghz", password: "" },
        { ssid: "user5Ghz", password: "" }];
        document.getElementById("input_ssid_1").value = wifilist[0].ssid;
        document.getElementById("input_password_1").value = wifilist[0].password;
        document.getElementById("input_ssid_2").value = wifilist[1].ssid;
        document.getElementById("input_password_2").value = wifilist[1].password;
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

    function getSelectedValue(i) {
        user_pass = {
            ssid: $("#input_ssid_" + i).val(),
            password: $("#input_password_" + i).val()
        }
    }
});