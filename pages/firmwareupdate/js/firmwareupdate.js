$(document).ready(function () {
    // http://10.40.195.81/efika_gps/pages/firmwareupdate/firmwareupdate.html?instancia=123456789
    // Variaveis do sistema
    var instancia;

    var eqplist;

    getInstancia();

    function getInstancia() {
        if (window.location.href) {
            var link = window.location.href;
            var split = link.split("=");
            if (split[1]) {
                instancia = split[1];
                setLoadingOptions("block", "Aguarde...");
                setFormOption("none");
                setMensagensOptions("none", null, null);
                setTableResultOptions("none");
                mountCommand();
            } else {
                setMensagensOptions("block", "A instância inserida é inválida", "msg-error");
                setFormOption("none");
            }
        }
    }

    $("#updateall").click(function () {
        mountCommand();

    });

    function mountCommand() {
        var _data = JSON.stringify({ "instancia": instancia, "parametro": null, "execucao": "GET_LIST_EQP" });
        eqplist = [
            {
                serial: "11111", guid: 1, mandatorio: "123", atual: "123"
            },
            {
                serial: "22222", guid: 2, mandatorio: "123", atual: "122"
            },
            {
                serial: "33333", guid: 3, mandatorio: "123", atual: "123"
            }
        ];
        mounttable();
    }

    function mounttable() {
        setFormOption("none");
        setLoadingOptions("block", "Aguarde...");
        $("#eqpListbody").empty();
        setTimeout(function () {
            for (var index = 0; index < eqplist.length; index++) {
                var eqp = eqplist[index];
                var setupclass;
                var setupbtnname;
                var disabled;
                if (eqp.mandatorio != eqp.atual) {
                    setupbtnname = "Atualizar";
                    setupclass = "btn-red";
                    disabled = false;
                } else {
                    setupbtnname = "Atualizado";
                    setupclass = "btn-gray";
                    disabled = true;
                }
                $("#eqplist > tbody:last-child").append("<tr> <td> " + eqp.serial + " </td>  <td> " + eqp.atual + " </td> <td> <button class='btn " + setupclass + " btn-margin-bottom' type='buttton' id='update" + index + "' >" + setupbtnname + "</button> </td> </tr>");
                $("#update" + index).prop("disabled", disabled);
            }
            setLoadingOptions("none", null);
            setFormOption("block");
            mountRequest();
        }, 1000);
    }

    function mountRequest() {
        $("tr").each(function (index) {
            $("#update" + index).click(function () {
                doRequest(index);
            });
        });
    }

    function doRequest(i) {
        var eqp = eqplist[i];
        setFormOption("none");
        setLoadingOptions("block", "Aguarde...");
        setMensagensOptions("none", null, null);
        setTimeout(function () {
            setLoadingOptions("none", null);
            setFormOption("block");
            setMensagensOptions("block", "Comando enviado para o equipamento " + eqp.serial + " com sucesso, aguarde o modem finalizar a configuração.", "msg-success"); // Success msg
            hideupdatebtns();
        }, 1500);
    }

    function hideupdatebtns() {
        $("tr").each(function (index) {
            $("#update" + index).prop("disabled", true);
        });
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

    function getSelectedValue() {
        input_ping = $("#input_ping").val();
    }
});