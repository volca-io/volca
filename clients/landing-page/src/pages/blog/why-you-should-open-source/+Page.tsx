import { Container, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { SectionHeader } from '../../../components/SectionHeader';
import header from './open-source-header.webp';

const Page = () => {
  return (
    <Container maxW="4xl" py={12}>
      <SectionHeader category="Blog" title="How to Get Customers by Making Your Product Open Source" description="" />

      <Image src={header} alt="Blog post hero image" my={16} />

      <Flex flexDirection="column" gap={16} my={16}>
        <Flex flexDirection="column" gap={6}>
          <Text>
            My open source story began with the first product I developed. It was a tool that I created to be able to
            mock API responses for testing and development purposes. I worked hard for months to finish the first
            version of the product. Then, it was finally time for The Big Launch. I posted a link to my product on sites
            such as Hacker News and Indiehackers and expected a huge spike in traffic and revenue. What did I get? Maybe
            a hundred visitors and no revenue. This made me realize I needed a way to build long term and sustainable
            source of traffic. I watched everything I could find about SEO, referral traffic, paid marketing and content
            marketing. With my new knowledge, I sat down to think of how to use my new knowledge to get people to visit
            my site.
          </Text>
          <Text>
            Simply reaching out and begging someone to put a link to my very much revenue driving site wouldn't work.
            People simply did not want to give away what is essentially ad space for free. I needed something that would
            be easy for someone to share without thinking twice. It had to be free and it had to bring some sort of
            value to the visitors. That is when I decided to make part of my product open source.
          </Text>
          <Text>
            The way I did it for my API tool is that I made it possible to run it locally and without a slick UI for
            free. Users could import my open source library, create their API configuration as code and then run it on
            their own machine. If they wanted to use a more user friendly UI and have their API hosted in the cloud,
            they had to pay. This way, I could get users into my ecosystem and later convert them to paid customers.
          </Text>
          <Text>
            Today, that product is making me consistent recurring revenue and I, together with my co-founder, have
            started a similar strategy for my new project - the NodeJS / React SaaS template Volca.
          </Text>
          <Text>
            Below I have shared four reasons why you should offer an open source version of your product and how you can
            get the most out of each opportunity.
          </Text>
        </Flex>

        <Flex flexDirection="column" gap={6}>
          <Heading as="h2" fontSize="2xl">
            ⌨️ Get traffic from GitHub
          </Heading>
          <Text>
            Simply exposing your code on GitHub can drive tons of traffic to your product. Developers often use GitHub
            to find code to use for their projects. If you manage to provide them with value and receive your first few
            GitHub stars to establish your repo as a trusted one, more will come. Creating a good repository is a topic
            for another article but make sure that you have a good README. Preferably one where you make sure to mention
            your paid product and a link to your landing page.
          </Text>
        </Flex>

        <Flex flexDirection="column" gap={6}>
          <Heading as="h2" fontSize="2xl">
            👷 Have your users improve your product
          </Heading>
          <Text>
            The very core of open source is to enable developers to contribute to your project. By exposing your code
            and opening it up for other developers to modify, you might get help with bugfixes or introducing new
            features. It can also act as a way to collect feedback about your product through GitHubs “Issues” feature.
          </Text>
        </Flex>

        <Flex flexDirection="column" gap={6}>
          <Heading as="h2" fontSize="2xl">
            📚 Get included in open source directories
          </Heading>
          <Text>
            There are numerous directories and websites that promote open source tools on the internet. One example are
            “awesome list” repositories that collect open source repositories in a certain category. To be added to
            these repositories, simply create a PR and hope that an active maintainer can approve and merge it. If you
            are lucky, these kind of repositories also have a website on a separate domain with a high Domain Rating. If
            they though, you might have received a high value backlink simply by putting up a tiny PR.
          </Text>
        </Flex>

        <Flex flexDirection="column" gap={6}>
          <Heading as="h2" fontSize="2xl">
            🔗 Improve chances of getting backlinks published
          </Heading>
          <Text>
            Today, website owners get tons of requests for adding various companies links to their site. There are even
            tools out there that automatically find and email relevant sites begging for a link. This might work in some
            cases, but in many cases you will at best get an email back saying a backlink costs $100 a year. And why
            should they bother adding your product to their site? If they would bindly publish a link to your paid
            product that would be giving away valuable advertising space for free. You need to be able to offer
            something that can be of instant value to the websites readers. One such thing could be an open source
            repository. Developers are always happy to share tools and technologies that they use. Pitching a link to an
            open source repository could be your golden ticket to getting backlinks easier.
          </Text>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Page;
