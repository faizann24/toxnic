# Toxnic - Hate Free Internet


<p align="center" style="margin-top: 12px; margin-bottom: 12px;">
<img src="https://faizanahmad.tech/toxnic/img/logo-tight.png" width="356">
</p>



Toxnic analyzes content on social media platforms and uses deep learning to block out the toxic posts and comments.

### Files Description
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
Toxnic encompasses a deep learning convolutional neural network model that is trained on a large [toxic content classification](https://www.kaggle.com/c/jigsaw-toxic-comment-classification-challenge/data) data set for classifying textual content into toxic/non-toxic categories. The model achieves an accuracy of 93% on the held out test set.