import factory from "ggwave";

let ggwaveInstance: any = null;
let parameters: any = null;
let instanceId: number = -1;

export async function getGgwave() {
  if (!ggwaveInstance) {
    ggwaveInstance = await factory();
    parameters = ggwaveInstance.getDefaultParameters();
    // Default sample rate is 48000
    parameters.sampleRate = 48000;
    // We want Float32 output for Web Audio API
    parameters.sampleFormat = ggwaveInstance.SampleFormat.GGWAVE_SAMPLE_FORMAT_F32;
    instanceId = ggwaveInstance.init(parameters);
  }
  return { ggwave: ggwaveInstance, instanceId, parameters };
}

export function encodeAudio(
  ggwave: any,
  instanceId: number,
  payload: Uint8Array,
  protocol: number
): Float32Array {
  // ggwave.encode takes string or array, but for Uint8Array it's safer to convert or ensure it accepts Uint8Array.
  // Actually ggwave wasm wrapper usually accepts TypedArray or String.
  // If it returns F32, we expect a Float32Array back.
  // Using a volume of 5 (default is often 10 or 50) to make the signal softer
  const res = ggwave.encode(instanceId, payload, protocol, 5);
  return res as Float32Array;
}
