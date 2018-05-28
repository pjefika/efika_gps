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
                serial: "11111", guid: 1, active: true
            },
            {
                serial: "22222", guid: 2, active: false
            },
            {
                serial: "33333", guid: 3, active: true
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
                $("#eqplist > tbody:last-child").append("<tr> <td> " + eqp.serial + " </td> <td> <button class='btn btn-blue btn-margin-bottom' type='buttton' id='reset" + index + "' >Reboot</button> </td> </tr>");
                disablebuttoneqpoff(index);
            }
            setLoadingOptions("none", null);
            setFormOption("block");
            mountRequest();
        }, 1000);
    }

    function disablebuttoneqpoff(i) {
        var eqp = eqplist[i];
        if (!eqp.active) {
            document.getElementById("reset" + i).disabled = true;
        }
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
            console.log(eqp.serial);

            var ins = instancia.split("?");
            var _data = JSON.stringify({ "instancia": ins[0], "parametro": null, "execucao": "REBOOT_DEVICE" });
            request = new XMLHttpRequest();
            request.open("POST", "http://10.40.196.171:7178/efikaServiceAPI/executar/acaoDetalhada");
            request.setRequestHeader("Content-Type", "text/plain");
            request.send(_data);
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    resultado = JSON.parse(request.responseText);
                    if (request.status === 200) {
                        if (resultado.valid.resultado) {
                            setMensagensOptions("block", "Reset no equipamento " + eqp.serial + " realizado com sucesso.", "msg-success");
                            setLoadingOptions("none", null);
                            setFormOption("block");
                        } else {
                            setMensagensOptions("block", "Não foi possivel realizar o Reset no equipamento " + eqp.serial + " pois está inativo.", "msg-error");
                            setLoadingOptions("none", null);
                            setFormOption("block");
                        }
                    } else {
                        setLoadingOptions("none", null);
                        setFormOption("block");
                        if (resultado.localizedMessage) {
                            setMensagensOptions("block", resultado.localizedMessage, "msg-error");
                            setLoadingOptions("none", null);
                            setFormOption("block");
                        } else {
                            setMensagensOptions("block", "Erro: " + request.status, "msg-error");
                        }
                    }
                }
            }
            // if (eqp.serial === "33333") {
            //     console.log("eqp inativo.");
            //     setLoadingOptions("none", null);
            //     setFormOption("block");
            //     setMensagensOptions("block", "Não foi possivel realizar o Reset no equipamento " + eqp.serial + " pois está inativo.", "msg-error"); 
            // } else {
            //     setLoadingOptions("none", null);
            //     setFormOption("block");
            //     setMensagensOptions("block", "Reset no equipamento " + eqp.serial + " realizado com sucesso.", "msg-success"); // Success msg
            // }
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