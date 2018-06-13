$(document).ready(function () {
    // http://10.40.195.81/efika_gps/pages/wificonf/wificonf.html?instancia=123456
    // Variaveis do sistema    
    // var link = "http://10.129.166.125:7178/efikaServiceAPI/executar/acaoDetalhada";
    var link = "http://10.40.196.171:7178/efikaServiceAPI/executar/acaoDetalhada";

    var instancia;
    var eqplist;
    var eqpselected;
    var wifir1;
    var wifir2;
    var wifiselected;
    var ablemock = false; // Habilitar e desabilitar mock

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
                eqpselected = eqplist[index];
                hideAllTags();
                // console.log("clicou: " + index);
                // Ações especificas de acordo com a função.
                getWifiConf(index);
            });
        });
    }

    function getWifiConf() {
        hideAllTags();
        setLoadingOptions("block", "Aguarde buscando informações do Wifi...");
        var ins = instancia.split("?");
        var _data = JSON.stringify({ "instancia": ins[0], "parametro": eqpselected.deviceGUID, "execucao": "GET_WIFI" });
        request = new XMLHttpRequest();
        request.open("POST", link);
        request.setRequestHeader("Content-Type", "text/plain");
        request.send(_data);
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                resultado = JSON.parse(request.responseText);
                hideAllTags();
                if (request.status === 200) {
                    setFormOption("block");
                    if (resultado.valid.wifi) {
                        wifir1 = resultado.valid.wifi[0];
                        document.getElementById("input_ssid_1").value = wifir1.ssid;
                        document.getElementById("input_password_1").value = wifir1.key;
                        setConfWhatRede("block", 1);
                        if (resultado.valid.wifi > 1) {
                            wifir2 = resultado.valid.wifi[1];
                            document.getElementById("input_ssid_2").value = wifir2.ssid;
                            document.getElementById("input_password_2").value = wifir2.key;
                            setConfWhatRede("block", 2);
                        }
                        setConfWifisOption("block");
                    } else {
                        setMensagensOptions("block", "Não foram encontrados redes wifi", "msg-error");
                    }
                } else {
                    setFormOption("block");
                    if (resultado.localizedMessage) {
                        setMensagensOptions("block", resultado.localizedMessage, "msg-error");
                    } else {
                        setMensagensOptions("block", "Erro: " + request.status, "msg-error");
                    }
                }
            }
        }
    }

    function setWifiConf(qualwifi) {
        hideAllTags();
        setLoadingOptions("block", "Aguarde realizando configurações no Wifi...");
        setSelectedValue(qualwifi);
        var ins = instancia.split("?");
        var _data = JSON.stringify({ "instancia": ins[0], "parametro": eqpselected.deviceGUID, "setter": { "wifi": wifiselected }, "execucao": "SET_WIFI" });
        request = new XMLHttpRequest();
        request.open("POST", link);
        request.setRequestHeader("Content-Type", "text/plain");
        request.send(_data);
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                resultado = JSON.parse(request.responseText);
                hideAllTags();
                if (request.status === 200) {
                    setFormOption("block");
                    if (resultado.valid.wifi) {
                        setMensagensOptions("block", "Comando realizado com sucesso.", "msg-success");
                    } else {
                        setMensagensOptions("block", "Não foi possivel realizar a configuração do Wifi.", "msg-error");
                    }
                } else {
                    setFormOption("block");
                    if (resultado.localizedMessage) {
                        setMensagensOptions("block", resultado.localizedMessage, "msg-error");
                    } else {
                        setMensagensOptions("block", "Erro: " + request.status, "msg-error");
                    }
                }
            }
        }
    }

    $("#setwificonf_1").click(function () {
        setWifiConf(1);
    });

    $("#setwificonf_2").click(function () {
        setWifiConf(2);
    });

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
        setConfWifisOption("none");
        setConfWhatRede("none", 1);
        setConfWhatRede("none", 2);
    }

    function setConfWifisOption(show) {
        $("#confwifis").css("display", show);
    }

    function setConfWhatRede(show, index) {
        $("#rede" + index).css("display", show);
    }

    function setSelectedValue(index) {
        switch (index) {
            case 1:
                wifir1.ssid = $("#input_ssid_" + index).val();
                wifir1.key = $("#input_password_" + index).val();
                wifiselected = wifir1;
                break;
            case 2:
                wifir2.ssid = $("#input_ssid_" + index).val();
                wifir2.key = $("#input_password_" + index).val();
                wifiselected = wifir2;
                break;
        }
    }
});