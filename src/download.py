import os
import json
from subprocess import call
import subprocess
files = os.listdir()
#gettingconfigfiles
def getConfig():
    with open('./data.json' , 'r' , encoding='utf-8') as c:
        return json.load(c)

def setConfig(data):
    with open('./data.json' , 'w' , encoding='utf-8') as c:
        json.dump(data , c)
try:
    configdatanime = getConfig()
    animenamezam = configdatanime['Anime_name']
    fromanimeep =  configdatanime['FROM_EP']
    lastanimeep =  configdatanime['LAST_EP']
except Exception as e:
    print(f'Failed to Fetch data\n{e}')

#download location
def getConfig2():
    with open('../config.json' , 'r' , encoding='utf-8') as c:
        return json.load(c)

def setConfig2(data):
    with open('../config.json' , 'w' , encoding='utf-8') as c:
        json.dump(data , c)
try:
    configdat = getConfig2()
    quality = configdat['quality']
    dub_sub = configdat['dub_sub']
    simultaneous_downloads = configdat['simultaneous_downloads']
    site = configdat['site']
except Exception as e:
    print(f'Failed to Fetch data\n{e}')

#some stuff
Qualityzam = " --quality " + quality 
sitezam = " --site " + site
dub_subzam = " --sub_or_dub " + dub_sub
simultaneous_downloadszam = " --max_simultaneous_downloads " + simultaneous_downloads

if lastanimeep == "0" : 
    command_execute = "senpcli.exe" + sitezam + Qualityzam + dub_subzam + simultaneous_downloadszam + " " + animenamezam
else :
    startzam = " --start_episode " + fromanimeep
    endzam = " --end_episode " + lastanimeep
    command_execute = "senpcli.exe" + sitezam + Qualityzam + dub_subzam + simultaneous_downloadszam + startzam + endzam +  " " + animenamezam

print(command_execute)
current_directory = os.getcwd() + "\downloader"
os.chdir(current_directory)
rc = call("start cmd /K " + command_execute, cwd=current_directory, shell=True)

