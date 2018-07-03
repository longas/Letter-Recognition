# %%
from tensorflow.python.keras.preprocessing.image import ImageDataGenerator

base_dir = 'data'

datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=10,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.1,
    zoom_range=0.1,
    validation_split=0.2)

train_generator = datagen.flow_from_directory(
    base_dir,
    target_size=(28, 28),
    color_mode='grayscale',
    subset='training'
)

validation_generator = datagen.flow_from_directory(
    base_dir,
    target_size=(28, 28),
    color_mode='grayscale',
    batch_size=250,
    subset='validation'
)

# %%
import tensorflow as tf
from tensorflow.python.keras.models import Model
from tensorflow.python.keras import layers
from tensorflow.python.keras import backend as K
from tensorflow.python.keras.optimizers import RMSprop, Adam
from tensorflow.python.keras.callbacks import TensorBoard

K.clear_session()

img_input = layers.Input(shape=(28, 28, 1))
x = layers.Conv2D(32, 3, activation='relu')(img_input)
x = layers.Conv2D(64, 3, activation='relu')(x)
x = layers.MaxPooling2D(2, 2)(x)
x = layers.Dropout(0.25)(x)
x = layers.Flatten()(x)
x = layers.Dense(128, activation='relu')(x)
x = layers.Dropout(0.5)(x)
output = layers.Dense(26, activation='softmax')(x)

model = Model(img_input, output)

model.compile(loss='categorical_crossentropy',
              optimizer=Adam(),
              metrics=['acc'])

# %%
history = model.fit_generator(
    train_generator,
    steps_per_epoch=100,
    epochs=10,
    validation_data=validation_generator,
    validation_steps=50,
    verbose=2)

# %%
model.save('letter-model.h5')
