#include "StringSplitter.h"
#include "RTClib.h"
#include <BH1750.h>
#include "DHT.h"
#include <Servo.h>
#include <SchedTask.h>												
#include <ExampleConstants.h>	
#include <Wire.h>
#include <EEPROM.h>
#define DHTPIN 10 
#define DHTTYPE DHT11 

#define Fan_Address 0
#define Light_Address 50
#define Th_Temp_Address 66
#define Th_Lux_Address 70


const int Light_Pin = 4;
const int Fan_Pin = 5;


class Device{  ///////Note: need device name //////
  public: 
    int GPIO_Pin = 0;
    int OnHour = -1;
    int OnMin = -1;
    int OffHour = -1;
    int OffMin = -1;
    bool status = 0;
    bool SCH_status = 0;
    bool TH_status = 0;
    Device(int GPIO_Pin = -1, int OnHour = -1, int OnMin = -1, int OffHour = -1, int OffMin = -1){
      this->GPIO_Pin = GPIO_Pin;
      this->OnHour = OnHour;
      this->OnMin = OnMin;
      this->OffHour = OffHour;
      this->OffMin = OffMin;
      SCH_status = 0;
      TH_status = 0;
    }
    void Schedule_check(DateTime T){  ///////Note: Publish back status////
      if(this->SCH_status){
        if(T.hour() == this->OnHour && T.minute() == this->OnMin){
          digitalWrite(this->GPIO_Pin,HIGH);
          Serial.println("LIGHT ON");
          // writeString(!LIGHT:ON#)
        }else if(T.hour() == OffHour && T.minute() == OffMin){
          digitalWrite(this->GPIO_Pin,LOW);
          Serial.println("LIGHT OFF");
          // writeString(!LIGHT:ON#)
        }
      }
    }
};

String message; 
float Humid;
float Temp;
float lux;
RTC_DS3231 rtc;
DHT dht(DHTPIN, DHTTYPE);
BH1750 lightMeter;
Servo myservo;
Device Fan(Fan_Pin);
Device Light(Light_Pin);

float Th_Temp = -1;
float Th_Humid = -1;
float Th_Lux = -1;

////////////////////////////////////////// function declaration //////
void writeString(String stringData);
void Update_sensor();	
void Schedule();
void split();
void ReadUart();
void message_process();
///////////////////////////////////////////  Add Tasks to Task Schedule //////
SchedTask OnTask2 (0, 10000, Update_sensor);
SchedTask OnTask4 (0, 1000 ,Schedule);
SchedTask OnTask5 (0, 1 ,ReadUart);
//////////////////////////////////////////

/// Schedule mode:
// !FAN/SCH/13:12-17:30/ON#
// !LIGHT/SCH/9:00-15:12/OFF#

// Manual mode:
// !FAN/MAN/ON#
// !FAN/MAN/OFF#

// Thresh hold mode:
// !FAN/TH/31.121/ON#
// !LIGHT/TH/50.00/OFF#
////////////////////////////////////////////////
void setup() {
  EEPROM.get(Fan_Address,Fan);
  EEPROM.get(Light_Address,Light);
  EEPROM.get(Th_Temp_Address,Th_Temp);
  EEPROM.get(Th_Lux_Address,Th_Lux);
  // EEPROM.put(Fan_Address, Fan);    ///////for first time run /////
  // EEPROM.put(Light_Address, Light);
  Serial.begin(115200);
   
  pinMode(Fan.GPIO_Pin, OUTPUT);
  pinMode(Light.GPIO_Pin, OUTPUT);
  
  digitalWrite(Fan.GPIO_Pin, LOW);
  digitalWrite(Light.GPIO_Pin, LOW);
  Serial.println();
  Serial.println(Fan.GPIO_Pin);
  Serial.println(Th_Temp);
  Serial.println(Th_Lux);
  Serial.println(Light.TH_status);

  Serial.println(Light.OnHour);
  Serial.println(Light.OnMin);
  Serial.println(Light.OffHour);
  Serial.println(Light.OffMin);
  Serial.println(Light.SCH_status);
  Serial.println(Light.status);
  if (! rtc.begin()) {
    Serial.println("Could not find RTC! Check circuit.");
    while (1);
  }
  lightMeter.begin();
  dht.begin();
  myservo.attach(8);
  //String strTest = "!LED1/12:23-12:45/ON#";
  //Serial.end();
}
///////////////////////////////////////////////
void loop() {
  // put your main code here, to run repeatedly:
  SchedBase::dispatcher();
}


