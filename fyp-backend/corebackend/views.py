from django.shortcuts import render
from corebackend import calculator
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, reverse
import json

def index(request):
    algo_list = calculator.fetch()
    rendered_algo = render_algo(algo_list)
    form = {
        'awgn' : 0,
        'harmonic' : [[0,0]],
        'psmc' : [[0,0]],
    }
    if request.method == "POST":
        awgn = int(request.POST.get("awgn", 0))
        harmonic = []
        psmc = []
        for i in range(9):
            harmonic.append([(i+2), int(request.POST.get("harmonics"+str(i), 0))])
            psmc.append([(i+2), int(request.POST.get("psmc"+str(i), 0))])
        result = calculator.calc_all(algo_list, awgn, harmonic, psmc)
        form = {'awgn': awgn, 'harmonic': map(lambda x: x[1], harmonic), 'psmc': map(lambda x: x[1], psmc)}
        return render(request, "index2.html", {'form':form,'result':result, 'chart':json.dumps(result),  'algo': rendered_algo})
    else:
        result = calculator.calc_all(algo_list, 0, [[0,0]], [[0,0]])
    return render(request, "index2.html", {'form': form, 'result':result, 'chart':json.dumps(result),  'algo': rendered_algo})

@api_view(['GET', 'POST'])
def rest_index(request):
    algo_list = calculator.fetch()
    if request.method == "POST":
        awgn = int(request.data.get("awgn", 0))
        harmonic = request.data.get("ih", [[0,0]])
        psmc = request.data.get("psmc", [[0,0]])
        result = calculator.calc_all(algo_list, awgn, harmonic, psmc)
        toggle = request.data.get("toggle", 0)
        threshold = request.data.get("threshold", 0)
        if toggle:
            newDict = {}
            for key, value in result.items():
                if value[4] <= threshold:
                    newDict[key] = value
            result = newDict
        return Response({'result': result}, status=status.HTTP_200_OK)
    else:
        result = calculator.calc_all(algo_list, 0, [], [])
    return Response({'result': result }, status=status.HTTP_200_OK)


def render_algo(algo_list):
    rendered_algo = {}
    for key, value in algo_list.items():
        temp = render_one(value)
        rendered_algo[key]= temp
    return rendered_algo

def render_one(value):
    temp = "$$ \\theta = \\tan^{-1}( \\frac{"
    iternum = 1
    start = 0
    brk = False
    for k in value['s']:
        j = str(round(k, 2))
        if iternum > 8:
            iternum = len(value["s"])
            for test in value['s'][::-1]:
                if iternum == 7:
                    break
                elif abs(test) < 1e-9:
                    iternum -= 1
                else:
                    temp += "..."
                    j = str(round(test, 2))
                    break

            brk = True
            if iternum < 7:
                break
        iter = str(iternum)
        if start == 0 and abs(k) < 1e-9 :
            iternum += 1
            continue
        elif start == 0:
            start = 1
            if k == 1:
                temp += "I" + iter + " "
            elif k == -1:
                temp += "-I" + iter + " "
            else:
                temp += j + "I" + iter + " "
        else:
            if abs(k) < 1e-9:
                iternum += 1
                continue
            elif k == 1:
                temp += "+I" + iter + " "
            elif k == -1:
                temp += "-I" + iter + " "
            elif k > 0:
                temp += "+" + j + "I" + iter + " "
            else:
                temp += j + "I" + iter + " "
        iternum += 1
        if brk:
            break
    temp += "}{"
    iternum = 1
    start = 0
    brk = False
    for k in value['c']:
        j = str(round(k, 2))
        if iternum > 8:
            iternum = len(value["c"])
            for test in value['c'][::-1]:
                if iternum == 7:
                    break
                elif abs(test) < 1e-9:
                    iternum -= 1
                else:
                    temp += "..."
                    j = str(round(test, 2))
                    break

            brk = True
            if iternum < 7:
                break
        iter = str(iternum)
        if start == 0 and abs(k) < 1e-9:
            iternum += 1
            continue
        elif start == 0:
            start = 1
            if k == 1:
                temp += "I" + iter + " "
            elif k == -1:
                temp += "-I" + iter + " "
            else:
                temp += j + "I" + iter + " "
        else:
            if abs(k) < 1e-9 :
                iternum += 1
                continue
            elif k == 1:
                temp += "+I" + iter + " "
            elif k == -1:
                temp += "-I" + iter + " "
            elif k > 0:
                temp += "+" + j + "I" + iter + " "
            else:
                temp += j + "I" + iter + " "
        iternum += 1
        if brk:
            break
    temp += "}) $$"
    return temp

@api_view(['POST'])
def rest_render_algo(request):
    if request.method == "POST":
        algo_name = request.data.get("algo", 0)
        if algo_name == "init":
            return Response({"message": ["",""]}, status=status.HTTP_200_OK)
        algo_list = calculator.fetch()
        try:
            print(algo_name)
            value = algo_list[algo_name]
        except:
            return  Response({"message": ["Error! Algorithm is not available",""]}, status=status.HTTP_400_BAD_REQUEST)
        rendered = render_one(value)
        angle = ""
        if algo_name[0] == "N":
            angle = "$$ \\triangle\\theta = \\frac{2\pi}{" + str(value["f"]) + " }$$"
        elif algo_name[0] == "W":
            angle = "$$ \\triangle\\theta = \\frac{2\pi}{" + str(value["f"]+1//2) + " }$$"
        elif algo_name[0] == "A":
            angle = "$$ \\triangle\\theta = \\frac{2\pi}{" + str(value["f"]-1) + " }$$"
        elif algo_name[0] == "P":
            angle = "$$ \\triangle\\theta = \\frac{2\pi}{" + str(value["f"]-1) + " }$$"
        elif algo_name[0] == "H":
            angle = "$$ \\triangle\\theta = \\frac{2\pi}{" + str(value["f"]-2) + " }$$"
        return Response({"message": [rendered,angle] }, status=status.HTTP_200_OK)

