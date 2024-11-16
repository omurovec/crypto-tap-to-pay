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
import { Skeleton } from "@/components/ui/Skeleton";
import factory from "ggwave";
import { createClaimSignature } from "@/utils/createSignature";
import { privateKeyToAccount } from "viem/accounts";

const DECIMALS = 6n;
const PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const convertTypedArray = (src, type) => {
  var buffer = new ArrayBuffer(src.byteLength);
  var baseView = new src.constructor(buffer).set(src);
  return new type(buffer);
};

// Helper function to convert a hex string to a byte array
function hexToBytes(hex) {
  if (hex.startsWith("0x")) hex = hex.slice(2);
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

// Encode hex string to Base64
function encodeHexToBase64(hex) {
  const bytes = hexToBytes(hex);
  return btoa(String.fromCharCode(...bytes));
}

export default function PayDrawer() {
  const [sent, setSent] = useState(false);

  const listenForAudioWaveform = () => {
    factory().then(function (ggwave) {
      const context = new AudioContext({ sampleRate: 48000 });
      var parameters = ggwave.getDefaultParameters();
      parameters.sampleRateInp = context.sampleRate;
      parameters.sampleRateOut = context.sampleRate;

      var instance = ggwave.init(parameters);

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
              console.log(res);
              try {
                let sendAmount = BigInt(res) * 10n ** DECIMALS;
                console.log(sendAmount);
                const privateKey = PRIVATE_KEY;
                createClaimSignature({
                  privateKey,
                  amount: sendAmount,
                  nonce: 0n,
                }).then((signature) => {
                  console.log("Sending signature...", signature);

                  const { address } = privateKeyToAccount(privateKey);
                  var waveform = ggwave.encode(
                    instance,
                    encodeHexToBase64(address) +
                      " " +
                      encodeHexToBase64(signature),
                    ggwave.ProtocolId.GGWAVE_PROTOCOL_AUDIBLE_FAST,
                    10,
                  );

                  // play the audio waveform
                  var buf = convertTypedArray(waveform, Float32Array);
                  var buffer = context.createBuffer(
                    1,
                    buf.length,
                    context.sampleRate,
                  );
                  buffer.getChannelData(0).set(buf);
                  var source = context.createBufferSource();
                  source.buffer = buffer;
                  source.connect(context.destination);
                  source.start(0);
                  setSent(true);
                });
              } catch (e) {
                console.error(e);
              }
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
      <Drawer>
        {/* Pay modal */}
        <DrawerTrigger className="w-full">
          <Button onClick={listenForAudioWaveform} className="w-full">
            Pay
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            {sent ? (
              <>
                <DrawerTitle>Sent!</DrawerTitle>
                <DrawerDescription className="flex items-center justify-center p-8 pb-2">
                  <Skeleton className="h-20 w-20 rounded-full" />
                </DrawerDescription>
              </>
            ) : (
              <>
                <DrawerTitle>Listening</DrawerTitle>
                <DrawerDescription className="flex items-center justify-center p-8 pb-2">
                  <Skeleton className="h-20 w-20 rounded-full" />
                </DrawerDescription>
              </>
            )}
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>
              <Button variant="ghost">{sent ? "Done" : "Cancel"}</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
