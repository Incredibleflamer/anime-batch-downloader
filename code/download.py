import os
import json
from subprocess import call
import subprocess
files = os.listdir()
#gettingconfigfiles
def getConfig():
    with open('../code/data.json' , 'r' , encoding='utf-8') as c:
        return json.load(c)

def setConfig(data):
    with open('../code/data.json' , 'w' , encoding='utf-8') as c:
        json.dump(data , c)
try:
    configdat = getConfig()
    animenamezam = configdat['Anime_name']
    fromanimeep =  configdat['FROM_EP']
    lastanimeep =  configdat['LAST_EP']
except Exception as e:
    print(f'Failed to Fetch data\n{e}')

#download location
def getConfig2():
    with open('../downloadlocation.json' , 'r' , encoding='utf-8') as c:
        return json.load(c)

def setConfig2(data):
    with open('../downloadlocation.json' , 'w' , encoding='utf-8') as c:
        json.dump(data , c)
try:
    configdat = getConfig2()
    downloc = configdat['downloadloc']
except Exception as e:
    print(f'Failed to Fetch data\n{e}')

#some stuff
Qualityzam = " --quality 1080 "
animenamezam = '"' + animenamezam + '"'
if lastanimeep == "0" : 
    rabngetest = "--range " + fromanimeep
else :
    rabngetest = "--range " + fromanimeep + "-" + lastanimeep

#starting the downloader
cmdline = "animdl download " + animenamezam   + rabngetest + Qualityzam


dir = downloc
path = "r" + dir
os.chdir(dir)
rc = call("start cmd /K " + cmdline  , cwd=dir , shell=True )