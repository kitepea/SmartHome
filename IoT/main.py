import sys
from Adafruit_IO import MQTTClient
#from Adafruit_IO import Client

import random
import time
import serial.tools.list_ports
#from firebase_admin import credentials
#from firebase_admin import db
#import firebase_admin
AIO_FEED_IDS = ["humidity", "temperature", "brightness","living-fans-1","living-lights-1","living-door-1","sche-mode","auto-mode"]
AIO_USERNAME = "trongtin213"
AIO_KEY = "aio_zsMu05U2LXiaHS6Ss5o5FOSWPzrf"

#cred = credentials.Certificate('./dadn232-firebase-adminsdk-k09m5-e86aa9ecb6.json')
#firebase_admin.initialize_app(cred, {
#    'databaseURL': 'https://dadn232-default-rtdb.firebaseio.com/'
#})

# As an admin, the app has access to read and write all data, regradless of Security Rules
#ref = db.reference('LED')

def  connected(client):
    print("Ket noi thanh cong...")
    for feed in AIO_FEED_IDS:
        client.subscribe(feed)

def  subscribe(client , userdata , mid , granted_qos):
    print("Subscribe thanh cong...")

def  disconnected(client):
    print("Ngat ket noi...")
    sys.exit (1)

def  message(client , feed_id , payload):
    mess_to_send = ""
    if (feed_id == "living-fans-1"):
        mess_to_send = "FAN/MAN/"
        if payload == "1":
            print("Turn on FAN " + feed_id +" : "+ payload)
            mess_to_send += "ON"
        else :
            if payload == "0":
                print("Turn off FAN: " + feed_id +" : "+ payload)
                mess_to_send += "OFF"
    if (feed_id == "living-lights-1"):
        mess_to_send = "LIGHT/MAN/"
        if payload == "1":
            print("Turn on LED: " + feed_id +" : "+ payload)
            mess_to_send += "ON"
        else :
            if payload == "0":
                print("Turn off LED: " + feed_id +" : "+ payload)
                mess_to_send += "OFF"
    if (feed_id == "living-door-1"):
        mess_to_send = "DOOR/"
        if payload == "1":
            #print("Turn on LED: " + feed_id +" : "+ payload)
            mess_to_send += "OPEN"
        else :
            if payload == "0":
                #print("Turn off LED: " + feed_id +" : "+ payload)
                mess_to_send += "CLOSE"
    if (feed_id == "sche-mode"):
        mess_to_send = payload
    if (feed_id == "auto-mode"):
        mess_to_send = payload   

    print((str(mess_to_send)).encode('utf-8'))
    ser.write((str(mess_to_send)).encode('utf-8'))

def getPort():
    ports = serial.tools.list_ports.comports()
    N = len(ports)
    commPort = "None"
    for i in range(0, N):
        port = ports[i]
        strPort = str(port)
        if "USB-SERIAL CH340" in strPort:
            splitPort = strPort.split(" ")
            commPort = (splitPort[0])
    return commPort

mess = ""
def processData(data):
    data = data.replace("!", "")
    data = data.replace("#", "")
    splitData = data.split(":")
    print(splitData)
    if splitData[1] == "TEMP":
        client.publish("temperature", splitData[2])
    if splitData[1] == "HUMID":
        client.publish("humidity", splitData[2])
    if splitData[1] == "LUX":
        client.publish("brightness", splitData[2])
    if splitData[0] == "LIGHT":
        client.publish("living-lights-1", splitData[1])
        print("im here")
    if splitData[0] == "FAN":
        client.publish("living-fans-1", splitData[1])
        print("im here")    

mess = ""
def readSerial():
    bytesToRead = ser.inWaiting()
    if (bytesToRead > 0):
        global mess
        mess = mess + ser.read(bytesToRead).decode("UTF-8")
        while ("#" in mess) and ("!" in mess):
            start = mess.find("!")
            end = mess.find("#")
            processData(mess[start:end + 1])
            if (end == len(mess)):
                mess = ""
            else:
                mess = mess[end+1:]

        

ser = serial.Serial( port = getPort () , baudrate =115200)
client = MQTTClient(AIO_USERNAME , AIO_KEY)
client.on_connect = connected
client.on_disconnect = disconnected
client.on_message = message
client.on_subscribe = subscribe
client.connect()
client.loop_background()

#aio = Client(AIO_USERNAME, AIO_KEY)
#data = aio.receive("bbc-led")
#temp = int(data.value)
#print(data.value)
while True:
    """ temp = random.randint(0, 100)
    humid = random.randint(0, 100)
    print("Update temperature:", temp)
    client.publish("bbc-humid", temp)
    print("Update humidity:", humid)
    client.publish("bbc-temp", humid) """
    readSerial()
    time.sleep(1)