//////////////////// function implementation //////////
void split(){
  if (Serial.available() > 0) {
    // read the incoming byte:
    Serial.println(message);
    char *strings[10];
    char *ptr = NULL;
    byte index = 0;
    char str_array[message.length()+1];
    //// get token from message
    message.toCharArray(str_array, message.length()+1);
    Serial.println(str_array);
    ptr = strtok(str_array, "/:-");  // takes a list of delimiters
    while(ptr != NULL)
    {
        strings[index] = ptr;
        index++;
        ptr = strtok(NULL, "/:-");  // takes a list of delimiters
    }
    for(int n = 0; n < index; n++)
    { 
      Serial.println(strings[n]);
    }
    
    if(String(strings[0]) == "LIGHT"){
      Light.OnHour = atoi(strings[1]);
      Light.OnMin = atoi(strings[2]);
      Light.OffHour = atoi(strings[3]);
      Light.OffMin = atoi(strings[4]);
      if(String(strings[5]) == "ON"){
        Light.SCH_status = 1;
      }else if (String(strings[5]) == "OFF"){
        Light.SCH_status = 0;
      }
      Serial.println(Light.OnHour);
      Serial.println(Light.OnMin);
      Serial.println(Light.OffHour);
      Serial.println(Light.OffMin);
      Serial.println(Light.SCH_status);
    }else if(String(strings[0]) == "FAN"){
      Fan.OnHour = atoi(strings[1]);
      Fan.OnMin = atoi(strings[2]);
      Fan.OffHour = atoi(strings[3]);
      Fan.OffMin = atoi(strings[4]);
      if(String(strings[5]) == "ON"){
        Fan.SCH_status = 1;
      }else if (String(strings[5]) == "OFF"){
        Fan.SCH_status = 0;
      }
      Serial.println(Fan.OnHour);
      Serial.println(Fan.OnMin);
      Serial.println(Fan.OffHour);
      Serial.println(Fan.OffMin);
      Serial.println(Fan.SCH_status);
    }
  ////////////////  Store value to ROM menmory
  EEPROM.put(0, Fan);
  EEPROM.put(sizeof(Device), Light);
  }

  
}

void Schedule(){
  DateTime T = rtc.now();
  Serial.print(T.year(), DEC);
  Serial.print('/');
  Serial.print(T.month(), DEC);
  Serial.print('/');
  Serial.print(T.day(), DEC);
  Serial.print(' ');
  Serial.print(T.hour(), DEC);
  Serial.print(':');
  Serial.print(T.minute(), DEC);
  Serial.print(':');
  Serial.print(T.second(), DEC);
  Serial.println();
  // Fan.Schedule_check(t);
  // Light.Schedule_check(t);

  if(Fan.SCH_status){
    if(T.hour() == Fan.OnHour && T.minute() == Fan.OnMin){
      if(Fan.status != 1){
        Fan.status = 1;
        digitalWrite(Fan.GPIO_Pin, HIGH);
        writeString("!FAN:1#");
      }
    }else if(T.hour() == Fan.OffHour && T.minute() == Fan.OffMin){
      if(Fan.status != 0){
        Fan.status = 0;
        digitalWrite(Fan.GPIO_Pin, LOW);
        writeString("!FAN:0#");
      }
    }
  }

  if(Light.SCH_status){
    if(T.hour() == Light.OnHour && T.minute() == Light.OnMin){
      Serial.println("im Here");
      if(Light.status != 1){
        Light.status = 1;
        digitalWrite(Light.GPIO_Pin, HIGH);
        writeString("!LIGHT:1#");
      }
    }else if(T.hour() == Light.OffHour && T.minute() == Light.OffMin){
      if(Light.status != 0){
        Light.status = 0;
        digitalWrite(Light.GPIO_Pin, LOW);
        writeString("!LIGHT:0#");
      }
    }
  }


  if(Fan.TH_status){          ///////Note: Publish back status////
    if(Th_Temp<Temp){
      if(Fan.status != 1){
        Fan.status = 1;
        digitalWrite(Fan.GPIO_Pin, HIGH);
        writeString("!FAN:1#");
      }
      
    }else{
      if(Fan.status != 0){
        Fan.status = 0;
        digitalWrite(Fan.GPIO_Pin, LOW);
        writeString("!FAN:0#");
      }
    }
  }
  if(Light.TH_status){
    if(Th_Lux>lux){
      if(Light.status != 1){
        Light.status = 1;
        digitalWrite(Light.GPIO_Pin, HIGH);
        writeString("!LIGHT:1#");
      }
    }else{
      if(Light.status != 0){
        Light.status = 0;
        digitalWrite(Light.GPIO_Pin, LOW);
        writeString("!LIGHT:0#");
      }
    }
  }
}


void Update_sensor() {

	Humid = dht.readHumidity();
  // Read temperature as Celsius
  Temp = dht.readTemperature();
  // Read temperature as Fahrenheit
  // float f = dht.readTemperature(true);
  
  lux = lightMeter.readLightLevel();
  // Check if any reads failed and exit early (to try again).
  if (isnan(Humid) || isnan(Temp)) {
    Serial.println("Failed to read from DHT sensor!");
    //return;
  }
  String result = "!1:TEMP:"+ String(Temp) +"#";
  writeString(result);
  result = "!1:HUMID:"+ String(Humid) +"#";
  writeString(result);
  result = "!1:LUX:"+ String(lux) +"#";
  writeString(result);
	digitalWrite(7, !digitalRead(7));	

}  
void ReadUart(){
  if (Serial.available() > 0) {
    // read the incoming byte:
    message = Serial.readString();
    // if(message == "1"){
    //   digitalWrite(Fan.GPIO_Pin, HIGH);
    // }else{
    //   digitalWrite(Fan.GPIO_Pin, LOW);
    // }
    message_process();
  }
}

