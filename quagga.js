// Configuration de QuaggaJS
Quagga.init(
  {
    inputStream: {
      type: "Live",
      constraints: {
        width: 640,
        height: 480,
        facingMode: "environment",
      },
    },
    locator: {
      patchSize: "medium",
      halfSample: true,
    },
    numOfWorkers: 2,
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

// Ajout d'un gestionnaire d'événement pour la détection de codes à barres
Quagga.onDetected(function (result) {
  console.log("Code barre/QR code détecté:", result.codeResult.code);
});
