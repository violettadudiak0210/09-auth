'use client';
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes, type FetchNotesResponse } from "@/lib/api/clientApi";
import { useState } from "react";
import Link from "next/link";
import css from "./notesPage.module.css";

type NoteListClientProps = {
  tag?: string;
};

const NoteListClient = ({ tag }: NoteListClientProps) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSetQuery = useDebouncedCallback((value: string) => {
    setDebouncedQuery(value);
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
    debouncedSetQuery(e.target.value);
  };

const { data } = useQuery<FetchNotesResponse>({
  queryKey: ['notes', { query: debouncedQuery, page: page, tag: tag }],
  queryFn: () => fetchNotes(debouncedQuery, page, tag || ''),
  placeholderData: keepPreviousData,
  refetchOnMount: false,
});

  const totalPages = data?.totalPages || 0;

  return (
    <>
      <header className={css.toolbar}>
        <SearchBox searchQuery={query} onUpdate={handleInputChange} />
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create NOTE +
        </Link>
      </header>

      {data?.notes && <NoteList notes={data.notes} />}
    </>
  );
};

export default NoteListClient;
