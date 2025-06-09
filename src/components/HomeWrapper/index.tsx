'use client';

import React, { useState } from 'react';
import TopBar from '@/components/TopBar';
import MenuBar from '@/components/MenuBar';
import HomeScreen from '@/components/HomeScreen';

interface Props {
  username: string;
  uuid: string;
  email: string;
  profilePictureUrl?: string;
}

const HomeWrapper: React.FC<Props> = ({ username, uuid, email, profilePictureUrl }) => {
  const [selected, setSelected] = useState('home');

  return (
    <>
      <TopBar username={username} profilePictureUrl={profilePictureUrl} />

      <div
        className="flex-1 w-full overflow-y-auto px-4"
        style={{ paddingTop: 80, paddingBottom: 80 }}
      >
        <HomeScreen username={username} uuid={uuid} email={email} />
      </div>

      <MenuBar selected="home" />
    </>
  );
};

export default HomeWrapper;
