from django.shortcuts import render, get_object_or_404
from .models import HangmanModel
from django.http import JsonResponse

def createSession(request):
    hangman_run = HangmanModel()
    hangman_run.initialize()
    hangman_run.save()
    return render(request, 'hangman/hangman.html', {'context': hangman_run})


def updateSession(request):
    uuid_value = request.POST.get('uuid', None)
    character_input = request.POST.get('characterInput', None)
    if uuid_value:
        entry = get_object_or_404(HangmanModel, sessionId=uuid_value)
        entry.update(character_input)
        if(entry.result == 'IN_PROGRESS'):
            return JsonResponse({'currentAnswer': entry.currentAnswer, 'result': entry.result, 'attempts': entry.numberOfAttempts})
        else:
            return JsonResponse({'currentAnswer': entry.currentAnswer, 'result': entry.result, 'answer': entry.answer})
    else:
        return JsonResponse({'error_message': 'Session not found'}, status=400)
    