$(document).ready(function () {
    // http://10.40.195.81/efika_gps/pages/reboot/reboot.html?instancia=123456789
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

    function mountCommand() {

        var _data = JSON.stringify({ "instancia": instancia, "parametro": null, "execucao": "GET_LIST_EQP" });

        eqplist = [
            {
                serial: "11111", guid: 1
            },
            {
                serial: "22222", guid: 2
            },
            {
                serial: "33333", guid: 3
            }
        ];
        mounttable();
    }
    
    function mounttable() {
        setFormOption("none");
        setLoadingOptions("block", "Aguarde...");
        setTimeout(function () {
            for (var index = 0; index < eqplist.length; index++) {
                var eqp = eqplist[index];
                $("#eqplist > tbody:last-child").append("<tr> <td> " + eqp.serial + " </td> <td> <button class='btn btn-blue btn-margin-bottom' type='buttton' id='reset" + index + "' >Resetar</button> </td> </tr>");
            }
            setLoadingOptions("none", null);
            setFormOption("block");
            mountRequest();
        }, 1000);
    }

    function mountRequest() {
        $("tr").each(function (index) {
            $("#reset" + index).click(function () {
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
            setMensagensOptions("block", "Reset no equipamento " + eqp.serial + " realizado com sucesso.", "msg-success"); // Success msg
        }, 1500);
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