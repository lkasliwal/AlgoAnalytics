import torch
from flask import Flask, jsonify, request

# Load the pre-trained model
model = torch.load("model.pt")

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    # Parse the incoming data
    data = request.json
    input = torch.from_numpy(data)

    # Pass the input through the model
    output = model(input)

    # Return the predicted output
    return jsonify(output.tolist())

if __name__ == "__main__":
    app.run()