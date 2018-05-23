$(document).ready(function () {
    var instancia;
    var eqplist;
    var eqpselected;

    var dnsselected;

    var dnssetted;

    getInstancia();

    $("#setdnscong").click(function () {
        setdns();
    });

    function setdns() {
        setLoadingOptions("block", "Aguarde realizando configuração...");
        setFormOption("none");
        setMensagensOptions("none", null, null);
        setConfdnsOption("none");
        setTimeout(function () {
            setLoadingOptions("none", null);
            setFormOption("block");
            setMensagensOptions("block", "Configuração no equipamento " + eqpselected.serial + " realizada com sucesso.", "msg-success");
            setConfdnsOption("none");

        }, 1000);
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
                setConfdnsOption("none");
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
                { serial: "11111", guid: 1, dns: true, active: true },
                { serial: "22222", guid: 2, dns: false, active: true  },
                { serial: "333333", guid: 3, dns: true, active: false  }
            ];
            for (var index = 0; index < eqplist.length; index++) {
                var eqp = eqplist[index];
                $("#eqpListbody:last-child").append("<tr> <td> " + eqp.serial + " </td> <td> <button class='btn btn-blue btn-margin-bottom' type='buttton' id='view" + index + "' >Visualizar</button> </td> </tr>");
                disablebuttoneqpoff(index)
            }
            setLoadingOptions("none", null);
            setFormOption("block");
            mountclickineqp();
        }, 1000);
    }

    function disablebuttoneqpoff(i) {
        var eqp = eqplist[i];
        if (!eqp.active) {
            document.getElementById("view" + i).disabled = true;
        }
    }

    function mountclickineqp() {
        $("tr").each(function (index) {
            $("#view" + index).click(function () {
                $("#dnstablebody").empty();
                setLoadingOptions("block", "Aguarde buscando informações...");
                setFormOption("none");
                setConfdnsOption("none");
                setMensagensOptions("none", null, null);
                mountdnsconfs(index);
            });
        });
    }

    function mountdnsconfs(i) {
        $("#input_dns").val("");
        eqpselected = eqplist[i];
        setTimeout(function () {
            dnssetted = {
                primary: "123.123.123.123",
                secondary: "321.321.321.321"
            }

            $("#dnstablebody:last-child").append("<tr> <td> " + dnssetted.primary + " </td> <td> " + dnssetted.secondary + " </td>  </tr>");

            if (eqpselected.dns) {
                document.getElementById("setdnscong").disabled = true;
            } else {
                document.getElementById("setdnscong").disabled = false;
            }

            setLoadingOptions("none", null);
            setFormOption("block");
            setConfdnsOption("block");
        }, 1000);
    }

    /**
    * Importar para todos os scripts e Manter o padrão \/
    * 
    */
    function setFormOption(show) {
        $("#form").css("display", show);
    }

    function setConfdnsOption(show) {
        $("#confdns").css("display", show);
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

});