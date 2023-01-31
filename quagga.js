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
    console.log("Initialization finished. Ready to start");
    Quagga.start();
  }
);

let barcode;

// Ajout d'un gestionnaire d'événement pour la détection de codes à barres
Quagga.onDetected(function (result) {
  lastDiv.innerHTML += `
  <button id="barcodeAPI">
    <i class="fa-solid fa-magnifying-glass"></i>
  </button>
  <p id="${result.codeResult.code}">Code barre/QR code détecté: ${result.codeResult.code}</p>`;
  const paragrapheAPI = document.getElementById(`${result.codeResult.code}`);
  paragrapheAPI
    ? fetch(`server3.php?code=${result.codeResult.code}`)
        .then((response) => response.text())
        .then((data) => {
          lastDiv.innerHTML += `<p>${data}</p>`;
        })
        .catch((error) => {
          throw error;
        })
    : console.log("Aurevoir");
  Quagga.stop();
  Quagga.offProcessed();
  console.log("Code barre/QR code détecté:", result.codeResult.code);
});
