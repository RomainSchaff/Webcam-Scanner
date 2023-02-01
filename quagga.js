const toggleScanButton = document.getElementById("scan_stop_button");

let scanning = false;

// Configuration de QuaggaJS
Quagga.init(
  {
    inputStream: {
      name: "Live",
      type: "LiveStream",
      numOfWorkers: navigator.hardwareConcurrency,
      target: document.getElementById("videoElement"),
    },
    decoder: {
      readers: [
        "code_128_reader",
        "ean_reader",
        "ean_8_reader",
        "code_39_reader",
        "code_39_vin_reader",
        "codabar_reader",
        "upc_reader",
        "upc_e_reader",
        "i2of5_reader",
      ],
    },
    locate: true,
  },
  function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Quagga Initialization finished. Ready to start");
  }
);

toggleScanButton.addEventListener("click", () => {
  if (scanning) {
    Quagga.stop();
    Quagga.offProcessed();
    console.log("Quagga fait la grève");
    toggleScanButton.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i>`;
    scanning = false;
  } else if (!scanning) {
    // Configuration de QuaggaJS
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          numOfWorkers: navigator.hardwareConcurrency,
          target: document.getElementById("videoElement"),
        },
        decoder: {
          readers: [
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "upc_reader",
            "upc_e_reader",
            "i2of5_reader",
          ],
        },
        locate: true,
      },
      function (err) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Quagga Initialization finished. Ready to start");
        Quagga.start();
      }
    );
    console.log("Quagga prêt pour le décollage");
    toggleScanButton.innerHTML = `<i class="fa-regular fa-rectangle-xmark"></i>`;
    scanning = true;
  }
});

// Ajout d'un gestionnaire d'événement pour la détection de codes à barres
Quagga.onDetected(function (result) {
  const date1 = dateFormat();
  lastDiv.innerHTML += `
  <div class="code_result_container">
  <p class="${result.codeResult.code}">Dernièrement scanner le: ${date1}</p>
  <p class="${result.codeResult.code}">${result.codeResult.format}</p>
  <p class="${result.codeResult.code}">${result.codeResult.code}</p>
  <button id="barcodeAPI">
    <i class="fa-solid fa-magnifying-glass"></i>
  </button></div>`;

  fetch(`server3.php?code=${result.codeResult.code}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data[0]) {
        // lastDiv.innerHTML += `<p>Code présent dans la BDD depuis le : ${data[0].date} </p>`;
        alert(`Code présent dans la BDD depuis le : ${data[0].date}`);
        lastDiv.lastElementChild.style.backgroundColor = "green";
      } else {
        const data = new FormData();
        data.append("code", result.codeResult.code);
        data.append("date", date1);
        data.append("type", result.codeResult.format);
        fetch("server3.php", {
          method: "POST",
          body: data,
        })
          .then((response) => response.text())
          .then((data) => {
            console.log(data);
            alert(`Code ajouté à la BDD`);
            lastDiv.lastElementChild.style.backgroundColor = "orange";
          })
          .catch((err) => {
            throw err;
          });
      }
    })
    .catch((error) => {
      throw error;
    });
  Quagga.stop();
  Quagga.offProcessed();
  console.log(result.codeResult.format, " détecté:", result.codeResult.code);
});
