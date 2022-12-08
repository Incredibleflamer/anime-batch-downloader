#import
import os
import json
files = os.listdir()
#colors 
from colorama import Fore, Style , init;init()
basecolour = Fore.CYAN + Style.BRIGHT
infoColour = Fore.YELLOW + Style.BRIGHT
successColour = Fore.GREEN + Style.BRIGHT
notecolour = Fore.RED + Style.BRIGHT
print(basecolour+"""""
  ___   _   _ ________  ___ _____  ______ _____  _    _ _   _  _     _____  ___ ______ ___________ 
 / _ \ | \ | |_   _|  \/  ||  ___| |  _  \  _  || |  | | \ | || |   |  _  |/ _ \|  _  \  ___| ___ \
/ /_\ \|  \| | | | | .  . || |__   | | | | | | || |  | |  \| || |   | | | / /_\ \ | | | |__ | |_/ /
|  _  || . ` | | | | |\/| ||  __|  | | | | | | || |/\| | . ` || |   | | | |  _  | | | |  __||    / 
| | | || |\  |_| |_| |  | || |___  | |/ /\ \_/ /\  /\  / |\  || |___\ \_/ / | | | |/ /| |___| |\ \ 
\_| |_/\_| \_/\___/\_|  |_/\____/  |___/  \___/  \/  \/\_| \_/\_____/\___/\_| |_/___/ \____/\_| \_|
                                                                                  
                                                                                                                                      
version 1.0 \n\nMade by - Yog Mehta\n""")

# input user anime name and ep number
#getting configfiles
def getConfig():
    with open('./data.json' , 'r' , encoding='utf-8') as c:
        return json.load(c)

def setConfig(data):
    with open('./data.json' , 'w' , encoding='utf-8') as c:
        json.dump(data , c)

if './data.json' not in files:
    with open('./data.json' , 'w' , encoding='utf-8') as f:
        f.write('''{
"Anime_name": "",
"FROM_EP": "",
"LAST_EP" : ""
}''')

configdat = getConfig()
for i in list(configdat.keys()):
    if i == 'Anime_name':
        value = input(infoColour+ f'{i} Enter anime name you want to download : ')

    elif i == 'FROM_EP':
        value = input(infoColour+ f'{i} Enter from which ep you want to download : ')

    elif i == 'LAST_EP':
        value = input(infoColour+ f'{i} Till which ep you want to download ( note if you want to download only one type here 0 ) : ')
    else:
        value=input(infoColour+ f'{i} : ')
    configdat[i] = value
setConfig(configdat)

cmdcommandtest = "cmd.exe /K python download.py"

import subprocess
subprocess.Popen(cmdcommandtest)