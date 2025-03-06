import React from 'react';
import { Slider, Space, Tooltip } from 'antd';
import { SoundOutlined, AudioMutedOutlined } from '@ant-design/icons';
import { useUnit } from 'effector-react';
import { $volume, setVolume } from '../../../../services/radioService';

const VolumeControl: React.FC = () => {
  const volume = useUnit($volume);

  const handleVolumeChange = (value: number) => {
    setVolume(value / 100);
  };

  const isMuted = volume === 0;

  return (
    <Tooltip title='Громкость радио'>
      <Space className='volume-control'>
        {isMuted ? <AudioMutedOutlined /> : <SoundOutlined />}
        <Slider
          value={volume * 100}
          onChange={handleVolumeChange}
          style={{ width: 80 }}
          min={0}
          max={100}
          size='small'
        />
      </Space>
    </Tooltip>
  );
};

export default VolumeControl;
