/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { message } from 'antd';
import { History } from 'history';
import { Link } from 'react-router-dom';
import getStream from '../../utils/getStream';
import routes from '../../constants/routes.json';

interface Props {
  history: History;
}

export default function ShareScreen(props: Props): JSX.Element {
  const { history } = props;
  const [peerId, setPeerId] = useState<null | string>(null);
  const [peer, setPeer] = useState<null | Peer>(null);
  const videoRef = useRef<null | HTMLVideoElement>(null);
  const friendVideoRef = useRef<null | HTMLVideoElement>(null);
  const [friendPeerId, setfriendPeerId] = useState<string>('');

  const setDesktopStream = async () => {
    const desktopStream = await getStream(true);
    if (desktopStream) {
      const video = videoRef.current;
      if (video) {
        video.srcObject = desktopStream;
        // video.onloadedmetadata = () => video.play();
      } else {
        message.error(`Video Element Missing`);
      }
    } else {
      message.error(`Error getting Desktop Access`);
    }
    return desktopStream;
  };

  const initPeer = (stream: MediaStream) => {
    const peerObj = new Peer(undefined, {
      host: '192.168.1.75',
      port: 9000,
      secure: true,
      path: '/peerjs',
      debug: 2,
      config: {
        iceServers: [
          {
            urls: 'stun:stun1.l.google.com:19302',
          },
          {
            urls: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com',
          },
        ],
      },
    });

    peerObj.on('open', () => {
      setPeerId(peerObj.id);
    });

    peerObj.on('error', () => {
      message.error('An error ocurred with peer:', 10);
      history.push(routes.HOME);
    });

    peerObj.on('disconnected', () => {
      history.push(routes.HOME);
    });

    peerObj.on('connection', (connection) => {
      setfriendPeerId(connection.peer);
      peerObj.call(connection.peer, stream);
    });
    peerObj.on('call', (peerCall) => {
      peerCall.on('stream', (peerStream) => {
        const video = friendVideoRef.current;
        if (video) {
          video.srcObject = peerStream;
        }
      });
    });
    setPeer(peerObj);
  };

  const initialize = async () => {
    const stream = await setDesktopStream();
    if (stream) {
      initPeer(stream);
    }
  };

  useEffect(() => {
    initialize();
    return () => {
      peer?.destroy();
    };
  }, []);
  return (
    <div>
      <Link to={routes.HOME}>Home</Link>
      <div>
        Your Peer Id is
        {` ${peerId}`}
      </div>
      <div>Share Screen</div>
      <div>
        Your Friend Peer Id is
        {` ${friendPeerId}`}
      </div>
      <video width="640" height="360" ref={videoRef} autoPlay muted />
      <video
        width="640"
        height="360"
        style={{ display: 'none' }}
        ref={friendVideoRef}
        autoPlay
      />
    </div>
  );
}
