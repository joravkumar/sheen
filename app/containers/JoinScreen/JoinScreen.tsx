/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { Button, Input, message } from 'antd';
import { History } from 'history';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes.json';
import getStream from '../../utils/getStream';

interface Props {
  history: History;
}

export default function JoinScreen(props: Props): JSX.Element {
  const { history } = props;
  const [peerId, setPeerId] = useState<null | string>(null);
  const [friendPeerId, setfriendPeerId] = useState<string>('');
  const videoRef = useRef<null | HTMLVideoElement>(null);
  const friendVideoRef = useRef<null | HTMLVideoElement>(null);
  const [stream, setStream] = useState<null | MediaStream>(null);
  const [peer, setPeer] = useState<Peer | null>(null);

  const setAudioStream = async () => {
    const audioStream = await getStream(false);
    if (audioStream) {
      setStream(audioStream);
      const video = videoRef.current;
      if (video) {
        video.srcObject = audioStream;
        // video.onloadedmetadata = () => video.play();
      }
    }
  };

  const connectPeer = () => {
    if (peer) {
      peer.connect(friendPeerId);
    }

    if (stream && peer) {
      const call = peer.call(friendPeerId, stream);
      call.on('stream', (peerStream) => {
        const video = friendVideoRef.current;
        if (video) {
          video.srcObject = peerStream;
        }
      });
    }
  };

  const peerObj = new Peer(undefined, {
    host: '192.168.1.75',
    port: 9000,
    secure: true,
    path: '/peerjs',
    debug: 3,
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
    peer?.destroy();
    history.push(routes.HOME);
  });
  peerObj.on('connection', (connection) => {
    setfriendPeerId(connection.peer);
  });
  peerObj.on('call', (peerCall) => {
    if (stream) {
      peerCall.answer(stream);
    }
    peerCall.on('stream', (peerStream) => {
      const video = friendVideoRef.current;
      if (video) {
        video.srcObject = peerStream;
      }
    });
  });
  setPeer(peerObj);

  useEffect(() => {
    setAudioStream();
    return () => {
      peer?.destroy();
    };
  }, [peer]);
  return (
    <div>
      <Link to={routes.HOME}>Home</Link>
      <div>
        Your Peer Id is
        {` ${peerId}`}
      </div>
      <div>
        Your Friend Peer Id is
        {` ${friendPeerId}`}
      </div>
      <div>Join Screen</div>
      <Input
        placeholder="Enter Peer Id Here..."
        onChange={(e) => setfriendPeerId(e.target.value)}
      />
      <Button onClick={connectPeer}>Connect</Button>
      <div>
        <video width="1280" height="720" ref={friendVideoRef} autoPlay />
      </div>
    </div>
  );
}
