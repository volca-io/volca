import { Avatar, Container, Flex, Heading, Image, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { SectionHeader } from '../../../components/SectionHeader';
import header from './engineer-to-founder-hero.webp';
import arvid from './arvid.webp';
import pieter from './pieter.webp';
import joma from './joma.webp';
import techlead from './techlead.webp';

const Page = () => {
  return (
    <Container maxW="4xl" py={12}>
      <SectionHeader category="Blog" title="From Software Employee to Founder" description="" />

      <Image src={header} alt="Blog post hero image" my={16} />

      <Flex flexDirection="column" gap={12} my={16}>
        <Flex flexDirection="column" gap={6}>
          <Heading as="h2" fontSize="2xl">
            The Dream
          </Heading>
          <Text>
            Ever since the first unicorn tech companies started turning billions of dollars in profit and employing
            thousands of engineers, the number of software engineering employees with a dream to one day start their own
            company has been increasing rapidly. According to Stack Overflows developer survey, 25% of developers hope
            to be working as a founder or a co-founder of their own company in five years.
          </Text>
          <Text>
            The reasons why developers like you want to start their own companies are many. Some of the most common
            reasons are:
          </Text>

          <Heading as="h3" fontSize="xl">
            Money
          </Heading>
          <Text>
            Of course, one of the biggest reasons for starting a company is to be able to make a lot of money. While the
            average developer salary is higher than for many other professions, it rarely reaches the life changing
            levels that building a successful company can reach. Instead of trading time for money, you can use your
            skills to build a product and trade the value that the product brings your customers for money. If the
            product turns a profit and shows growth potential, there any many investors and other software companies who
            are looking for potential acquisitions. Note though that statistics say that most companies do not survive
            even their first year. Making a lot of money from starting a company is something that requires a lot of
            hard work and dedication.
          </Text>

          <Heading as="h3" fontSize="xl">
            Freedom
          </Heading>
          <Text>
            Not having to go to an office or showing up to the daily standup call every day is something many developers
            dream about. Being able to have full control over your time can be good for your productivity as well. Some
            days you might be extremely productive and some days you might be stuck battling some issue. Or you get
            nothing done because of a day full of mandatory meetings. With your own company, you work when you feel like
            it.
          </Text>

          <Heading as="h3" fontSize="xl">
            Passion
          </Heading>
          <Text>
            Working as an employee means, in most cases, that you will be building what someone else wants you to build.
            There is always a CEO, a Product Manager or an Engineering Manager setting the goals for the team. Starting
            your own company means that you can build a product that you are truly passionate about instead of building
            someone elses vision.
          </Text>

          <Heading as="h3" fontSize="xl">
            Technology
          </Heading>
          <Text>
            In the end, developers love to build software. And they usually strong opinions and ideas on how great
            software should be built. Starting a business means full control over the technology stack used and the
            founders can be part of every technical decision made.
          </Text>
        </Flex>

        <Flex flexDirection="column" gap={8}>
          <Heading as="h2" fontSize="2xl">
            The Path
          </Heading>
          <Text>
            There are many ways a software developer can start their path to becoming a founder. In this section, we
            outline various ways that you can take to start a company as a software developer.
          </Text>

          <Flex flexDirection="column" gap={6}>
            <Heading as="h3" fontSize="xl">
              Build a SaaS Product
            </Heading>
            <Text>
              Software-as-a-Service (SaaS) products such as X, Y and Z usually solve a business problem and charge a
              monthly or usage based fee. This is a proven business model that have backed many of the unicorn companies
              of today.
            </Text>

            <Heading as="h4" fontSize="large">
              Skills
            </Heading>
            <UnorderedList spacing={4}>
              <ListItem>
                <b>Programming</b> - To develop a SaaS, you most likely will have to write some code. There are many
                different programming languages that you can use to build a SaaS, most likely you can use one that you
                already know. During recent years, no codde and low code tools that help you speed up your development
                have also gained traction in the SaaS world.
              </ListItem>
              <ListItem>
                <b>Marketing</b> - Getting your products in front of peoples eyes is an art. The strategies you need
                depend on who you are targeting - maybe you should invest in paid advertising, outreach or SEO.
              </ListItem>
              <ListItem>
                <b>Management</b> - Unless you are building a permanent one man startup, there might come a day when you
                need to employ someone to work for you. In this case, you need management skills to guide them towards
                building your product vision.
              </ListItem>
            </UnorderedList>

            <Heading as="h4" fontSize="large">
              Examples of Solo SaaS Founders
            </Heading>
            <Flex gap={8}>
              <Avatar src={arvid} size="xl" name="Arvid Kahl" />
              <Flex flexDirection="column" gap={2} justifyContent="center">
                <Heading as="h4" fontSize="xl">
                  Arvid Kahl
                </Heading>
                <Text>
                  Arvid made a successful exit with his SaaS FeedbackPanda in 2019 and has since then reached further
                  success with courses and books about building online companies.
                </Text>
              </Flex>
            </Flex>
            <Flex gap={8}>
              <Avatar src={pieter} size="xl" name="Pieter Levels" />
              <Flex flexDirection="column" gap={2} justifyContent="center">
                <Heading as="h4" fontSize="xl">
                  Pieter Levels
                </Heading>
                <Text>
                  Pieter founded NomadList.com - a site where remote and traveling developers can find others in the
                  same situation. Today, Pieter is building a portfolio of products with a constantly increasing
                  revenue.
                </Text>
              </Flex>
            </Flex>
          </Flex>

          <Flex flexDirection="column" gap={6}>
            <Heading as="h3" fontSize="xl">
              Build Mobile Apps
            </Heading>
            <Text>
              Mobile apps can be a great source of income as a software entrepreneur. You can build an app that solves a
              very specific consumer problem and offer it either as a paid app or with a freemium model. Many solo
              founders run a portfolio of apps that constantly generate revenue with small but frequent transactions.
            </Text>
            <Heading as="h4" fontSize="large">
              Skills
            </Heading>
            <UnorderedList spacing={4}>
              <ListItem>
                <b>Programming</b> - Building apps has become easier over the years with frameworks such as React Native
                and Flutter emerging along with the native SDKs. If you are experienced with one or two of the most
                common languages, chances are you can find a way to build an app that suits your skills.
              </ListItem>
              <ListItem>
                <b>Marketing</b> - In many cases, mobile apps are targeted to consumers. This might require a particular
                set of marketing skills that help you reach specific consumers.
              </ListItem>
            </UnorderedList>
          </Flex>

          <Flex flexDirection="column" gap={6}>
            <Heading as="h3" fontSize="xl">
              Become a YouTube Creator
            </Heading>
            <Text>
              Sharing your skills, experiences and stories from the world of software is something that you can
              monetize. Many people today make their living creating content on platforms such as YouTube.
            </Text>
            <Heading as="h4" fontSize="large">
              Skills
            </Heading>
            <UnorderedList spacing={4}>
              <ListItem>
                <b>Video Editing</b> - To get people to stick around and watch your videos, you need to make sure they
                look good.
              </ListItem>
              <ListItem>
                <b>Speaking</b> - YouTube is a medium where you are in the center. With the right speaking skills, you
                will draw in your audience and make them watch more of your content.
              </ListItem>
            </UnorderedList>
            <Heading as="h4" fontSize="large">
              Examples of YouTube Creators
            </Heading>
            <Text>
              These YouTube creators make millions running their channels. Have a look at how they are doing it to see
              if it's something that you could do.
            </Text>
            <Flex gap={8}>
              <Avatar src={joma} size="xl" name="Joma Tech" />
              <Flex flexDirection="column" gap={2} justifyContent="center">
                <Heading as="h4" fontSize="xl">
                  Joma Tech
                </Heading>
                <Text>
                  Joma Tech has almost two million followers and posts both comedic and informative videos with a focus
                  on technology.
                </Text>
              </Flex>
            </Flex>
            <Flex gap={8}>
              <Avatar src={techlead} size="xl" name="Tech Lead" />
              <Flex flexDirection="column" gap={2} justifyContent="center">
                <Heading as="h4" fontSize="xl">
                  Tech Lead
                </Heading>
                <Text>
                  TechLead TechLead has over one million followers and posts videos on how to make money as well as
                  satirical videos on various subjects. TechLead also runs a few different products focusing on helping
                  people get a job in tech.
                </Text>
              </Flex>
            </Flex>
          </Flex>

          <Flex flexDirection="column" gap={6}>
            <Heading as="h3" fontSize="xl">
              Become a Consultant
            </Heading>
            <Text>
              One of the easiest way to start your own company as a developer is to start consulting as a freelancer.
              This gives you an introduction to running your own company and everything it entails. It can also be
              easier to work part time as a consultant if you want to work on other projects in parallel.
            </Text>
            <Heading as="h4" fontSize="large">
              Skills
            </Heading>
            <UnorderedList spacing={4}>
              <ListItem>
                <b>Networking</b> - While there many sites that help you find assignments, one of the best channels is
                your own professional network
              </ListItem>
              <ListItem>
                If you are already a developer, investigate which of your skills are in highest demand and make sure to
                highlight them.
              </ListItem>
            </UnorderedList>
          </Flex>

          <Flex flexDirection="column" gap={6}>
            <Heading as="h3" fontSize="xl">
              Start an Agency
            </Heading>
            <Text>
              An agency can be considered the next step after solo consulting. With an agency you have a chance to
              achieve a higher level of freedom if you delivery team is working for the client while you manage sales
              and requirements. You could potentially also have a greater say in the technology choices made in the
              project.
            </Text>
            <Heading as="h4" fontSize="large">
              Skills
            </Heading>
            <UnorderedList spacing={4}>
              <ListItem>
                <b>Sales</b> - Running an agency means you need to find projects for your team to work on.
              </ListItem>
              <ListItem>
                <b>Management</b> - An agency means employees that you need to manage not only as employees but also as
                project team members
              </ListItem>
            </UnorderedList>
          </Flex>
        </Flex>

        <Flex flexDirection="column" gap={4}>
          <Heading as="h2" fontSize="2xl">
            Start Your Journey
          </Heading>
          <Text>
            Any path of combination of the above paths can be your way to running your own business as a developer. You
            do not need to jump in with both feet though. There is always the possibility of testing ideas in parallel
            with a full time job or working part time while you are validating your idea. If you never take the first
            step, you will never experience the rollercoaster that founding a company can be.
          </Text>
        </Flex>
      </Flex>
    </Container>
  );
};

export default Page;
