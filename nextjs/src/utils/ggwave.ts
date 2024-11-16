import factory from "ggwave";

const convertTypedArray = (src: any, type: any) => {
  var buffer = new ArrayBuffer(src.byteLength);
  var baseView = new src.constructor(buffer).set(src);
  return new type(buffer);
};

export const sendTone = async (message: string) => {
  const ggwave = await factory();

  const context = new AudioContext({ sampleRate: 48000 });
  let parameters = ggwave.getDefaultParameters();
  parameters.sampleRateInp = context.sampleRate;
  parameters.sampleRateOut = context.sampleRate;

  const instance = ggwave.init(parameters);

  // listen for the audio waveform
  const constraints = {
    audio: {
      // not sure if these are necessary to have
      echoCancellation: false,
      autoGainControl: false,
      noiseSuppression: false,
    },
  };

  var waveform = ggwave.encode(
    instance,
    message,
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
};

export const receiveTone = (callback: (arg0: string) => any) => {
  factory()
    .then(function (ggwave: any) {
      const context = new AudioContext({ sampleRate: 48000 });
      let parameters = ggwave.getDefaultParameters();
      parameters.sampleRateInp = context.sampleRate;
      parameters.sampleRateOut = context.sampleRate;

      const instance = ggwave.init(parameters);

      // listen for the audio waveform
      const constraints = {
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

          recorder = context.createScriptProcessor(
            bufferSize,
            numberOfInputChannels,
            numberOfOutputChannels,
          );

          recorder.onaudioprocess = function (e: any) {
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
              callback(res);
            }
          };

          mediaStream.connect(recorder);
          recorder.connect(context.destination);
        })
        .catch(function (e: any) {
          console.warn(e);
        });
    })
    .catch(function (e: any) {
      console.warn(e);
    });
};
