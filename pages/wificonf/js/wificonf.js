$(document).ready(function () {
    // http://10.40.195.81/efika_gps/pages/wificonf/wificonf.html?instancia=123456
    // Variaveis do sistema    
    var instancia;
    var eqplist;
    var eqpselected;
    var wificonfs;
    var wifiselected;

    getInstancia();

    $("#setwificonf_1").click(function () {
        // REDE 2.4GHZ
        getSelectedValue(1);
        setwificonf();
    });

    $("#setwificonf_2").click(function () {
        // REDE 5GHZ
        getSelectedValue(2);
        setwificonf();
    });

    function setwificonf() {
        setLoadingOptions("block", "Aguarde realizando configurações de wifi no modem...");
        setFormOption("none");
        setTimeout(function () {
            console.log(wifiselected);
            console.log(eqpselected);
            setLoadingOptions("none", null);
            setConfWifisOption("none");
            setFormOption("block");
            setMensagensOptions("block", "Configurações no modem " + eqpselected.serial + " realizada com sucesso.", "msg-success");
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
                setConfWifisOption("none");
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
                setConfWifisOption("none");
                setMensagensOptions("none", null, null);
                mountWifiConfs(index);
            });
        });
    }

    function mountWifiConfs(i) {
        eqpselected = eqplist[i];
        setTimeout(function () {
            wificonfs = [
                { user: "User-2.4GHZ", password: "" },
                { user: "User-5GHZ", password: "" }
            ];
            document.getElementById("input_ssid_1").value = wificonfs[0].user;
            document.getElementById("input_password_1").value = wificonfs[0].password;
            document.getElementById("input_ssid_2").value = wificonfs[1].user;
            document.getElementById("input_password_2").value = wificonfs[1].password;

            setLoadingOptions("none", null);
            setFormOption("block");
            setConfWifisOption("block");
        }, 1000);
    }

    /**
    * Importar para todos os scripts e Manter o padrão \/
    * 
    */
    function setFormOption(show) {
        $("#form").css("display", show);
    }

    function setConfWifisOption(show) {
        $("#confwifis").css("display", show);
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

    function getSelectedValue(i) {
        wifiselected = {
            user: $("#input_ssid_" + i).val(),
            password: $("#input_password_" + i).val()
        }
    }
});