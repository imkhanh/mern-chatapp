import React from 'react';

const Avatar = ({ size = '40px', alt, src }) => {
  return (
    <figure style={{ width: size, height: size }}>
      <img
        alt={alt}
        src={src}
        style={{
          width: size,
          height: size,
          objectFit: 'cover',
          background: 'white',
          border: '1px solid #eee',
          borderRadius: '50%',
        }}
      />
    </figure>
  );
};

export default Avatar;