void message_process(){
  Serial.println(message);
  char *strings[10];
  char *ptr = NULL;
  byte index = 0;
  char str_array[message.length()+1];
  //// get token from message
  message.toCharArray(str_array, message.length()+1);
  Serial.println(str_array);
  ptr = strtok(str_array, "/:-");  // takes a list of delimiters
  while(ptr != NULL){
    strings[index] = ptr;
    index++;
    ptr = strtok(NULL, "/:-");  // takes a list of delimiters
  }
  for(int n = 0; n < index; n++){ 
    Serial.println(strings[n]);
  }
  if(String(strings[1]) == "SCH"){         //// Schedule mode set up ////
    if(String(strings[0]) == "LIGHT"){\
      Serial.println("??");
      Light.OnHour = atoi(strings[2]);
      Light.OnMin = atoi(strings[3]);
      Light.OffHour = atoi(strings[4]);
      Light.OffMin = atoi(strings[5]);
      if(String(strings[6]) == "ON"){
        Light.SCH_status = 1;
      }else if (String(strings[6]) == "OFF"){
        Light.SCH_status = 0;
      }
      Serial.println(Light.OnHour);
      Serial.println(Light.OnMin);
      Serial.println(Light.OffHour);
      Serial.println(Light.OffMin);
      Serial.println(Light.SCH_status);
    }else if(String(strings[0]) == "FAN"){
      Fan.OnHour = atoi(strings[2]);
      Fan.OnMin = atoi(strings[3]);
      Fan.OffHour = atoi(strings[4]);
      Fan.OffMin = atoi(strings[5]);
      if(String(strings[6]) == "ON"){
        Fan.SCH_status = 1;
      }else if (String(strings[6]) == "OFF"){
        Fan.SCH_status = 0;
      }
      Serial.println(Fan.OnHour);
      Serial.println(Fan.OnMin);
      Serial.println(Fan.OffHour);
      Serial.println(Fan.OffMin);
      Serial.println(Fan.SCH_status);
    }
    ////////////////  Store value to ROM menmory
    EEPROM.put(Fan_Address, Fan);
    EEPROM.put(Light_Address, Light);
    return;
  }
    
  else if(String(strings[1]) == "MAN"){      //// Manual mode set up ////
    Serial.println("Manual mode");
    if(String(strings[0]) == "FAN"){
      if(String(strings[2]) == "ON"){
        if(Fan.status != 1){
          Fan.status = 1;
          digitalWrite(Fan.GPIO_Pin, HIGH);
          writeString("!FAN:1#");
        }
      }else if(String(strings[2]) == "OFF"){
        if(Fan.status != 0){
          Fan.status = 0;
          digitalWrite(Fan.GPIO_Pin, LOW);
          writeString("!FAN:0#");
        }
      }
    }
    else if(String(strings[0]) == "LIGHT"){
      if(String(strings[2]) == "ON"){
        if(Light.status != 1){
          Light.status = 1;
          digitalWrite(Light.GPIO_Pin, HIGH);
          writeString("!LIGHT:1#");
        }
      }else if(String(strings[2]) == "OFF"){
        if(Light.status != 0){
          Light.status = 0;
          digitalWrite(Light.GPIO_Pin, LOW);
          writeString("!LIGHT:0#");
        }
      }
    }
  }
  
  else if(String(strings[1]) == "TH"){      //// Thresh hold mode set up ////
    Serial.println("Thresh hold mode");
    if(String(strings[0]) == "FAN"){
      Th_Temp = atof(strings[2]);
      if(String(strings[3]) == "ON"){
        Fan.TH_status = 1;
      }else if (String(strings[3]) == "OFF"){
        Fan.TH_status = 0;
      }
    }
    else if(String(strings[0]) == "LIGHT"){
      Th_Lux = atof(strings[2]);
      if(String(strings[3]) == "ON"){
        Light.TH_status = 1;
      }else if (String(strings[3]) == "OFF"){
        Serial.println("off mode");
        Light.TH_status = 0;
      }
    }     
  EEPROM.put(Th_Temp_Address, Th_Temp);
  EEPROM.put(Th_Lux_Address, Th_Lux);
  EEPROM.put(Fan_Address, Fan);
  EEPROM.put(Light_Address, Light);
  }
  //for door //
  else if(String(strings[0]) == "DOOR"){ 
    if(String(strings[1]) == "OPEN"){
      myservo.write(90);
    }else if (String(strings[1]) == "CLOSE"){
      myservo.write(0);
    }
  }
}

void writeString(String stringData) { // Used to serially push out a String with Serial.write()
  for (int i = 0; i < stringData.length(); i++) {
    Serial.write(stringData[i]);   // Push each char 1 by 1 on each loop pass
  }
}
