"use client";
import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import factory from "ggwave";

const convertTypedArray = (src, type) => {
  var buffer = new ArrayBuffer(src.byteLength);
  var baseView = new src.constructor(buffer).set(src);
  return new type(buffer);
};

// Decode Base64 to hex string
function decodeBase64ToHex(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytesToHex(bytes);
}

// Helper function to convert a byte array to a hex string
function bytesToHex(bytes) {
  return (
    "0x" +
    Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")
  );
}

export default function ReceiveDrawer() {
  const [inputValue, setInputValue] = useState("");
  const [sendAmount, setSendAmount] = useState<number>();

  const handleSubmission = () => {
    setSendAmount(Number(inputValue));
    factory().then(function (ggwave) {
      // create ggwave instance with default parameters
      const context = new AudioContext({ sampleRate: 48000 });
      var parameters = ggwave.getDefaultParameters();
      parameters.sampleRateInp = context.sampleRate;
      parameters.sampleRateOut = context.sampleRate;

      var instance = ggwave.init(parameters);

      var payload = inputValue;

      // generate audio waveform for string "hello js"
      var waveform = ggwave.encode(
        instance,
        payload,
        ggwave.ProtocolId.GGWAVE_PROTOCOL_AUDIBLE_FAST,
        10,
      );

      // play the audio waveform
      var buf = convertTypedArray(waveform, Float32Array);
      var buffer = context.createBuffer(1, buf.length, context.sampleRate);
      buffer.getChannelData(0).set(buf);
      var source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);

      // listen for the audio waveform
      let constraints = {
        audio: {
          // not sure if these are necessary to have
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
        },
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (e) {
          let mediaStream = context.createMediaStreamSource(e);

          var bufferSize = 1024;
          var numberOfInputChannels = 1;
          var numberOfOutputChannels = 1;

          let recorder;

          if (context.createScriptProcessor) {
            recorder = context.createScriptProcessor(
              bufferSize,
              numberOfInputChannels,
              numberOfOutputChannels,
            );
          } else {
            recorder = context.createJavaScriptNode(
              bufferSize,
              numberOfInputChannels,
              numberOfOutputChannels,
            );
          }

          recorder.onaudioprocess = function (e) {
            var source = e.inputBuffer;
            var res = ggwave.decode(
              instance,
              convertTypedArray(
                new Float32Array(source.getChannelData(0)),
                Int8Array,
              ),
            );

            if (res && res.length > 0) {
              res = new TextDecoder("utf-8").decode(res);
              let [address, signature] = res.split(" ").map(decodeBase64ToHex);
              console.log(address, signature);
            }
          };

          mediaStream.connect(recorder);
          recorder.connect(context.destination);
        })
        .catch(function (e) {
          console.error(e);
        });
    });
  };

  return (
    <div className="flex-1">
      <Drawer className="flex-1">
        <DrawerTrigger className="w-full">
          <Button className="w-full">Receive</Button>
        </DrawerTrigger>
        <DrawerContent>
          {sendAmount !== undefined ? (
            <>
              <DrawerHeader>
                <DrawerTitle>Requesting</DrawerTitle>
                <DrawerDescription className="flex items-center justify-center p-8 pb-2">
                  <Skeleton className="h-20 w-20 rounded-full" />
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setInputValue("");
                      setSendAmount(undefined);
                    }}
                  >
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          ) : (
            <>
              <DrawerHeader>
                <DrawerTitle>Select amount</DrawerTitle>
                <DrawerDescription>
                  <Input
                    type="number"
                    placeholder="USD"
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button onClick={handleSubmission}>Receive</Button>
                <DrawerClose>
                  <Button
                    onClick={() => {
                      setInputValue("");
                      setSendAmount(undefined);
                    }}
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
