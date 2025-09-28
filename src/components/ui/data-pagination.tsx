import * as React from 'react'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface DataPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisible?: number
  className?: string
}

export function DataPagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
  className,
}: DataPaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const getVisiblePageNumbers = () => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const halfVisible = Math.floor(maxVisible / 2)
    let start = Math.max(1, currentPage - halfVisible)
    const end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const visiblePages = getVisiblePageNumbers()
  const showStartEllipsis = visiblePages[0] > 1
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages

  return (
    <Pagination className={className}>
      <PaginationContent>
        {/* 上一页 */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage > 1) {
                onPageChange(currentPage - 1)
              }
            }}
            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {/* 第一页 */}
        {showStartEllipsis && (
          <>
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(1)
                }}
                isActive={currentPage === 1}
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {/* 可见页面 */}
        {visiblePages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onPageChange(page)
              }}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* 最后一页 */}
        {showEndEllipsis && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(totalPages)
                }}
                isActive={currentPage === totalPages}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* 下一页 */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage < totalPages) {
                onPageChange(currentPage + 1)
              }
            }}
            className={
              currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
