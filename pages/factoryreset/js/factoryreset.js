$(document).ready(function () {
    // http://10.40.195.81/efika_gps/pages/reboot/reboot.html?instancia=123456789
    // Variaveis do sistema

    var link = "http://10.129.166.125:7178/efikaServiceAPI/executar/acaoDetalhada";
    // var link = "http://10.40.196.171:7178/efikaServiceAPI/executar/acaoDetalhada";

    var instancia;
    var eqplist;
    var ablemock = true; // Habilitar e desabilitar mock

    getInstancia();

    function getInstancia() {
        hideAllTags();
        if (window.location.href) {
            var link = window.location.href;
            var split = link.split("=");
            if (split[1]) {
                instancia = split[1];
                setLoadingOptions("block", "Aguarde buscando Equipamentos...");
                doGetDevice();
            } else {
                setMensagensOptions("block", "A instância inserida é inválida", "msg-error");
            }
        }
    }

    function doGetDevice() {
        if (ablemock) {
            getDevicesMock();
        } else {
            getDevices();
        }
    }

    function getDevices() {
        var ins = instancia.split("?");
        var _data = JSON.stringify({ "instancia": ins[0], "parametro": null, "execucao": "SEEK_DEVICES" });
        request = new XMLHttpRequest();
        request.open("POST", link);
        request.setRequestHeader("Content-Type", "text/plain");
        request.send(_data);
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                resultado = JSON.parse(request.responseText);
                hideAllTags();
                if (request.status === 200) {
                    if (resultado.valid.length > 0) {
                        eqplist = resultado.valid;
                        mountTableDevices();
                    } else {
                        setMensagensOptions("block", "Não foram encontrados equipamentos ativos", "msg-error");
                    }
                } else {
                    if (resultado.localizedMessage) {
                        setMensagensOptions("block", resultado.localizedMessage, "msg-error");
                    } else {
                        setMensagensOptions("block", "Erro: " + request.status, "msg-error");
                    }
                }
            }
        }
    }

    function getDevicesMock() {
        hideAllTags();
        var eqpmock = [
            {
                activated: true,
                deviceGUID: 321,
                deviceId: {
                    serialNumber: "AA0123456789"
                }
            },
            {
                activated: true,
                deviceGUID: 123,
                deviceId: {
                    serialNumber: "AA9876543210"
                }
            }
        ];
        eqplist = eqpmock;
        mountTableDevices();
    }

    function mountTableDevices() {
        for (var index = 0; index < eqplist.length; index++) {
            var eqp = eqplist[index];
            $("#eqpListbody:last-child").append("<tr> <td> " + eqp.deviceId.serialNumber + " </td> <td> <button class='btn btn-blue btn-margin-bottom' type='buttton' id='view" + index + "' >Resetar</button> </td> </tr>");
        }
        setFormOption("block");
        mountButtonView();
    }

    function mountButtonView() {
        $("tr").each(function (index) {
            $("#view" + index).click(function () {
                eqpselected = eqplist[index];
                hideAllTags();
                // console.log("clicou: " + index);
                // Ações especificas de acordo com a função.
                doReset(index);
            });
        });
    }

    function doReset(i) {
        vhideAllTags();
        setLoadingOptions("block", "Aguarde realizando Reset no modem...");
        var ins = instancia.split("?");
        var eqp = eqplist[i];
        var _data = JSON.stringify({ "instancia": ins[0], "parametro": null, "execucao": "FACTORY_RESET_DEVICE" });
        request = new XMLHttpRequest();
        request.open("POST", "http://10.40.196.171:7178/efikaServiceAPI/executar/acaoDetalhada");
        request.setRequestHeader("Content-Type", "text/plain");
        request.send(_data);
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                hideAllTags();
                resultado = JSON.parse(request.responseText);
                if (request.status === 200) {
                    if (resultado.valid.resultado) {
                        setFormOption("block");
                        setMensagensOptions("block", "Reset de Fabrica no equipamento " + eqp.serial + " realizado com sucesso.", "msg-success"); // Success msg
                    } else {
                        setFormOption("block");
                        setMensagensOptions("block", "Não foi possivel realizar o Reset no equipamento " + eqp.serial + " pois está inativo.", "msg-error");
                    }
                } else {
                    setFormOption("block");
                    if (resultado.localizedMessage) {
                        setMensagensOptions("block", resultado.localizedMessage, "msg-error");
                        setFormOption("block");
                    } else {
                        setMensagensOptions("block", "Erro: " + request.status, "msg-error");
                    }
                }
            }
        }
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

    function hideAllTags() {
        setFormOption("none");
        setLoadingOptions("none", null);
        setMensagensOptions("none", null, null);
    }
});