#import
import os
import json
import sys 
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
                                                                                  
                                                                                                Uses Senpcli                                     
version 2.0 \n\nMade by - Incredible Flamers\n""")

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
exit_outer_loop = False
for i in list(configdat.keys()):
    if exit_outer_loop:
        break 
    if i == 'Anime_name':
        value = input(infoColour + f'{i} Enter anime name you want to download : ')
        value = value.replace(' ', '_')
        while not value:
            print(notecolour + "Error: Anime name cannot be empty.")
            value = input(infoColour + f'{i} Enter anime name you want to download : ')
            value = value.replace(' ', '_')

        configdat[i] = value

    elif i == 'FROM_EP':
        while True:
            value = input(infoColour + f'{i} Enter from which ep you want to download ( type 0 it will download all eps ) : ')
            if value.isdigit() and (value == '0'):
                print(infoColour + f'Downloading all ep in {configdat["Anime_name"]} ')
                configdat[i] = '0'
                configdat['LAST_EP'] = '0'
                exit_outer_loop = True
                break 
            elif value.isdigit() and int(value) > 0:
                configdat[i] = value
                break 
            else:
                print(notecolour + "Error: Enter a valid number. Alphabets or special characters are not allowed.")

    elif i == 'LAST_EP':
        while True:
            value = input(infoColour + f'{i} Till which ep you want to download ( note if you want to download only one ep type here 0 ) : ')
            if value.isdigit() and (value == '0'):
                print(infoColour + f'Downloading Ep {configdat["FROM_EP"]}')
                exit_outer_loop = True
                break  
            elif value.isdigit() and int(configdat['FROM_EP']) > int(value):
                print(notecolour + f'Error: FROM_EP cannot be greater than LAST_EP.')
            elif value.isdigit() and int(value) > 0:
                print(infoColour + f'Downloading From Ep {configdat["FROM_EP"]} to {value}')
                exit_outer_loop = True
                break 
            else:
                print(notecolour + "Error: Enter a valid number. Alphabets or special characters are not allowed.")


setConfig(configdat)

cmdcommandtest = "cmd.exe /K python download.py"

import subprocess
subprocess.Popen(cmdcommandtest)