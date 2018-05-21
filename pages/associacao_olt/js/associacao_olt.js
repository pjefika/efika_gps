$(document).ready(function () {
    // http://10.40.195.81/efika_gps/pages/associacao_olt/associacao_olt.html?instancia=1234567890
    // Variaveis do sistema
    var instancia;

    var resultado;
    var selected;

    var listmockserial = [{ "serial": "1111111111 / Slot: 1 - Porta: 1", "porta": 1, "slot": 1 }, { "serial": "2222222222 / Slot: 2 - Porta: 2", "porta": 2, "slot": 2 }];
    // Chamada inicial
    getInstancia();

    /**
    * Script especifico da pagina \/ 
    */
    $("#assoc_id").click(function () {
        assoc();
    });

    $(document).keypress(function (e) {
        if (e.which == 13) {
            assoc();
        }
    });

    function assoc() {
        setMensagensOptions("none", null, null);
        getSelectedValue();
        if (selected === undefined || selected == null) {
            setMensagensOptions("block", "Por favor selecione um serial", "msg-error");
        } else {
            // Request
            // doRequestSetSerial();
            mockdaassoc();
        }
    }

    function doRequestSetSerial() {
        setFormOption("none");
        setLoadingOptions("block", "Realizando Associação da ONT, aguarde...");
        var _data = JSON.stringify({ "instancia": instancia, "parametro": selected, "execucao": "SET_ONT" });
        request = new XMLHttpRequest();
        request.open("POST", "http://10.40.196.171:7178/efikaServiceAPI/executar/acaoDetalhada");
        request.setRequestHeader("Content-Type", "text/plain");
        request.send(_data);
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                resultado = JSON.parse(request.responseText);
                if (request.status === 200) {
                    setMensagensOptions("block", "Serial: " + selected + " associado com sucesso!", "msg-success");
                    setLoadingOptions("none", null);
                } else {
                    setLoadingOptions("none", null);
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

    function getInstancia() {
        if (window.location.href) {
            var link = window.location.href;
            var split = link.split("=");
            if (split[1]) {
                instancia = split[1];
                setLoadingOptions("block", "Aguarde...");
                setFormOption("none");
                setMensagensOptions("none", null, null);
                // document.getElementById("instancia").innerHTML = instancia;
                // doRequestGetSerialDisp();
                mockedalist();
            } else {
                setMensagensOptions("block", "A instância inserida é inválida", "msg-error");
                setFormOption("none");
            }
        }
    }

    function doRequestGetSerialDisp() {
        var _data = JSON.stringify({ "instancia": instancia, "parametro": null, "execucao": "GET_ONTS" });
        request = new XMLHttpRequest();
        request.open("POST", "http://10.40.196.171:7178/efikaServiceAPI/executar/acaoDetalhada");
        request.setRequestHeader("Content-Type", "text/plain");
        request.send(_data);
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                resultado = JSON.parse(request.responseText);
                if (request.status === 200) {
                    var listaSerial = resultado.valid.preresult;
                    if (listaSerial.length < 1) {
                        setLoadingOptions("none", null);
                        setMensagensOptions("block", "Lista de ONT's está vazia.", "msg-error");
                    } else {
                        var select = document.getElementById("select");
                        for (var index = 0; index < listaSerial.length; index++) {
                            select.options[select.options.length] =
                                new Option(listaSerial[index].serial + " / Slot: " + listaSerial[index].slot + " - Porta: " + listaSerial[index].porta, listaSerial[index].serial);
                        }
                        selectdisableoptions();
                        setLoadingOptions("none", null);
                        setFormOption("block");
                    }
                } else {
                    setLoadingOptions("none", null);
                    if (resultado.localizedMessage) {
                        setMensagensOptions("block", resultado.localizedMessage, "msg-error");
                    } else {
                        setMensagensOptions("block", "Erro: " + request.status, "msg-error");
                    }
                }
            }
        }
    }

    function selectdisableoptions() {
        var listaSerial = resultado.valid.preresult;
        for (var index = 0; index < listaSerial.length; index++) {
            $("select option").each(function () {
                if (listaSerial[index].slot !== resultado.customer.rede.slot && listaSerial[index].porta !== resultado.customer.rede.porta) {
                    $('select').children('option[value="' + listaSerial[index].serial + '"]').attr('disabled', "disabled")
                }
            });
        }
    }

    function selectdisableoptionsMock() {
        var listaSerial = listmockserial;
        for (var index = 0; index < listaSerial.length; index++) {
            $("select option").each(function () {
                if (listaSerial[index].slot !== 2 && listaSerial[index].porta !== 2) {
                    $('select').children('option[value="' + listaSerial[index].serial + '"]').attr('disabled', "disabled")
                }
            });
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

    function getSelectedValue() {
        selected = $("#select").val();
    }

    function mockedalist() {
        setLoadingOptions("block", "Buscando lista de ONT's");
        setTimeout(function () {
            var listaSerial = listmockserial;
            if (listaSerial.length < 1) {
                setLoadingOptions("none", null);
                setMensagensOptions("block", "Lista de ONT's está vazia.", "msg-error");
            } else {
                var select = document.getElementById("select");
                for (var index = 0; index < listaSerial.length; index++) {
                    select.options[select.options.length] =
                        new Option(listaSerial[index].serial + " / Slot: " + listaSerial[index].slot + " - Porta: " + listaSerial[index].porta, listaSerial[index].serial);
                }
                selectdisableoptionsMock();
                setLoadingOptions("none", null);
                setFormOption("block");
            }
        }, 1000);


    }

    function mockdaassoc() {
        setFormOption("none");
        setLoadingOptions("block", "Realizando Associação da ONT, aguarde...");
        setTimeout(function () {
            setMensagensOptions("block", "Serial: " + selected + " associado com sucesso!", "msg-success");
            setLoadingOptions("none", null);
        }, 1000);
    }

});