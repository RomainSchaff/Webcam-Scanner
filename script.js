const video = document.getElementById("videoElement");
const buttonFetch = document.getElementById("fetch");
const downloadButton = document.getElementById("download_video_button");
const canvas = document.getElementById("canvas_photo");
const buttonDiv = document.getElementById("button_div");
const savedVideo = document.getElementById("savedVideo");
const container = document.getElementById("container");
const cancelButton = document.getElementById("cancel");
const PlayStopButton = document.getElementById("play_stop_button");
const TakeSavePictureButton = document.getElementById(
  "take_save_picture_button"
);

let stream;
let mediaRecorder;
let chunks = [];
let playing = false;
let picture = false;

function dateFormat() {
  const date = new Date();
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const jour = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const mois =
    date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  const annee = date.getFullYear();
  const dateFormatee = `${annee}-${mois}-${jour} ${hours}:${minutes}:${seconds}`;
  return dateFormatee;
}

PlayStopButton.addEventListener("click", () => {
  if (playing) {
    if (mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    console.log(mediaRecorder.state);
    stream.getVideoTracks().forEach((track) => track.stop());
    TakeSavePictureButton.classList += "disabled_button";
    playing = false;
    PlayStopButton.innerHTML = `<i class="fa-solid fa-play"></i>`;
  } else {
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      console.log("Prêt à travailler !");

      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then(function (s) {
          stream = s;
          video.srcObject = stream;
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.start();
          console.log(mediaRecorder.state);
          mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
          };
          mediaRecorder.onstop = function () {
            const lien = document.querySelector("a");
            if (lien !== null) {
              lien.remove();
            }
            const blob = new Blob(chunks, { type: "video/mp4" });
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            let base64;
            reader.onload = function () {
              console.log(reader.result);
              base64 = reader.result;
            };
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            const date = dateFormat();
            savedVideo.src = url;
            buttonDiv.appendChild(a);
            a.innerText = "Download";
            a.href = url;
            a.download = `enregistrementdu${date}.mp4`;
            a.onclick = function (e) {
              e.preventDefault();
              const date = dateFormat();
              var xhr = new XMLHttpRequest();
              xhr.open("POST", "./server.php");
              xhr.setRequestHeader(
                "Content-Type",
                "application/x-www-form-urlencoded"
              );
              xhr.send(
                "video_data=" + encodeURIComponent(base64) + "&date=" + date
              );
              alert("Vidéo enregistré avec succès");
            };
          };
          cancelButton.disabled = false;
          cancelButton.removeAttribute("class");
          playing = true;
          PlayStopButton.innerHTML = `<i class="fa-solid fa-pause"></i>`;
          TakeSavePictureButton.removeAttribute("class");
          let videoTracks = s.getVideoTracks();
          videoTracks.forEach(function (track) {
            let settings = track.getSettings();
            console.log(settings.width + "x" + settings.height);
          });
        })
        .catch(function (error) {
          console.log(`Something wrong: ${error}`);
        });
      setTimeout(function () {
        if (mediaRecorder.state !== "inactive") {
          mediaRecorder.stop();
        }
      }, 6000);
    } else {
      console.log("getUserMedia not supported!");
    }
  }
});

// buttonStop.addEventListener("click", () => {
//   if (mediaRecorder.state !== "inactive") {
//     mediaRecorder.stop();
//   }
//   console.log(mediaRecorder.state);
//   stream.getVideoTracks().forEach((track) => track.stop());
//   buttonStart.removeAttribute("class");
//   buttonStart.disabled = false;
//   buttonStop.className += "disabled_button";
//   buttonStop.disabled = true;
//   buttonStop.disabled = true;
//   buttonTakePhoto.disabled = true;
//   buttonTakePhoto.classList += "disabled_button";
// });

TakeSavePictureButton.addEventListener("click", () => {
  if (playing && picture == false) {
    const ctx = canvas.getContext("2d");
    // Redimensionnez le canvas pour correspondre à la taille de l'élément video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    // Dessinez l'image sur le canvas à partir de l'élément video
    ctx.drawImage(video, 0, 0);
    picture = true;
    TakeSavePictureButton.innerHTML = `<i class="fa-solid fa-sd-card"></i>`;
  } else if (picture == true) {
    const imagedata = canvas.toDataURL("image/jpeg");
    console.log(imagedata);
    console.log(encodeURIComponent(imagedata));
    const date = dateFormat();
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "./server.php");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("image_data=" + encodeURIComponent(imagedata) + "&date=" + date);
    alert("Image enregistré avec succès");
    TakeSavePictureButton.innerHTML = `<i class="fa-solid fa-camera-retro"></i>`;
    picture = false;
  } else {
    alert("Vous devez activer la vidéo avant de prendre une photo");
  }
});

buttonFetch.addEventListener("click", () => {
  fetch("server2.php?id=61")
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      // Convert a base64-encoded string to a Blob object
      function base64_to_blob(data) {
        // Convert the base64-encoded data to a Uint8Array
        const binary_string = window.atob(data);
        const len = binary_string.length;
        const buffer = new ArrayBuffer(len);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < len; i++) {
          view[i] = binary_string.charCodeAt(i);
        }
        // Return the Blob object
        return new Blob([view], { type: "video/mp4" });
      }

      // const base64_data = `data:video/mp4;base64,${data}`;
      // console.log(base64_data);
      const blob = base64_to_blob(data);
      const videoUrl = URL.createObjectURL(blob);

      // Create an object URL from the base64-encoded data
      // Set the object URL as the video source
      savedVideo.src = videoUrl;
      cancelButton.disabled = false;
      cancelButton.removeAttribute("class");
    })
    .catch((err) => console.log(err));
});

cancelButton.addEventListener("click", () => {
  const lien = document.querySelector("a");
  if (lien !== null) {
    lien.remove();
  }
  savedVideo.src = "";
  cancelButton.removeAttribute("class");
  cancelButton.classList += "disabled_button";
});
