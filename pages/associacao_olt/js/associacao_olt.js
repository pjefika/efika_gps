$(document).ready(function () {
    // http://10.40.195.81/fabio/efika_gps/pages/associacao_olt/associacao_olt.html?instancia=2835181121
    // Variaveis do sistema
    var instancia;
    var _data;

    var listaSerial;
    var selected;

    // Chamada inicial
    getInstancia();

    /**
    * Script especifico da pagina \/ 
    */
    $("#assoc_id").click(function () {
        setMensagensOptions("none", null);
        getSelectedValue();
        if (selected === undefined || selected == null) {
            setMensagensOptions("block", "Por favor selecione um serial");
        } else {
            setFormOption("none");
            setLoadingOptions("block", "Realizando comando, aguarde...");
            // Request
            // Change to request and modify the msg
            setTimeout(function () {
                setLoadingOptions("none", null);
                setMensagensOptions("block", "Selecionado o serial: " + selected + " & Instancia: " + instancia); // Success||Error msg
            }, 1000);
        }
    });

    function getInstancia() {
        if (window.location.href) {
            var link = window.location.href;
            var split = link.split("=");
            if (split[1]) {
                instancia = split[1];
                setLoadingOptions("block", "Aguarde...");
                setFormOption("none");
                setMensagensOptions("none", null);
                document.getElementById("instancia").innerHTML = instancia;
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
        /**
        * Informar Type -> POST || GET
        * Informar URL/ 
        */
        validTypeRequest("POST", "http://10.40.198.168:7171/customerAPI/certification/ontsDisp");
    }

    function validTypeRequest(type, url) {
        if (window.XDomainRequest) {
            request = new XDomainRequest();
            request.open(type, url);
        } else if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
            request.open(type, url);
            request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        }
        // doRequest();
        mockedalist();
    }

    function doRequest() {
        request.send(JSON.stringify(_data));
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    listaSerial = JSON.parse(request.responseText);
                    if (listaSerial.localizedMessage) {
                        setMensagensOptions("block", listaSerial.localizedMessage);
                        setLoadingOptions("none", null);
                    } else {
                        var select = document.getElementById("select");
                        for (var index = 0; index < listaSerial.length; index++) {
                            select.options[select.options.length] =
                                new Option(listaSerial[index].serial + " / Slot: " + listaSerial[index].slot + " - Porta: " + listaSerial[index].porta, listaSerial[index].serial);
                            // #Falta validação do para desabilitar os seriais de acordo com slot e porta#
                        }
                        setLoadingOptions("none", null);
                        setFormOption("block");
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

    function setMensagensOptions(show, msg) {
        $("#mensagem").css("display", show);
        $("#textoMensagem").text(msg);
    }

    function getSelectedValue() {
        selected = $("#select").val();
    }

    function mockedalist() {
        var select = document.getElementById("select");
        var list = [{ "serial": "1111111111 / Slot: 1 - Porta: 1" }, { "serial": "2222222222 / Slot: 2 - Porta: 2" }];
        for (var index = 0; index < list.length; index++) {
            select.options[select.options.length] =
                new Option(list[index].serial, list[index].serial);
        }
        setLoadingOptions("none", null);
        setFormOption("block");
    }

});