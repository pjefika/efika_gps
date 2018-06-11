$(document).ready(function () {
    // http://10.40.195.81/efika_gps/pages/firmwareupdate/firmwareupdate.html?instancia=123456789
    // Variaveis do sistema

    var link = "http://10.129.166.125:7178/efikaServiceAPI/executar/acaoDetalhada";
    // var link = "http://10.40.196.171:7178/efikaServiceAPI/executar/acaoDetalhada";

    var instancia;
    var eqplist;
    var eqpselected;
    var ablemock = true; // Habilitar e desabilitar mock

    // Validar instancia e realizar busca dos equipamentos.
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
            $("#eqpListbody:last-child").append("<tr> <td> " + eqp.deviceId.serialNumber + " </td> <td> <button class='btn btn-blue btn-margin-bottom' type='buttton' id='view" + index + "' >Visualizar</button> </td> </tr>");
        }
        setFormOption("block");
        mountButtonView();
    }

    function mountButtonView() {
        $("tr").each(function (index) {
            $("#view" + index).click(function () {
                // console.log("clicou: " + index);
                // Ações especificas de acordo com a função.
                getFirmwareDevice(index);
            });
        });
    }

    // Aqui começa as ações especificas de cada ação.

    function getFirmwareDevice(index) {
        hideAllTags();
        setLoadingOptions("block", "Aguarde, buscando informações de Firmware.");
        var ins = instancia.split("?");
        var eqp = eqplist[index];
        var _data = JSON.stringify({ "instancia": ins[0], "parametro": eqp.deviceGUID, "execucao": "GET_FIRMWARE" });
        request = new XMLHttpRequest();
        request.open("POST", link);
        request.setRequestHeader("Content-Type", "text/plain");
        request.send(_data);
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                hideAllTags();
                setFormOption("block");
                resultado = JSON.parse(request.responseText);
                if (request.status === 200) {
                    if (resultado.valid) {
                        if (resultado.valid.updated) {
                            setMensagensOptions("block", "Firmware do modem já está atualizado.", "msg-success");
                        } else {
                            eqpselected = eqp;
                            setUpdateFirmwareOption("block");
                        }
                    } else {
                        setMensagensOptions("block", "Informações de firmware não encontrado.", "msg-error");
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

    $("#updatefirmware").click(function () {
        setFirmwareDevice();
    });

    function setFirmwareDevice() {
        hideAllTags();
        setLoadingOptions("block", "Aguarde, realizando correção de firmware.");
        var ins = instancia.split("?");
        var eqp = eqpselected;
        var _data = JSON.stringify({ "instancia": ins[0], "parametro": eqp.deviceGUID, "execucao": "FIRMWARE_UPDATE" });
        request = new XMLHttpRequest();
        request.open("POST", link);
        request.setRequestHeader("Content-Type", "text/plain");
        request.send(_data);
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                hideAllTags();
                setFormOption("block");
                resultado = JSON.parse(request.responseText);
                if (request.status === 200) {
                    if (resultado.valid.resultado) {
                        setMensagensOptions("block", "Firmware atualizado com sucesso.", "msg-success");
                    } else {
                        setMensagensOptions("block", "Não foi possivel realizar configuração de Firmware.", "msg-error");
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

    function setUpdateFirmwareOption(show) {
        $("#updatefirmware").css("display", show);
    }

    function hideAllTags() {
        setFormOption("none");
        setLoadingOptions("none", null);
        setMensagensOptions("none", null, null);
        setUpdateFirmwareOption("none");
    }

});