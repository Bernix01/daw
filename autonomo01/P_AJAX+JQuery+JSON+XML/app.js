gastos = []
    servicios_basicos = []

    window.onload = function () {
      $.getJSON("gastos_personales.json", function (data, status) {
        //getJSON me retorna un JSON en data
        if (status == "success") {
          gastos = data
          $.get("servicios_basicos.xml", function (data, status) {
            //data ya tiene el xml parseado
            if (status == "success") {
              //recorro usuarios para crear nodos con los listeners
              servicios_basicos = data
              for (let i = 0; i < gastos.length; i++) {
                let item = $("<li></li>")
                item.text(gastos[i].nombre)
                item.on("click", function () {
                  for (let j = 0; j < gastos.length; j++) {
                    let gasto = gastos[j]
                    if ($(this).text() == gasto.nombre) {
                      let deudaTotal = 0
                      let txt = ""
                      for (let k = 0; k < gasto.servicios.length; k++) {
                        let targ = gasto.servicios[k].servicio
                        let _txt = "<h2>"+targ+"($"+gasto.servicios[k].deuda+")</h2>"+serviceToHTML(findService($(servicios_basicos).find("servicios"), targ))
                        deudaTotal += parseFloat(gasto.servicios[k].deuda)
                        txt += _txt
                      }
                      $(this).append(txt)
                      $(this).append($("<p><br/><strong>Deuda total:</strong> $" + deudaTotal + "</p>"))
                      return
                    }
                  }
                })
                $("#usuarios").append(item)
              }
            } else
              alert(">:( error al leer los servicios basicos")
          })
        } else
          alert(":( error al leer los gastos personales!")
      })
    }

    //service es un nodo <servicio>
    function serviceToHTML(service) {
      return "<h3>" + service.find("nombre").text() + "<h3><p>" + service.find("direccion").text() + "<br/>" + service.find(
        "telefono").text() + "</p>"
    }

    //funcion para buscar un servicio en específico 
    function findService(services, servicename) {
      return $(services).find('servicio[tipo="' + servicename + '"]')
    }