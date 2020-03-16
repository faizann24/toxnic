# Toxnic - Hate Free Internet


<p align="center" style="margin-top: 12px; margin-bottom: 12px;">
<img src="https://faizanahmad.tech/toxnic/img/logo-tight.png" width="356">
</p>



Toxnic analyzes content on social media platforms and uses deep learning to block out the toxic posts and comments.

## Files Description
| Path | Description
| :--- | :----------
| toxnic | Main folder.
| &boxur;&nbsp; figs | Folder to store images used in the extension.
| &boxvr;&nbsp; communication.js | Script that communicates with content script from the extension popup.
| &boxvr;&nbsp; jquery-3.3.1.min.js | Jquery needed to run some basic stuff.
| &boxvr;&nbsp; manifest.json | Json file containing metadata of the extension.
| &boxvr;&nbsp; popup.html | HTML file of the extension popup. This pops up when you click on the extension icon.
| &boxvr;&nbsp; tf.min.js | Tensorflow js.
| &boxvr;&nbsp; tfjs.js | Tensorflow js.
| &boxvr;&nbsp; toxnic.js | Content script that is injected into web pages to filter out the toxic content.
| &boxvr;&nbsp; vocabs.js | Vocabulary file for the deep learning model. It contains mapping from words to ids.

## How it works
Toxnic encompasses a deep learning convolutional neural network (CNN) model that is trained on a large [toxic content classification](https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge/data) data set for classifying textual content into toxic/non-toxic categories. The model achieves an accuracy of 93% on the held out test set.

#### 1. Deep Learning Model
Using the [toxic content](https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge/data) data set, a simple CNN model is trained for text classification. It contains two convolutional layers followed by a max pooling layer which is finally used with 2 dense layers for classification. The vocabulary for the model is created by removing all words that appear less than 10 times in the data set. This gives us a set of almost 2k words in the vocabulary which are given in vocab.js. The pre-trained models are hosted on faizanahmad.tech.

#### 2. Browser Extension
Once the deep learning model is trained, it is converted into a format that can be used with [Tensorflow Js](https://www.tensorflow.org/js). The model is loaded into the content script which applies it on every textual content on the website. Right now, the extension works on the following websites:
- Facebook (Posts, Comments)
- Twitter (Tweets, Comments)
- Youtube (Comments)

## Modifying Extension
If you want to modify this extension, here are a couple of things you might want to try.
- **Threshold Value** - Right now, a threshold value of 0.7 is used for toxic content classification. If the probability that the content is toxic is above 0.7, it is filtered from the page. You can try changing this value to get different filtering results.
```javascript
//toxnic.js
[2] let THRESHOLD = 0.7;
```
- **Deep Learning Model** - Currently, a CNN is used for text classification which is hosted on faizanahmad.tech. One can use a different model trained on a different data set by replacing the model in the toxnic.js file and replacing the vocab.js file in the root directory with new vocabulary.
```javascript
//toxnic.js
[18]const loadModel = async () => {
    console.log("Loading model...");
    const url = 'https://faizanahmad.tech/model2/model.json';
    const _model = await tf.loadLayersModel(url);
    return _model;
};
```
In order to convert tensorflow and keras models to tensorflow js, there is a nice guide on the [tensorflow website](https://www.tensorflow.org/js/guide/conversion)