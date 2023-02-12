document.addEventListener("DOMContentLoaded", () => {

    var modelo = null;
    var canvas = document.getElementById('canvas');
    var btn_predecir = document.getElementById('btn-predecir');

    // Cargar modelo
    (async ()=> {
        console.log("Cargando modelo");
        modelo = await tf.loadLayersModel(location.origin + "/static/model/maize_model/model.json")
        console.log("modelo cargado")
    })();

    //btn_predecir.onclick = function(e) {
    function realizarPredicciones() {
      var ctx = canvas.getContext("2d");
      var img = new Image();

      var img_subida = document.getElementById('img-subida');
      img.src = img_subida.src;

      ctx.drawImage(img, 0, 0, 300, 300);

      if (modelo != null) {
        console.log("Realizando predicciones");

        var imgData = ctx.getImageData(0, 0, 300, 300);
        var arr = [];
        var arr300 = [];

        for (var p = 0; p < imgData.data.length; p+=4) {
          var red = imgData.data[p]/255;
          var green = imgData.data[p+1]/255;
          var blue = imgData.data[p+2]/255;

          arr300.push([red, green, blue]);

          if (arr300.length == 300) {
            arr.push(arr300);
            arr300 = [];
          }
        }
        arreglo = [arr];

        var tensor4 = tf.tensor4d(arreglo);
        var resultados = modelo.predict(tensor4).dataSync();
        var mayorIndice = resultados.indexOf(Math.max.apply(null, resultados));

        var clases = ['Tizones', 'Manchas', 'Royas', 'Sanas'];

        var clase_0 = document.getElementById('clase_0');
        var clase_1 = document.getElementById('clase_1');
        var clase_2 = document.getElementById('clase_2');
        var clase_3 = document.getElementById('clase_3');

        clase_0.innerHTML = clases[0] + ": " + Math.round(resultados[0] * 100).toFixed(2) + "%";
        clase_1.innerHTML = clases[1] + ": " + Math.round(resultados[1] * 100).toFixed(2) + "%";
        clase_2.innerHTML = clases[2] + ": " + Math.round(resultados[2] * 100).toFixed(2) + "%";
        clase_3.innerHTML = clases[3] + ": " + Math.round(resultados[3] * 100).toFixed(2) + "%";

        mostrarInfoEnfermedad(mayorIndice);
      }
      else {
        console.log("El modelo es null");
      }
    }


    var btn_subir_archivo = document.getElementById('btn-subir-img');
    var subir_img = document.getElementById('subir-img');
    var img_subida = document.getElementById('img-subida');
    var json_estados_salud = "";

    function cargarArchivoJson() {
        fetch(location.origin + "/static/data/maize_information.json")
        .then(response => response.json())
        .then(data => {
            json_estados_salud = data;
            console.log(json_estados_salud);
        });
    }
    cargarArchivoJson();

    btn_subir_archivo.onclick = function (e) {
        subir_img.click();
        subir_img.onchange = function() {
            var archivos = subir_img.files;
            //console.log(archivos)
            if (!archivos || !archivos.length) {
                //img_subida.src = "";
                console.log("No se han cargado archivos");
                return;
            }
            var primerArchivo = archivos[0];
            //console.log(primerArchivo)
            var objectURL = URL.createObjectURL(primerArchivo);
            img_subida.src = objectURL;

            realizarPredicciones();
        };
    }

    function mostrarInfoEnfermedad(index_clase) {
        var info_estado_salud = document.getElementById('info_estado_salud');
        info_estado_salud.hidden = false;
        var titulo_estado_salud = document.getElementById('titulo_estado_salud');
        titulo_estado_salud = json_estados_salud[index_clase]['nombre_enfermedad'];

        var nombre_enfermedad = document.getElementById('txt_nombre_enfermedad');
        var nombre_ingles = document.getElementById('txt_nombre_ingles');
        var otros_nombres = document.getElementById('txt_otros_nombres');
        var teleomorfo = document.getElementById('txt_teleomorfo');
        var anamorfo = document.getElementById('txt_anamorfo');
        var causa = document.getElementById('txt_causa');
        var descripcion = document.getElementById('txt_descripcion');
        var sintomas_parent = document.getElementById('txt_sintomas_parent');
        var comentarios = document.getElementById('txt_comentarios');
        var administracion = document.getElementById('txt_administracion');
        var fuentes_parent = document.getElementById('txt_fuentes_parent');

        nombre_enfermedad.innerText = json_estados_salud[index_clase]['nombre_enfermedad'];
        nombre_ingles.innerText = json_estados_salud[index_clase]['nombre_ingles'];
        otros_nombres.innerText = json_estados_salud[index_clase]['otros_nombres'];
        teleomorfo.innerText = json_estados_salud[index_clase]['teleomorfo'];
        anamorfo.innerText = json_estados_salud[index_clase]['anamorfo'];
        causa.innerText = json_estados_salud[index_clase]['causa'];
        descripcion.innerText = json_estados_salud[index_clase]['descripcion'];
        
        for (sintoma of json_estados_salud[index_clase]['sintomas']) {
            var etiqueta = document.createElement('p');
            etiqueta.innerText = sintoma;
            sintomas_parent.appendChild(etiqueta);
        }

        comentarios.innerText = json_estados_salud[index_clase]['comentarios'];
        administracion.innerText = json_estados_salud[index_clase]['administracion'];

        for (let i=0; i< json_estados_salud[index_clase]['fuentes'].length; i++) {
            var enlace = document.createElement('a');
            enlace.classList = "d-block"
            enlace.innerText = json_estados_salud[index_clase]['fuentes'][i]["titulo_fuente"];
            enlace.href = json_estados_salud[index_clase]['fuentes'][i]["enlace"];
            fuentes_parent.appendChild(enlace);
        }
    }
});