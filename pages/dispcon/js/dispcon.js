$(document).ready(function () {
    // http://10.40.195.81/efika_gps/pages/dispcon/dispcon.html?instancia=123456789
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

        var _data = JSON.stringify({ "instancia": instancia, "parametro": null, "execucao": "GET_EQP_DISP_CON" });
        eqplist = [
            {
                serial: "11111", guid: 1,
                dispositivos: [
                    {
                        dispositivo: "ABC",
                        status: "ativo"
                    },
                    {
                        dispositivo: "BAC",
                        status: "inativo"
                    }
                ]
            },
            {
                serial: "22222", guid: 2
                ,
                dispositivos: [
                    {
                        dispositivo: "ABC",
                        status: "inativo"
                    }
                ]
            },
            {
                serial: "33333", guid: 3,
                dispositivos: [
                    {
                        dispositivo: "ABC",
                        status: "ativo"
                    },
                    {
                        dispositivo: "BAC",
                        status: "ativo"
                    },
                    {
                        dispositivo: "CAB",
                        status: "inativo"
                    }
                ]
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
                $("#eqpListbody:last-child").append("<tr> <td> " + eqp.serial + " </td> <td> <button class='btn btn-blue btn-margin-bottom' type='buttton' id='view" + index + "' >Visualizar</button> </td> </tr>");
            }
            setLoadingOptions("none", null);
            setFormOption("block");
            setEqpListOption("block");
            // setDispListOption("none");
            mountRequest();
        }, 1000);
    }

    function mountRequest() {
        $("tr").each(function (index) {
            $("#view" + index).click(function () {
                $("#dispListbody").empty();
                // setEqpListOption("none");
                // setDispListOption("block");
                mountTableListDisp(index);
            });
        });
    }

    function mountTableListDisp(i) {
        var disp = eqplist[i].dispositivos;
        // setDispListOption("block");
        for (var index = 0; index < disp.length; index++) {
            var dispE = disp[index];
            $("#dispListbody:last-child").append("<tr> <td> " + dispE.dispositivo + " </td> <td> " + dispE.status + " </td> </tr>");
        }
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

    function setTableResultOptions(show) {
        $("#table_result").css("display", show);
    }

    function getSelectedValue() {
        input_ping = $("#input_ping").val();
    }
});