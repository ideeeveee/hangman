import nltk
from nltk.corpus import wordnet

import random

from django.apps import apps

def loadWordList():
    nltk.download('wordnet')
    return [synset.lemmas()[0].name() for synset in wordnet.all_synsets(wordnet.NOUN)]

class HangmanUtil():

    def generateRandomWord():
        genFlag = True
        while genFlag:
            answer = random.choice(apps.app_configs.get('hangman').nouns)
            genFlag =  (" " in answer) | (len(answer) < 7) | (len(answer) > 10) | ("_" in answer)
        return answer
    
    def setInitAnswer(length):
        attemptAnswer = ""
        for i in range(length):
            attemptAnswer += "_"
        return attemptAnswer