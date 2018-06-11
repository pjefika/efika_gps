$(document).ready(function () {
    // http://10.40.195.81/efika_gps/pages/dispcon/dispcon.html?instancia=123456789
    // Variaveis do sistema
    var instancia;

    var eqplist;

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
                getDevices();
            } else {
                setMensagensOptions("block", "A instância inserida é inválida", "msg-error");
            }
        }
    }

    function getDevices() {
        var ins = instancia.split("?");
        var _data = JSON.stringify({ "instancia": ins[0], "parametro": null, "execucao": "SEEK_DEVICES" });
        request = new XMLHttpRequest();
        request.open("POST", "http://10.40.196.171:7178/efikaServiceAPI/executar/acaoDetalhada");
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
                $("#dispListbody").empty();
                mountTableListDisp(index);
            });
        });
    }

    function mountTableListDisp(index) {
        var eqpdisp = eqplist[i].dispositivos;
        // setDispListOption("block");
        // for (var index = 0; index < disp.length; index++) {
        //     var dispE = disp[index];
        //     $("#titledisplist").text(eqplist[index].serial);
        //     $("#dispListbody:last-child").append("<tr> <td> " + dispE.dispositivo + " </td> <td> " + dispE.status + " </td> <td> " + dispE.conected + " </td> <td> " + dispE.vel_ethernet + " </td> </tr>");
        // }
    }

    function setEqpListOption(show) {
        $("#eqplist").css("display", show)
    }

    function setDispListOption(show) {
        $("#displist").css("display", show)
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