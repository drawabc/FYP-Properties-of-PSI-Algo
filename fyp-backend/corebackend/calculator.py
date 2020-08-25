import numpy as np
import json
import math
import matplotlib.pyplot as plt
#from corebackend import generator

def fetch():
    with open("corebackend/static/algo_real.json", "r") as data_file:
        algo = json.load(data_file)
    return algo

def calc_all(algoList, awgn, harmonic, psmc):
    result = {}
    x = np.arange(-3.14, math.pi, 0.01)
    #x = np.arange(0.01, 0.02, 0.01)
    for key,value in algoList.items():
        st, ct, pt, fn= np.asarray(value["s"]), np.asarray(value["c"]), np.asarray(value["p"]), value["f"]
        result[key] = []
        result[key].append(int(fn))
        result[key].append(calc_awgn(x, st, ct, pt, awgn))
        result[key].append(calc_harmonic(x, st, ct, pt, harmonic))
        result[key].append(calc_psmc(x, st, ct, pt, psmc))
        total = 0
        for f in range(1,4):
            total += result[key][f]**2
        total = math.sqrt(total)
        result[key].append(total)
    return result

def calc_awgn(x, st, ct, pt, awgn):
    IN = np.zeros([0, len(x)])
    for i in range(len(st)):
        temp_IN = (0.5 + 0.5 * np.cos(x + pt[i]) + awgn / 100 * 0.5 * np.random.normal(0, 1, len(x)))
        IN = np.append(IN, [temp_IN], axis=0)
    phi = phasecalculation(IN, st, ct)
    lam = np.unwrap(np.angle(np.exp(1j * (phi - x))))
    lam = (lam + np.pi) % (2*np.pi) - np.pi
    errorawgn = np.std(lam)
    return errorawgn

def calculate_simulation(data):
    x = np.arange(-3.14, math.pi, 0.01)
    st = data["s"]
    ct = data["c"]
    pt = data["p"]
    IN = np.zeros([0, len(x)])
    for i in range(len(st)):
        temp_IN = 0.5 + 0.5 * np.cos(x + pt[i])
        IN = np.append(IN, [temp_IN], axis=0)
    phi = phasecalculation(IN, st, ct)
    lam = np.unwrap(np.angle(np.exp(1j * (phi - x))))
    lam = (lam + np.pi) % (2 * np.pi) - np.pi
    return np.average(lam)

def calc_harmonic(x, st, ct, pt, harmonic):
    IN = np.zeros([0, len(x)])
    for i in range(len(st)):
        temp_IN = 0.5+ 0.5*np.cos(x+pt[i])
        for j in harmonic:
            temp_IN += (0.5*j[1]/100)*np.cos((j[0])*(x+pt[i]))
        IN = np.append(IN, [temp_IN], axis=0)
    phi = phasecalculation(IN, st, ct)
    lam = np.unwrap(np.angle(np.exp(1j * (phi - x))))
    lam = (lam + np.pi) % (2 * np.pi) - np.pi
    ih = np.std(lam)
    return ih

def calc_psmc(x, st, ct, pt, psmc):
    IN = np.zeros([0, len(x)])
    phase = pt[1] - pt[0]
    for i in range(len(st)):
        temp_arg = x + pt[i]
        for j in psmc:
            temp_arg += i*(j[1]/100)*(phase**(j[0]))
        temp_IN = 0.5 + 0.5*np.cos(temp_arg)
        IN = np.append(IN, [temp_IN], axis=0)
    phi = phasecalculation(IN, st, ct)
    lam = np.unwrap(np.angle(np.exp(1j * (phi - x))))
    lam = (lam + np.pi) % (2 * np.pi) - np.pi
    #psmc = np.sqrt(np.sum(lam**2)/len(lam))
    psmc = np.std(lam)
    return psmc

def phasecalculation(IN, st, ct):
    t = np.zeros(IN.shape[1])
    b = np.zeros(IN.shape[1])
    for i in range(len(st)):
        t = t + IN[i]*st[i]
        b = b + IN[i]*ct[i]
    phi = np.arctan2(t, b)
    return phi


def debug():
    awgn = 0
    harmonic = [[0,0]]
    psmc = [[0,0]]
    lst = fetch()
    print(calc_all(lst, awgn, harmonic, psmc))

