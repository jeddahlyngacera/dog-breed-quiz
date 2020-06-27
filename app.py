from flask import Flask
app = Flask(__name__, static_folder='web')

from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications.vgg16 import preprocess_input, decode_predictions, VGG16
import tensorflow as tf

config = tf.ConfigProto(
    device_count={'GPU': 1},
    intra_op_parallelism_threads=1,
    allow_soft_placement=True
)

config.gpu_options.allow_growth = True
config.gpu_options.per_process_gpu_memory_fraction = 0.6

session = tf.Session(config=config)

tf.keras.backend.set_session(session)

model = VGG16()

import json

@app.route('/data/choices')
def choices():
    with open('data/choices.json', 'r') as f:
        choices = json.load(f)
        return choices    

@app.route('/quiz/question/<string:item_no>/')
def predict(item_no):
    with session.as_default():
        with session.graph.as_default():
            res = {}
            image = load_img('data/'+item_no+'.jpg', target_size=(224, 224))
            image = img_to_array(image)
            image = image.reshape((1, image.shape[0], image.shape[1], image.shape[2]))
            image = preprocess_input(image)
            y = model.predict(image)
            label = decode_predictions(y)[0][:3]
            res['top3'] = [(i[1], round(i[2]*100, 2)) for i in label]
            return res

if __name__ == '__main__':
    app.run()
