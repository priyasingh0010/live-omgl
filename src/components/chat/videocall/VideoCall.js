// components/VideoCallButton.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff } from 'lucide-react';
import Peer from 'simple-peer';

export default function VideoCallButton({ socket, username, partnerName }) {
  const [isInCall, setIsInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isInitiator, setIsInitiator] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const peerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Function to attach stream to video element
  const attachStreamToVideo = (videoRef, stream) => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => console.log('Error playing video:', err));
    }
  };

  // Effect to handle video streams
  useEffect(() => {
    if (localStream) {
      attachStreamToVideo(localVideoRef, localStream);
    }
    if (remoteStream) {
      attachStreamToVideo(remoteVideoRef, remoteStream);
    }
  }, [localStream, remoteStream]);

  useEffect(() => {
    if (!socket) return;

    socket.on('video-incoming', ({ from }) => {
      console.log('Incoming call from:', from);
      setIncomingCall(true);
      setIsInitiator(false);
    });

    socket.on('video-response', async ({ accepted }) => {
      console.log('Call response:', accepted);
      if (accepted && isInitiator) {
        await setupPeerConnection(true);
      }
    });

    socket.on('video-signal', ({ signal }) => {
      console.log('Received peer signal');
      if (peerRef.current) {
        peerRef.current.signal(signal);
      }
    });

    socket.on('video-ended', () => {
      console.log('Call ended by peer');
      cleanup();
    });

    return () => {
      cleanup();
      socket.off('video-incoming');
      socket.off('video-response');
      socket.off('video-signal');
      socket.off('video-ended');
    };
  }, [socket, isInitiator]);

  const cleanup = () => {
    console.log('Cleaning up video call');
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
      });
    }
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
    setIsInCall(false);
    setIncomingCall(false);
    setIsInitiator(false);
  };

  const setupPeerConnection = async (initiator) => {
    try {
      console.log('Setting up peer connection as', initiator ? 'initiator' : 'receiver');
      
      // Get media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      console.log('Got local media stream');
      setLocalStream(stream);

      // Create peer connection
      const peer = new Peer({
        initiator,
        stream,
        trickle: false,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' }
          ]
        }
      });

      // Handle peer events
      peer.on('signal', signal => {
        console.log('Sending signal to peer');
        socket.emit('video-signal', { signal });
      });

      peer.on('stream', stream => {
        console.log('Received remote stream');
        setRemoteStream(stream);
      });

      peer.on('error', err => {
        console.error('Peer connection error:', err);
        cleanup();
      });

      peer.on('close', () => {
        console.log('Peer connection closed');
        cleanup();
      });

      peerRef.current = peer;
      setIsInCall(true);

    } catch (err) {
      console.error('Error in setupPeerConnection:', err);
      cleanup();
    }
  };

  const handleCallButton = async () => {
    if (isInCall) {
      socket.emit('video-end');
      cleanup();
    } else {
      setIsInitiator(true);
      await setupPeerConnection(true);
      socket.emit('video-request');
    }
  };

  const handleAcceptCall = async () => {
    setIncomingCall(false);
    socket.emit('video-response', { accepted: true });
    await setupPeerConnection(false);
  };

  const handleRejectCall = () => {
    setIncomingCall(false);
    socket.emit('video-response', { accepted: false });
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(!isCameraOff);
    }
  };

  return (
    <>
      <button
        onClick={handleCallButton}
        className={`p-2 rounded-full ${
          isInCall ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        } text-white transition-colors`}
        title={isInCall ? 'End Video Call' : 'Start Video Call'}
      >
        <Video size={20} />
      </button>

      {/* Video Call Modal */}
      {isInCall && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full p-4">
            <div className="relative mb-4">
              {/* Remote Video */}
              <div className="w-full aspect-video rounded-lg bg-gray-800 overflow-hidden">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Local Video */}
              <div className="absolute bottom-4 right-4 w-48 aspect-video rounded-lg overflow-hidden border-2 border-white bg-gray-800">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full ${
                  isMuted ? 'bg-red-500' : 'bg-gray-600'
                } hover:opacity-80 transition-opacity text-white`}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <button
                onClick={toggleCamera}
                className={`p-3 rounded-full ${
                  isCameraOff ? 'bg-red-500' : 'bg-gray-600'
                } hover:opacity-80 transition-opacity text-white`}
              >
                {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
              </button>

              <button
                onClick={handleCallButton}
                className="p-3 rounded-full bg-red-500 hover:opacity-80 transition-opacity text-white"
              >
                <PhoneOff size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incoming Call Modal */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <p className="mb-4">Incoming call from {partnerName}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleAcceptCall}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={handleRejectCall}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}