import numpy as np
import json
import pprint
from calculator import calculate_simulation

def generate_n(fn):
    if fn < 3:
        return {}
    else:
        data = {
            "f": fn,
            "s": [-1*np.sin(i*2*np.pi/fn) for i in range(0,fn)],
            "c": [np.cos(i*2*np.pi/fn) for i in range(0, fn)],
            "p": [i*2*np.pi/fn for i in range(fn) ]
        }
        return data

def generate_avgplus1(fn):
    if fn < 5:
        return {}
    else:
        base = generate_n(fn-1)
        s,c = base["s"], base["c"]
        data = {
            "f": fn,
            "s": [(i-j) for i, j in zip(s + [0, 0], [0, 0] + s)],
            "c": [(i-j) for i, j in zip(c + [0, 0], [0, 0] + c)],
            "p": [i*2*np.pi/(fn-1)  for i in range(fn)]
        }
        data["s"][1] = data["s"][-1] + data["s"][1]
        data["c"][1] = data["c"][-1] + data["c"][1]
        data["s"].pop()
        data["c"].pop()
        ps = calculate_simulation(data)
        realp= [i-ps for i in data["p"]]
        data["p"] = realp
        return data

def generate_wdft(fn):
    if fn < 5:
        return {}
    elif fn % 2 != 1:
        return {}
    else:
        N = (fn+1)//2
        s = [-1*i*np.sin(2*np.pi*i/N) for i in range(1,N)] +[0] + [i*np.sin(2*np.pi/N*i) for i in range(N-1, 0, -1)]
        c = [i*np.cos(2*np.pi*i/N) for i in range(1, N)] + [N] + [i*np.cos(2*np.pi/N*i) for i in range(N-1, 0, -1)]
        p = [i*2*np.pi/N for i in range(1, fn+1)]
        data = {
            "f": fn,
            "s": s,
            "c": c,
            "p": p
        }
        return data

def generate_hibino(fn):
    if fn < 5:
        return {}
    else:
        n = fn - 4
        n3 = 3*np.pi/(n+2)
        n2 = 2*np.pi/(n+2)
        s1 = 0.25*np.sin(n3)/(np.sin(n2)**2)
        c1 = 0.25*np.cos(n3)/(np.sin(n2)**2)
        s = []
        c = []
        for i in range(fn):
            cnts = 0
            cntc = 0
            if i == 0:
                cnts += s1
                cntc += c1
            elif i==1:
                cnts += s1
                cntc -= c1
            elif i == fn-2:
                cnts -= s1
                cntc -= c1
            elif i == (fn - 1):
                cnts -= s1
                cntc += c1
            if fn - 1 > i > 0:
                cnts += np.sin((n2)*(i+1-(n+5)/2))
                cntc += np.cos((n2)*(i+1-(n+5)/2))
            s.append(cnts)
            c.append(-1*cntc)
        p = [n2*(i-(n+5)/2) for i in range(1, fn+1)]
        data = {
            's': s,
            'c': c,
            'p': p,
            'f': fn
        }
        ps = calculate_simulation(data)
        realp = [i - ps for i in data["p"]]
        data["p"] = realp
        return data

def generate_nplusonea(fn):
    if fn < 4:
        return {}
    else:
        n = fn - 1
        s = [0] + [np.sin(i*2*np.pi/n) for i in range(1, n)] + [0]
        c = [-0.5] + [-np.cos(i*2*np.pi/n) for i in range(1, n)] + [-0.5]
        p = [i*2*np.pi/n for i in range(0, fn+1)]
        data = {
            's': s, 'c':c, 'p':p, 'f':fn
        }
        ps = calculate_simulation(data)
        realp = [i - ps for i in data["p"]]
        data["p"] = realp
        return data
def write_to_json():
    algoList = {}
    for i in range(3, 21):
       algoList["N"+str(i)] = generate_n(i)
    for i in range(5, 21, 2):
        algoList["WDFT"+str(i)] = generate_wdft(i)
    for i in range(4, 21):
        algoList["PO" + str(i)] = generate_nplusonea(i)
    for i in range(5, 21):
        algoList["AVG" + str(i)] = generate_avgplus1(i)
    for i in range(5, 21):
        algoList["H" + str(i)] = generate_hibino(i)
    return algoList


with open('static/algo_real.json', 'w') as outfile:
    json.dump(write_to_json(), outfile)
