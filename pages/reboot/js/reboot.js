$(document).ready(function () {
    // http://10.40.195.81/efika_gps/pages/reboot/reboot.html?instancia=123456789
    // Variaveis do sistema
    var instancia;
    var _data;

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
                /**
                * Monta o obj de acordo com o caso de uso... 
                */
                mountCommand();
            } else {
                setMensagensOptions("block", "A instância inserida é inválida", "msg-error");
                setFormOption("none");
            }
        }
    }

    function mountCommand() {
        _data = { "parameter": instancia, "executor": "G0034481", "system": null, "paramType": null, "requestDate": null };
        setLoadingOptions("none", null);
        setFormOption("block");

        geteqplist();
    }

    function geteqplist() {
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
                $("#eqplist > tbody:last-child").append("<tr> <td> " + eqplist[index].serial + " </td> <td> <button class='btn btn-blue' type='buttton' id='reset" + index + "' >Resetar</button> </td> </tr>");
                $("#reset" + index).click(function () {
                    console.log(eqplist[index]);
                    
                    doRequest(eqplist[index]);
                });
            }
            setLoadingOptions("none", null);
            setFormOption("block");

            // jqueryactionmount();
        }, 1000);
    }

    function jqueryactionmount() {
        for (var index = 0; index < eqplist.length; index++) {
            $("#reset" + index).click(function () {
                doRequest(eqplist[index]);
            });
        }
    }

    function doRequest(eqp) {
        // console.log(eqp);

        setFormOption("none");
        setLoadingOptions("block", "Aguarde...");
        setMensagensOptions("none", null, null);
        setTimeout(function () {
            setLoadingOptions("none", null);
            setFormOption("block");
            // setMensagensOptions("block", "Reset no equipamento " + eqp.serial + " realizado com sucesso.", "msg-success"); // Success msg
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