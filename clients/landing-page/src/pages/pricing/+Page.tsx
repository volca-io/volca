import { Container } from '@chakra-ui/react';
import { PricingSection } from '../../components/sections/PricingSection.js';

const Page = () => {
  return (
    <Container maxW="6xl" py={12}>
      <PricingSection />
    </Container>
  );
};

export default Page;
