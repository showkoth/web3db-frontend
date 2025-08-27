import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

interface Web3DBLogoProps extends SvgIconProps {
  size?: number;
}

const Web3DBLogo: React.FC<Web3DBLogoProps> = ({ size = 24, ...props }) => {
  return (
    <SvgIcon
      {...props}
      sx={{
        width: size,
        height: size,
        ...props.sx,
      }}
      viewBox="0 0 100 100"
    >
      {/* Outer hexagon representing Web3/blockchain with gradient */}
      <defs>
        <linearGradient id="web3gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#00D4FF', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#0099CC', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="dbgradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#4CAF50', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#2E7D32', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Outer hexagon representing Web3/blockchain */}
      <polygon
        points="50,8 82,26 82,74 50,92 18,74 18,26"
        fill="none"
        stroke="url(#web3gradient)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      
      {/* Database cylinder - top ellipse */}
      <ellipse
        cx="50"
        cy="32"
        rx="18"
        ry="5"
        fill="url(#dbgradient)"
        opacity="0.8"
      />
      
      {/* Database cylinder - middle body */}
      <rect
        x="32"
        y="32"
        width="36"
        height="28"
        fill="url(#dbgradient)"
        opacity="0.6"
      />
      
      {/* Database cylinder - bottom ellipse */}
      <ellipse
        cx="50"
        cy="60"
        rx="18"
        ry="5"
        fill="url(#dbgradient)"
        opacity="0.8"
      />
      
      {/* Database data layers */}
      <ellipse
        cx="50"
        cy="40"
        rx="16"
        ry="3"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1"
        opacity="0.9"
      />
      
      <ellipse
        cx="50"
        cy="48"
        rx="16"
        ry="3"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1"
        opacity="0.9"
      />
      
      <ellipse
        cx="50"
        cy="56"
        rx="16"
        ry="3"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1"
        opacity="0.9"
      />
      
      {/* Web3 connection nodes */}
      <circle cx="35" cy="20" r="2" fill="url(#web3gradient)" />
      <circle cx="65" cy="20" r="2" fill="url(#web3gradient)" />
      <circle cx="78" cy="50" r="2" fill="url(#web3gradient)" />
      <circle cx="65" cy="80" r="2" fill="url(#web3gradient)" />
      <circle cx="35" cy="80" r="2" fill="url(#web3gradient)" />
      <circle cx="22" cy="50" r="2" fill="url(#web3gradient)" />
      
      {/* Connection lines forming a network */}
      <line x1="35" y1="20" x2="45" y2="30" stroke="url(#web3gradient)" strokeWidth="1.5" opacity="0.6" />
      <line x1="65" y1="20" x2="55" y2="30" stroke="url(#web3gradient)" strokeWidth="1.5" opacity="0.6" />
      <line x1="78" y1="50" x2="68" y2="50" stroke="url(#web3gradient)" strokeWidth="1.5" opacity="0.6" />
      <line x1="22" y1="50" x2="32" y2="50" stroke="url(#web3gradient)" strokeWidth="1.5" opacity="0.6" />
      <line x1="35" y1="80" x2="45" y2="65" stroke="url(#web3gradient)" strokeWidth="1.5" opacity="0.6" />
      <line x1="65" y1="80" x2="55" y2="65" stroke="url(#web3gradient)" strokeWidth="1.5" opacity="0.6" />
      
      {/* Central data flow indicators */}
      <circle cx="42" cy="46" r="1" fill="#ffffff" opacity="0.7" />
      <circle cx="50" cy="44" r="1" fill="#ffffff" opacity="0.7" />
      <circle cx="58" cy="46" r="1" fill="#ffffff" opacity="0.7" />
    </SvgIcon>
  );
};

export default Web3DBLogo;
