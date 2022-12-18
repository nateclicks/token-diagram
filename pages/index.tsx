import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import LoadingFiles from './loading-files';

const Editor = dynamic(() => import('../components/Editor'), {
  ssr: false,
}) as any;

export default function Home() {
  const { query } = useRouter();
  const isExportMode = useMemo(() => 'exportMode' in query, [query]);
  return (
    <>
      <Head>
        <title>token-diagram</title>
      </Head>
      <Editor id="home" showUI={!isExportMode} />
      {/* <LoadingFiles></LoadingFiles> */}
    </>
  );
}
