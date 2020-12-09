import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { Button, Input, message } from 'antd';
import { History } from 'history';
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

  const setDesktopStream = async () => {
    const desktopStream = await getStream();
    if (desktopStream) {
      setStream(desktopStream);
      const video = videoRef.current;
      if (video) {
        video.srcObject = desktopStream;
        video.onloadedmetadata = () => video.play();
      } else {
        message.info('Video Element Missing');
      }
    } else {
      message.info('Error getting Desktop Access');
    }
  };

  const connectPeer = () => {
    if (peer) {
      peer.connect(friendPeerId);
    }

    // if (stream) {
    //   const call = peer.call(friendPeerId, stream);
    //   call.on('stream', (peerStream) => {
    //     const video = friendVideoRef.current;
    //     if (video) {
    //       video.srcObject = peerStream;
    //       // video.onloadedmetadata = () => video.play();
    //       // setStream(desktopStream);
    //     } else {
    //       console.log(`Video Element Missing`, video);
    //     }
    //     // window.peer_stream = stream;
    //     // onReceiveStream(stream, 'peer-camera');
    //   });
    // }
  };

  // const call = () => {
  //   if (peer && stream) {
  //     const peerCall = peer.call(friendPeerId, stream);
  //     peerCall.on('stream', (peerStream) => {
  //       const video = friendVideoRef.current;
  //       if (video) {
  //         video.srcObject = peerStream;
  //         // video.onloadedmetadata = () => video.play();
  //         // setStream(desktopStream);
  //       } else {
  //         console.log(`Video Element Missing`, video);
  //       }
  //       // window.peer_stream = stream;
  //       // onReceiveStream(stream, 'peer-camera');
  //     });
  //   }
  // };

  const initPeer = () => {
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
      // console.log(peerObj.id);
      // document.getElementById("peer-id-label").innerHTML = peer.id;
      setPeerId(peerObj.id);
    });

    peerObj.on('error', (err) => {
      console.error(err);
      message.error('An error ocurred with peer:', 10);
      peer?.destroy();
      history.push(routes.HOME);
    });
    peerObj.on('connection', (connection) => {
      // const conn = con
      setfriendPeerId(connection.peer);
      // Use the handleMessage to callback when a message comes in
      // connection.on('data', handleMessage);
      // Hide peer_id field and set the incoming peer id as value
      // document.getElementById('peer_id').className += ' hidden';
      // document.getElementById('peer_id').value = peer_id;
      // document.getElementById('connected_peer').innerHTML =
      //   connection.metadata.username;
    });
    peerObj.on('call', (peerCall) => {
      if (stream) {
        peerCall.answer(stream);
      }
      peerCall.on('stream', (peerStream) => {
        const video = friendVideoRef.current;
        if (video) {
          video.srcObject = peerStream;
          // video.onloadedmetadata = () => video.play();
          // setStream(desktopStream);
        } else {
          message.error('Video Element Missing');
        }
        // Store a global reference of the other user stream
        // window.peer_stream = stream;
        // Display the stream of the other user in the peer-camera video element !
        // onReceiveStream(stream, 'peer-camera');
      });
    });
    setPeer(peerObj);
  };

  useEffect(() => {
    setDesktopStream();
    initPeer();
  }, []);
  return (
    <div>
      <div>
        Your Peer Id is
        {peerId}
      </div>
      <div>
        Your Friend Peer Id is
        {friendPeerId}
      </div>
      <div>Join Screen</div>
      <Input
        placeholder="Enter Peer Id Here..."
        onChange={(e) => setfriendPeerId(e.target.value)}
      />
      <Button onClick={connectPeer}>Connect</Button>
      {/* <Button onClick={call}>call</Button> */}
      {/* <video width="640" height="360" ref={videoRef} muted /> */}
      <div>
        <video width="1280" height="720" ref={friendVideoRef} autoPlay muted />
      </div>
    </div>
  );
}
