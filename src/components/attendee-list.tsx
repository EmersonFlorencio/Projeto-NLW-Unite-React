import { ChangeEvent, useEffect, useState } from 'react'

import { Search, MoreHorizontal, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'
import { IconButton } from './icon-button'
import { Table } from './table/table'
import { TableHeader } from './table/table-header'
import { TableCell } from './table/table-cell'
import { TableRow } from './table/table-row'

interface AttendeeList {
  id?: string,
  name: string,
  email: string,
  checkedInAt: string | null,
  createdAt: string | null,
}

export function AttendeeList() {
  const [valorInput, setValorInput] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('query')) {
      return url.searchParams.get('query') ?? ''
    }

    return ''
  });
  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('page')) {
      return Number(url.searchParams.get('page'))
    }

    return 1
  });
  const [attendees, setAttendees] = useState<AttendeeList[]>([]);
  const [total, setTotal] = useState(0)

  const totalPages = Math.ceil(total / 10);

  useEffect(() => {
    const url = new URL('http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees');

    url.searchParams.set('pageIndex', String(page - 1));

    if (valorInput.length > 0) {
      url.searchParams.set('query', valorInput);
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setAttendees(data.attendees);
        setTotal(data.total);
      });
  }, [page, valorInput])

  const onSearchYnputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentSearch(event.target.value);
    setCurrentPage(1);
  }

  const setCurrentSearch = (search: string) => {
    const url = new URL(window.location.toString())

    url.searchParams.set('query', search)

    window.history.pushState({}, "", url)

    setValorInput(search)
  }

  const setCurrentPage = (page: number) => {
    const url = new URL(window.location.toString())

    url.searchParams.set('page', String(page))

    window.history.pushState({}, "", url)

    setPage(page)
  }

  const goToFirstPage = () => {
    setCurrentPage(1);
  }
  const goToLastPage = () => {
    setCurrentPage(totalPages);
  }

  const goToPreviusPage = () => {
    setCurrentPage(page - 1);
  }

  const goToNextPage = () => {
    setCurrentPage(page + 1);
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participantes</h1>
        <div className="px-3 w-72 py-1.5 border border-white/10 rounded-lg text-sm flex gap-3 items-center">
          <Search className='size-4 text-emerald-300' />
          <input onChange={onSearchYnputChange}
            value={valorInput}
            className="bg-transparent flex-1 outline-none border-0 p-0 text-sm focus:ring-0"
            placeholder="Buscar participantes..."
          />
        </div>
      </div>

      <Table className='w-full '>
        <thead>
          <TableRow>
            <TableHeader style={{ width: 48 }} >
              <input type="checkbox" className='size-4 bg-black/20 rounded border border-white/10' />
            </TableHeader>
            <TableHeader>Código</TableHeader>
            <TableHeader>Participantes</TableHeader>
            <TableHeader>Data da Inscrição</TableHeader>
            <TableHeader>Data do check-in</TableHeader>
            <TableHeader style={{ width: 64 }} ></TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {attendees.map((attendee) => {
            return (
              <TableRow key={attendee.id}>
                <TableCell >
                  <input type="checkbox" className='size-4 bg-black/20 rounded border border-white/10' />
                </TableCell>
                <TableCell >{attendee.id}</TableCell>
                <TableCell >
                  <div className='flex flex-col gap-1'>
                    <span className='text-white font-semibold'>{attendee.name}</span>
                    <span>{attendee.email}</span>
                  </div>
                </TableCell>
                <TableCell >{attendee.createdAt}</TableCell>
                <TableCell >{attendee.checkedInAt === null
                  ? <span className='text-zinc-400'>Não fez Check-In</span>
                  : attendee.checkedInAt}
                </TableCell>
                <TableCell>
                  <IconButton transparent>
                    <MoreHorizontal className='size-4' />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          })}

        </tbody>
        <tfoot>
          <TableRow>
            <TableCell className='py-3 px-4 text-sm text-zinc-300' colSpan={3}>Mostrando {attendees.length} de {total} itens </TableCell>
            <TableCell className='text-right' colSpan={3}>
              <div className='inline-flex items-center gap-8'>
                <span>Página {page} de {totalPages}</span>

                <div className='flex gap-1.5'>
                  <IconButton onClick={goToFirstPage} disabled={page === 1}>
                    <ChevronsLeft className='size-4' />
                  </IconButton>
                  <IconButton onClick={goToPreviusPage} disabled={page === 1}>
                    <ChevronLeft className='size-4' />
                  </IconButton>
                  <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                    <ChevronRight className='size-4' />
                  </IconButton>
                  <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                    <ChevronsRight className='size-4' />
                  </IconButton>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </tfoot>
      </Table>
    </div>
  )
}
