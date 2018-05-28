$(document).ready(function () {

    var instancia;
    var eqplist;
    var eqpselected;

    getInstancia();

    function getInstancia() {
        if (window.location.href) {
            var link = window.location.href;
            var split = link.split("=");
            if (split[1]) {
                instancia = split[1];
                setLoadingOptions("block", "Aguarde buscando equipamentos...");
                setFormOption("none");
                setMensagensOptions("none", null, null);
                setwifiactiveconfOption("none");
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
                $("#wblistbody").empty();
                setLoadingOptions("block", "Aguarde buscando informações...");
                setFormOption("none");
                setwifiactiveconfOption("none");
                setMensagensOptions("none", null, null);
                mountwificonf(index);
            });
        });
    }

    function mountwificonf(i) {
        $("#input_dns").val("");
        eqpselected = eqplist[i];
        setTimeout(function () {
            var validifbtnisdisable;
            var wblist = [
                { rede: "2.4GHz", wifi: false, broadcast: true },
                { rede: "5GHz", wifi: true, broadcast: true }
            ];
            for (var index = 0; index < wblist.length; index++) {
                var wb = wblist[index];
                wb.wifi = wb.wifi ? 'Ativo' : 'Inativo';
                wb.broadcast = wb.broadcast ? 'Ativo' : 'Inativo';
                $("#wblistbody:last-child").append("<tr> <td> " + wb.rede + " </td> <td> " + wb.wifi + " </td> <td> " + wb.broadcast + " </td> </tr>");
            }
            if (somedisabled(wblist)) {
                document.getElementById("activewb").disabled = false;
            } else {
                document.getElementById("activewb").disabled = true;
            }
            setLoadingOptions("none", null);
            setFormOption("block");
            setwifiactiveconfOption("block");
        }, 1000);
    }

    function somedisabled(wblist) {
        var isanyfalse = false;
        for (var index = 0; index < wblist.length; index++) {
            var wb = wblist[index];
            if (wb.wifi === "Inativo" || wb.broadcast === "Inativo") {
                isanyfalse = true;
            }
        }
        return isanyfalse;
    }

    $("#activewb").click(function () {
        setactivewifibroadcast();
    });

    function setactivewifibroadcast() {
        setFormOption("none");
        setwifiactiveconfOption("none");
        setLoadingOptions("block", "Aguarde enquanto realizamos as configuração...");
        setTimeout(function () {
            setLoadingOptions("none", null);
            setFormOption("block");
            setMensagensOptions("block", "Comando realizado com sucesso.", "msg-success");
        }, 1000);
    }

    /**
    * Importar para todos os scripts e Manter o padrão \/
    * 
    */
    function setFormOption(show) {
        $("#form").css("display", show);
    }

    function setwifiactiveconfOption(show) {
        $("#wifiactiveconf").css("display", show);
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

    // function getinsertedvalue() {
    //     dnsselected = $("#input_dns").val();
    // }

});