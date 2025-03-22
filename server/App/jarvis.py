import speech_recognition as sr
import pyttsx3
import pywhatkit
import openai
import os
import screen_brightness_control as sbc
from ctypes import POINTER, cast
from comtypes import CLSCTX_ALL
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
from dotenv import load_dotenv

class JarvisAssistant:
    def __init__(self, websocket):
        self.websocket = websocket
        self.is_running = False
        load_dotenv()
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self.engine = pyttsx3.init()
        self.engine.setProperty('rate', 150)
        self.engine.setProperty('volume', 1.0)

    async def speak(self, text):
        print(f"JARVIS: {text}")
        await self.websocket.send_json({"status": "speaking", "message": text})
        self.engine.say(text)
        self.engine.runAndWait()

    async def listen(self):
        recognizer = sr.Recognizer()
        with sr.Microphone() as source:
            recognizer.adjust_for_ambient_noise(source, duration=1)
            await self.websocket.send_json({"status": "listening"})
            try:
                audio = recognizer.listen(source, timeout=10, phrase_time_limit=5)
                command = recognizer.recognize_google(audio).lower()
                await self.websocket.send_json({"status": "processing", "command": command})
                return command
            except sr.UnknownValueError:
                await self.speak("Sorry, I didn't catch that boss.")
            except sr.WaitTimeoutError:
                await self.speak("I didn't hear anything. Try again boss.")
            except sr.RequestError:
                await self.speak("Network issue, please check your internet connection boss.")
            return None

    async def ask_gpt(self, question):
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": question}]
            )
            return response["choices"][0]["message"]["content"]
        except Exception as e:
            return f"❌ Error: {str(e)}"

    async def open_website(self, command):
        site = command.replace("open", "").strip().replace(" ", "")
        url = f"https://www.{site}.com"
        await self.speak(f"Opening {site}")
        os.system(f"start {url}")

    async def play_media(self, command):
        video = command.replace("play", "").strip()
        await self.speak(f"Playing {video} on YouTube")
        pywhatkit.playonyt(video)

    async def control_brightness(self, command):
        try:
            if "increase brightness" in command:
                sbc.set_brightness(min(100, sbc.get_brightness()[0] + 10))
                await self.speak("Brightness increased.")
            elif "decrease brightness" in command:
                sbc.set_brightness(max(0, sbc.get_brightness()[0] - 10))
                await self.speak("Brightness decreased.")
            elif "set brightness" in command:
                level = [int(s) for s in command.split() if s.isdigit()]
                if level:
                    sbc.set_brightness(level[0])
                    await self.speak(f"Brightness set to {level[0]}%")
        except Exception:
            await self.speak("Couldn't adjust brightness.")

    async def control_volume(self, command):
        devices = AudioUtilities.GetSpeakers()
        interface = devices.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
        volume = cast(interface, POINTER(IAudioEndpointVolume))
        
        if "increase volume" in command:
            volume.SetMasterVolumeLevelScalar(min(1.0, volume.GetMasterVolumeLevelScalar() + 0.1), None)
            await self.speak("Volume increased.")
        elif "decrease volume" in command:
            volume.SetMasterVolumeLevelScalar(max(0.0, volume.GetMasterVolumeLevelScalar() - 0.1), None)
            await self.speak("Volume decreased.")
        elif "mute" in command:
            volume.SetMute(1, None)
            await self.speak("Volume muted.")
        elif "unmute" in command:
            volume.SetMute(0, None)
            await self.speak("Volume unmuted.")
        elif "set volume" in command:
            level = [int(s) for s in command.split() if s.isdigit()]
            if level:
                volume.SetMasterVolumeLevelScalar(min(1.0, max(0.0, level[0] / 100)), None)
                await self.speak(f"Volume set to {level[0]}%")

    async def run_jarvis(self):
        self.is_running = True
        await self.speak("Hey boss, I am JARVIS. How may I assist you?")
        
        while self.is_running:
            command = await self.listen()
            if command is None:
                continue
                
            if any(word in command for word in ["exit", "stop", "shutdown"]):
                await self.speak("Goodbye boss, have a great day!")
                self.is_running = False
                await self.websocket.send_json({"status": "stopped"})
                break
            
            if "majid" in command:
                await self.speak("Majid is a porta, mainly known as verification ka porta, that always says sabke sath jaungaa. He is the father of Rafay.")
            elif "who is" in command or "what is" in command or "tell me about" in command:
                topic = command.replace("who is", "").replace("what is", "").replace("tell me about", "").strip()
                response = await self.ask_gpt(f"Tell me about {topic}")
                await self.speak(response)
            elif "open" in command:
                await self.open_website(command)
            elif "play" in command:
                await self.play_media(command)
            elif "brightness" in command:
                await self.control_brightness(command)
            elif "volume" in command or "mute" in command:
                await self.control_volume(command)
            else:
                response = await self.ask_gpt(command)
                await self.speak(response)

    def stop(self):
        self.is_running = False