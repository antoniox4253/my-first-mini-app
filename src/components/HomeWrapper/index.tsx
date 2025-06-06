'use client';

import React, { useState } from 'react';
import TopBar from '@/components/TopBar';
import MenuBar from '@/components/MenuBar';
import HomeScreen from '@/components/HomeScreen';

interface Props {
  username?: string;
  profilePictureUrl?: string;
}

const HomeWrapper: React.FC<Props> = ({ username, profilePictureUrl }) => {
  const [selected, setSelected] = useState('home');

  return (
    <>
      <TopBar username={username} profilePictureUrl={profilePictureUrl} />

      <div
        className="flex-1 w-full overflow-y-auto px-4"
        style={{ paddingTop: 80, paddingBottom: 80 }}
        >
        <HomeScreen />
        </div>

      <MenuBar selected={selected} onSelect={setSelected} />
    </>
  );
};

export default HomeWrapper;
