import { Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

type LogoProps = {
  linkToHome?: boolean;
  width?: number;
};

export const Icon = ({ linkToHome = true, width = 24 }: LogoProps) => {
  const image = <Image id="logo" src="/icon.svg" width={width} />;

  return linkToHome ? <Link to="/">{image}</Link> : image;
};
