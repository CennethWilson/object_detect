const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
});

setInterval(() => {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append("image", blob, "frame.png");

    const response = await fetch("/detect", {
      method: "POST",
      body: formData
    });

    const detections = await response.json();
    drawBoxes(detections);
  }, "image/png");
}, 500);

function drawBoxes(detections) {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "lime";
  ctx.lineWidth = 2;
  ctx.font = "16px Arial";
  ctx.fillStyle = "yellow";

  detections.forEach(det => {
    ctx.strokeRect(det.xmin, det.ymin, det.xmax - det.xmin, det.ymax - det.ymin);
    ctx.fillText(det.name + " (" + Math.round(det.confidence * 100) + "%)", det.xmin, det.ymin - 5);
  });
}