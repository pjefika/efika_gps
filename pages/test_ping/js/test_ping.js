$(document).ready(function () {
    // http://10.40.195.81/efika_gps/pages/test_ping/test_ping.html?instancia=1234567890
    // Variaveis do sistema
    var instancia;
    var eqplist;
    var eqpselected;
    var input_ping;

    getInstancia();

    $("#ping").click(function () {
        pingar();
    });

    $(document).keypress(function (e) {
        if (e.which == 13) {
            pingar();
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
                setMensagensOptions("none", null, null);
                setDoPingOption("none");
                setTableResultOptions("none");
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
                setLoadingOptions("block", "Aguarde buscando informações...");
                setFormOption("none");
                setMensagensOptions("none", null, null);
                geteqpselected(index);
                setTableResultOptions("none");
                setTimeout(function () {
                    setLoadingOptions("none", null);
                    setFormOption("block");
                    clearSelectedValue();
                    setDoPingOption("block");
                }, 1000);
            });
        });
    }

    function pingar() {
        getSelectedValue();
        if (input_ping === undefined || input_ping == null || input_ping == "") {
            setMensagensOptions("block", "Por favor preencha o campo.", "msg-error");
        } else {
            setLoadingOptions("block", "Aguarde...");
            setFormOption("none");
            setMensagensOptions("none", null, null);
            setTimeout(function () {
                setDoPingOption("block");
                setTableResultOptions("block");
                document.getElementById("status").innerHTML = "Complete";
                document.getElementById("tempo").innerHTML = "34";
                document.getElementById("qntS").innerHTML = "4";
                document.getElementById("qntE").innerHTML = "0";
                document.getElementById("endereco").innerHTML = input_ping;
                document.getElementById("repeticoes").innerHTML = "4";

                setLoadingOptions("none", null);
                setMensagensOptions("block", "Ping realizado com sucesso.", "msg-success"); // Success msg
                setFormOption("block");
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

    function setDoPingOption(show) {
        $("#doping").css("display", show);
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

    function clearSelectedValue() {
        $("#input_ping").val("");
    }

    function geteqpselected(i) {
        eqpselected = eqplist[i];
    }

});