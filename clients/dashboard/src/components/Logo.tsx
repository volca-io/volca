import { Image, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

type LogoProps = {
  linkToHome?: boolean;
  width?: number;
};

export const Logo = ({ linkToHome = true, width = 14 }: LogoProps) => {
  const logoSource = useColorModeValue('/logo-dark.svg', '/logo-light.svg');

  const image = <Image id="logo" src={logoSource} width={width} />;

  return linkToHome ? <Link to="/">{image}</Link> : image;
};
