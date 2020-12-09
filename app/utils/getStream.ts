import { desktopCapturer } from 'electron';

const getStream = async () => {
  const sources = await desktopCapturer.getSources({
    types: ['window', 'screen'],
  });
  const source = sources.find((src) => src.name === 'Entire Screen');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id,
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720,
        },
      },
    });
    return stream;
  } catch (e) {
    return null;
  }
};

export default getStream;
