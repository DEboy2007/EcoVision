import io
from PIL import Image
from flask import Flask, request
import nest_asyncio
from ultralytics import YOLO
app = Flask(__name__)
model = YOLO('best.pt')


@app.route("/objectdetection/", methods=["POST"])
def predict():
    if not request.method == "POST":
        return 432

    if request.files.get("image"):
        image_file = request.files["image"]
        image_bytes = image_file.read()
        img = Image.open(io.BytesIO(image_bytes))
        results = model(img)
        results_json = {"boxes": results[0].boxes.xyxy.tolist(
        ), "classes": results[0].boxes.cls.tolist()}
        lisst = {0: 'Aluminium foil', 1: 'Bottle cap', 2: 'Bottle', 3: 'Broken glass', 4: 'Can', 5: 'Carton', 6: 'Cigarette', 7: 'Cup', 8: 'Lid', 9: 'Other litter',
                 10: 'Other plastic', 11: 'Paper', 12: 'Plastic bag - wrapper', 13: 'Plastic container', 14: 'Pop tab', 15: 'Straw', 16: 'Styrofoam piece', 17: 'Unlabeled litter'}
        p = []
        print(results_json["classes"])
        for i in results_json["classes"]:
            p.append(lisst[i])
        return {"result": list(set(p))}


if __name__ == "__main__":

    app.run()
