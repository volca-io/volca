import React, { ReactElement, useEffect, useRef, useState } from 'react';
import {
  Card,
  CardHeader,
  Flex,
  HStack,
  IconButton,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { MdArrowBack, MdArrowForward, MdRefresh } from 'react-icons/md/index.js';
import _ from 'lodash';

interface ColumnProps<T> {
  id: string;
  title?: string;
  render: ({ row }: { row: T }) => React.ReactNode;
}

interface PaginatedTableProps<T> {
  data: Array<T>;
  columns: Array<ColumnProps<T>>;
  totalRecords: number;
  isLoading: boolean;
  error?: string;
  pageSize?: number;
  emptyMessage?: string;
  onChangePage: ({ page, size }: { page: number; size: number }) => void;
  onRefresh?: ({ page, size }: { page: number; size: number }) => void;
  actions?: ReactElement;
}

export const PaginatedTable = <T extends Record<string, unknown>>({
  actions,
  data,
  columns,
  totalRecords,
  pageSize = 10,
  isLoading,
  error,
  emptyMessage,
  onChangePage,
  onRefresh,
}: PaginatedTableProps<T>) => {
  const [pageIndex, setPageIndex] = useState(0);
  const mounted = useRef(false);

  const startCount = pageIndex * pageSize + 1;
  const endCount = startCount + data.length - 1;

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    onChangePage({ page: pageIndex, size: pageSize });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  return (
    <Card>
      <CardHeader>
        <Flex direction="row" justifyContent="flex-end" mb={2}>
          <HStack align="flex-end">
            {actions}
            {onRefresh && (
              <IconButton
                aria-label="refresh"
                icon={<MdRefresh />}
                onClick={() => onRefresh({ page: pageIndex, size: pageSize })}
              />
            )}
          </HStack>
        </Flex>
      </CardHeader>
      <TableContainer>
        <Table variant="custom">
          <Thead>
            <Tr>
              {columns.map(({ id, title }) => (
                <Th key={id}>{title}</Th>
              ))}
            </Tr>
          </Thead>

          <Tbody>
            {isLoading &&
              _.times(5, (num) => (
                <Tr key={num}>
                  {columns.map((_, index) => (
                    <Td key={index}>
                      <Skeleton height={5} />
                    </Td>
                  ))}
                </Tr>
              ))}
            {!isLoading &&
              data &&
              data.map((row: T, index) => (
                <Tr key={index}>
                  {columns.map((column) => (
                    <Td key={column.id}>{column.render({ row })}</Td>
                  ))}
                </Tr>
              ))}
            {emptyMessage && !isLoading && data && data.length === 0 && (
              <Tr>
                <Td colSpan={columns.length} textAlign="center">
                  <Text>{emptyMessage}</Text>
                </Td>
              </Tr>
            )}
            {error && (
              <Tr>
                <Td colSpan={columns.length} textAlign="center">
                  <Text>{error}</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
        <Flex flexDir="row" justifyContent="space-between" alignItems="center" p={4}>
          <Flex>{totalRecords > 0 && <Text>{`Showing ${startCount} to ${endCount} of ${totalRecords} `}</Text>}</Flex>
          <Flex gap={4}>
            <IconButton
              size="sm"
              icon={<MdArrowBack />}
              aria-label="Previous"
              isDisabled={pageIndex === 0}
              onClick={() => setPageIndex(pageIndex - 1)}
            />
            <IconButton
              size="sm"
              icon={<MdArrowForward />}
              aria-label="Next"
              isDisabled={endCount >= totalRecords}
              onClick={() => setPageIndex(pageIndex + 1)}
            />
          </Flex>
        </Flex>
      </TableContainer>
    </Card>
  );
};
