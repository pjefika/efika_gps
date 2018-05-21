$(document).ready(function () {
    // http://10.40.195.81/efika_gps/pages/wificonf/wifichannel.html?instancia=123456789
    // Variaveis do sistema
    var instancia;
    var eqplist;
    var eqpselected;

    var channelList;
    var channelinfo;
    var selectedchannel;

    getInstancia();

    $("#setchannel_1").click(function () {
        getSelectedValue(1);
        setChannel();
    });

    $("#setchannel_2").click(function () {
        getSelectedValue(2);
        setChannel();
    });

    function setChannel() {
        setMensagensOptions("none", null, null);
        if (selectedchannel === undefined || selectedchannel == "") {
            setMensagensOptions("block", "Por favor preencha todos os campos.", "msg-error");
        } else {
            setFormOption("none");
            setLoadingOptions("block", "Aguarde...");
            setTimeout(function () {
                setLoadingOptions("none", null);
                setMensagensOptions("block", "Configurações no modem " + eqpselected.serial + " e " + + "para o canal" + selectedchannel + " realizada com sucesso", "msg-success"); // Success msg
                setFormOption("block");
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
                mountCommand();
            } else {
                setMensagensOptions("block", "A instância inserida é inválida", "msg-error");
                setFormOption("none");
            }
        }
    }

    function getInstancia() {
        if (window.location.href) {
            var link = window.location.href;
            var split = link.split("=");
            if (split[1]) {
                instancia = split[1];
                setLoadingOptions("block", "Aguarde buscando equipamentos...");
                setFormOption("none");
                setMensagensOptions("none", null, null);
                setChannelOption("none");
                getListEeqp();
            } else {
                setMensagensOptions("block", "A instância inserida é inválida", "msg-error");
                setFormOption("none");
            }
        }
    }

    function getListEeqp() {
        setTimeout(function () {
            eqplist = [
                { serial: "11111", guid: 1 },
                { serial: "22222", guid: 2 },
                { serial: "333333", guid: 3 }
            ];
            for (var index = 0; index < eqplist.length; index++) {
                var eqp = eqplist[index];
                $("#eqpListbody:last-child").append("<tr> <td> " + eqp.serial + " </td> <td> <button class='btn btn-blue btn-margin-bottom' type='buttton' id='view" + index + "' >Visualizar</button> </td> </tr>");
            }
            setLoadingOptions("none", null);
            setFormOption("block");
            mountclickineqp();
        }, 1000);
    }

    function mountclickineqp() {
        $("tr").each(function (index) {
            $("#view" + index).click(function () {
                setLoadingOptions("block", "Aguarde buscando informações...");
                setFormOption("none");
                setChannelOption("none");
                setMensagensOptions("none", null, null);
                mountchannelconfs(index);
            });
        });
    }

    function mountchannelconfs(i) {
        eqpselected = eqplist[i];
        setTimeout(function () {
            channelList = [
                { channel: 5, ssid: "2.4GHZ" },
                { channel: 3, ssid: "5GHZ" }
            ];
            document.getElementById("channel_1").value = channelList[0].channel;
            document.getElementById("channel_2").value = channelList[1].channel;
            setLoadingOptions("none", null);
            setFormOption("block");
            setChannelOption("block");
        }, 1000);
    }

    /**
    * Importar para todos os scripts e Manter o padrão \/
    * 
    */
    function setFormOption(show) {
        $("#form").css("display", show);
    }

    function setChannelOption(show) {
        $("#channelconfs").css("display", show);
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
        channelinfo = channelList[i - 1];
        selectedchannel = $("#channel_" + i).val();
    }
});