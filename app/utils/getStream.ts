// import { desktopCapturer } from 'electron';
import os from 'os';

const getStream = async (video?: boolean) => {
  // const sources = await desktopCapturer.getSources({
  //   types: ['window', 'screen'],
  // });
  // const source = sources.find((src) => src.name === 'Entire Screen');

  try {
    const constraints: any = {
      audio:
        os.platform() !== 'darwin'
          ? {
              mandatory: {
                chromeMediaSource: 'desktop',
              },
            }
          : false,
    };
    if (video) {
      constraints.video = {
        mandatory: {
          chromeMediaSource: 'desktop',
        },
      };
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default getStream;
