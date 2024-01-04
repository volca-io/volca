import { Container, Link } from '@chakra-ui/react';
import { SectionHeader } from '../../components/SectionHeader';

const Page = () => (
  <Container maxW="6xl" py={12}>
    <SectionHeader
      category="Success"
      title="Welcome to Volca!"
      description={
        <>
          Thank you for your payment. You will receive an e-mail from GitHub with an invitation to the repository. Do
          you have questions or need help? Join our{' '}
          <Link href="https://join.slack.com/t/volcahq/shared_invite/zt-1kj1tnuf5-kjWH9a4XCjiiuUPi3HN2Mw" isExternal>
            Slack Workspace
          </Link>!
        </>
      }
    ></SectionHeader>
  </Container>
);

export default Page;
