$(document).ready(function () {
    // http://10.40.195.81/efika_gps/pages/wificonf/wifichannel.html?instancia=123456789
    // Variaveis do sistema
    var instancia;
    var _data;

    var channel;

    var channelList;

    getInstancia();

    $("#setchannel_0").click(function () {
        setChannel(0);
    });

    $("#setchannel_1").click(function () {
        setChannel(1);
    });

    function setChannel(i) {
        setMensagensOptions("none", null, null);
        getSelectedValue(i);
        var ochannel = channelList[i];
        ochannel.channel = channel;
        if (ochannel.channel === undefined || ochannel.channel == "") {
            setMensagensOptions("block", "Por favor preencha todos os campos.", "msg-error");
        } else {
            setFormOption("none");
            setLoadingOptions("block", "Aguarde...");
            setTimeout(function () {
                setLoadingOptions("none", null);
                setMensagensOptions("block", "Troca da rede " + ochannel.ssid + " para o canal " + ochannel.channel + " realizada com sucesso", "msg-success"); // Success msg
                setFormOption("block");
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
        getChannelList();
    }

    function getChannelList() {
        channelList = [{ channel: "1", ssid: "rede2.4Ghz" },
        { channel: "5", ssid: "rede5Ghz" }];
        document.getElementById("channel_0").value = channelList[0].channel;
        document.getElementById("channel_1").value = channelList[1].channel;
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
        channel = $("#channel_" + i).val();
    }
});