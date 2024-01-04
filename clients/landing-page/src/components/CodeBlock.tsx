import { Box } from '@chakra-ui/react';
import { Highlight, themes } from 'prism-react-renderer';

export const CodeBlock = ({ children, language }: { children: string; language: string }) => (
  <Highlight theme={themes.nightOwl} code={children} language={language}>
    {({ tokens, getLineProps, getTokenProps }) => (
      <Box as="pre" p={4} bg="gray.900" borderRadius={4} overflowX="scroll">
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({ line })}>
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({ token })} />
            ))}
          </div>
        ))}
      </Box>
    )}
  </Highlight>
);
