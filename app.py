from flask import Flask, jsonify, request, render_template
from ultralytics import YOLO

import numpy as np
import cv2

app = Flask(__name__)
model = YOLO("yolo11n.pt")

@app.route("/detect", methods=["POST"])
def detect():
    img_data = request.files['image'].read()
    nparr = np.frombuffer(img_data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    results = model.predict(image)

    df = results[0].pandas().xyxy[0]
    print(
        jsonify(df.to_dict(orient="records"))
    )
    return jsonify(df.to_dict(orient="records"))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

# commit test