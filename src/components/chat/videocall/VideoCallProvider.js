'use client'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';

const VideoCallContext = createContext(null);

export function useVideoCall() {
  return useContext(VideoCallContext);
}
