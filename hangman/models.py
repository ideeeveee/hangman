from django.conf import settings
from django.db import models
from django.utils import timezone
from uuid import uuid4

import requests
import random

class Result(models.TextChoices):
    IN_PROGRESS = 'IN_PROGRESS'
    WIN = 'WIN'
    LOSE = 'LOSE'

class HangmanModel(models.Model):
    sessionId = models.UUIDField(primary_key=True, editable=False)
    answer = models.TextField()
    numberOfAttempts = models.PositiveSmallIntegerField()
    maxNumberOfAttempts = models.PositiveSmallIntegerField()
    currentAnswer = models.TextField()
    result = models.CharField(choices=Result.choices, max_length=11)


    def initialize(self, *args, **kwargs):
        super(HangmanModel, self).__init__(*args, **kwargs)
        self.sessionId = uuid4()
        self.answer = HangmanUtil.generateRandomWord().lower()
        self.numberOfAttempts = 0
        self.maxNumberOfAttempts = 7
        self.currentAnswer = HangmanUtil.setInitAnswer(len(self.answer))
        self.result = Result.IN_PROGRESS

    def update(self, guess):
        if(self.result != Result.IN_PROGRESS):
            return AttemptResponse(self.result, self.currentAnswer, self.maxNumberOfAttempts-self.numberOfAttempts, self.answer)
        
        for j in range(len(self.answer)):
            if(self.answer[j] == guess):
                self.currentAnswer = self.currentAnswer[:j] + self.answer[j] + self.currentAnswer[j+1:]
        if(not guess in self.answer):
            self.numberOfAttempts += 1

        if(self.numberOfAttempts >= self.maxNumberOfAttempts and self.answer != self.currentAnswer):
            self.result = Result.LOSE
            self.save()
            return AttemptResponse(self.result, self.currentAnswer, self.maxNumberOfAttempts-self.numberOfAttempts, self.answer)
        if(self.numberOfAttempts <= self.maxNumberOfAttempts and self.answer == self.currentAnswer):
            self.result = Result.WIN
            self.save()
            return AttemptResponse(self.result, self.currentAnswer, self.maxNumberOfAttempts-self.numberOfAttempts, self.answer)
        self.save()
        return AttemptResponse(self.result, self.currentAnswer, self.maxNumberOfAttempts-self.numberOfAttempts)

class HangmanUtil():
    def generateRandomWord():
        word_site = "https://www.mit.edu/~ecprice/wordlist.10000"
        response = requests.get(word_site)
        WORDS = response.content.splitlines()

        genFlag = True
        while genFlag:
            answer = random.choice(WORDS).decode("utf-8")
            genFlag =  (" " in answer) | (len(answer) < 7) | (len(answer) > 10)
        return answer
    
    def setInitAnswer(length):
        attemptAnswer = ""
        for i in range(length):
            attemptAnswer += "_"
        return attemptAnswer

class AttemptResponse:
    def __init__(self, result, currentAnswer, attemptsLeft, answer=''):
        self.result = result
        self.currentAnswer = currentAnswer
        self.attemptsLeft = attemptsLeft
        self.answer = answer
        pass

    def __str__(self):
        if self.result == Result.IN_PROGRESS:
            return f"You have {self.attemptsLeft} attempts left"
        elif self.result == Result.WIN:
            return f"You won!"
        elif self.result == Result.LOSE:
            return f"The answer is {self.answer}"
