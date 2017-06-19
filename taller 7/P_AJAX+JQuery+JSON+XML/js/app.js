gastos = []
servicios_basicos = []

window.onload = function () {
  if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun/*, thisArg*/) {
      'use strict';

      if (this === void 0 || this === null) {
        throw new TypeError();
      }

      var t = Object(this);
      var len = t.length >>> 0;
      if (typeof fun !== 'function') {
        throw new TypeError();
      }

      var res = [];
      var thisArg = arguments.length >= 2
        ? arguments[1]
        : void 0;
      for (var i = 0; i < len; i++) {
        if (i in t) {
          var val = t[i];

          // NOTE: Technically this should Object.defineProperty at       the next index,
          // as push can be affected by       properties on Object.prototype and
          // Array.prototype.       But that method's new, and collisions should be rare,
          // so use the more-compatible alternative.
          if (fun.call(thisArg, val, i, t)) {
            res.push(val);
          }
        }
      }

      return res;
    };
  }

  $
    .getJSON("gastos_personales.json", function (data, status) {
      //getJSON me retorna un JSON en data
      if (status == "success") {
        gastos = data
        $.get("servicios_basicos.xml", function (data, status) {
          //data ya tiene el xml parseado
          if (status == "success") {
            //recorro usuarios para crear nodos con los listeners
            servicios_basicos = $(data).find("servicio")
            for (let i = 0; i < servicios_basicos.length; i++) {
              let item = $("<li></li>")
              item.text($(servicios_basicos[i]).find("nombre").text())
              item.add($("<p class='detail'></p>"))
              item.on("click", function () {
                for (let j = 0; j < servicios_basicos.length; j++) {
                  let servicio = servicios_basicos[j]
                  let deudaTotal = 0
                  let txt = ""
                  for (let k = 0; k < gastos.length; k++) {
                    let targ = gastos[k]
                    let deuda = (targ.servicios.filter(function (elem, index, arrelem) {
                      console.log(elem.servicio, servicio.getAttribute("tipo"))
                      return elem.servicio == servicio.getAttribute("tipo")
                    })[0]).deuda
                    let _txt = "<h2>" + targ.nombre + "($" + deuda + ")</h2>"
                    deudaTotal += parseFloat(deuda)
                    txt += _txt
                  }
                  $(this).append(txt)
                  $(this).append($("<p><br/><strong>Deuda total:</strong> $" + deudaTotal + "</p>"))
                  return
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
  return "<h3>" + service
    .find("nombre")
    .text() + "<h3><p>" + service
    .find("direccion")
    .text() + "<br/>" + service
    .find("telefono")
    .text() + "</p>"
}

//funcion para buscar un servicio en específico
function findService(services, servicename) {
  return $(services).find('servicio[tipo="' + servicename + '"]')
}