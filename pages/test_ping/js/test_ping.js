$(document).ready(function () {
    // http://10.40.195.81/efika_gps/pages/test_ping/test_ping.html?instancia=1234567890
    // Variaveis do sistema

    var link = "http://10.129.166.125:7178/efikaServiceAPI/executar/acaoDetalhada";
    // var link = "http://10.40.196.171:7178/efikaServiceAPI/executar/acaoDetalhada";

    var instancia;
    var eqplist;
    var eqpselected;
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
                setFormOption("block");
                setDoPingOption("block");
            });
        });
    }

    $("#ping").click(function () {
        if (ablemock) {
            getPingMock();
        } else {
            getPing();
        }
    });

    function getPing() {
        var input_ping = $("#input_ping").val();
        if (input_ping === undefined || input_ping == null || input_ping == "") {
            setMensagensOptions("block", "Por favor preencha o campo.", "msg-error");
        } else {
            hideAllTags();
            setLoadingOptions("block", "Aguarde realizando ping...");
            var ins = instancia.split("?");
            var _data = JSON.stringify({ "instancia": ins[0], "parametro": eqpselected.deviceGUID, "execucao": "PING" });
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
                            console.log(resultado);

                            // Tem q buscar a info do proprio resultado
                            document.getElementById("status").innerHTML = "Complete";
                            document.getElementById("tempo").innerHTML = "34";
                            document.getElementById("qntS").innerHTML = "4";
                            document.getElementById("qntE").innerHTML = "0";
                            document.getElementById("endereco").innerHTML = input_ping;
                            document.getElementById("repeticoes").innerHTML = "4";

                            setMensagensOptions("block", "Ping realizado com sucesso.", "msg-success");
                            setFormOption("block");
                            setDoPingOption("block");
                            setTableResultOptions("block");

                        } else {
                            setMensagensOptions("block", "Não foi possivel realizar ping no equipamento.", "msg-error");
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
    }

    function getPingMock() {
        var input_ping = $("#input_ping").val();
        if (input_ping === undefined || input_ping == null || input_ping == "") {
            setMensagensOptions("block", "Por favor preencha o campo.", "msg-error");
        } else {
            hideAllTags();
            setLoadingOptions("block", "Aguarde realizando ping...");
            setTimeout(function () {
                document.getElementById("status").innerHTML = "Complete";
                document.getElementById("tempo").innerHTML = "34";
                document.getElementById("qntS").innerHTML = "4";
                document.getElementById("qntE").innerHTML = "0";
                document.getElementById("endereco").innerHTML = input_ping;
                document.getElementById("repeticoes").innerHTML = "4";
                setMensagensOptions("block", "Ping realizado com sucesso.", "msg-success");
                setFormOption("block");
                setDoPingOption("block");
                setTableResultOptions("block");
            }, 1000);
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

    function setTableResultOptions(show) {
        $("#table_result").css("display", show);
    }

    function setDoPingOption(show) {
        $("#doping").css("display", show);
    }

    function hideAllTags() {
        setFormOption("none");
        setLoadingOptions("none", null);
        setMensagensOptions("none", null, null);
        setTableResultOptions("none");
        setDoPingOption("none");
    }



    function getSelectedValue() {
        input_ping = $("#input_ping").val();
    }

    function clearSelectedValue() {
        $("#input_ping").val("");
    }

});