import { GetStaticPaths, GetStaticProps } from 'next';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { title } from 'process';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  // TODO

  return (
    <>
      <Head>
        <title>{`${title} | spacetraveling`}</title>
      </Head>
      <div />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  // TODO
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient({});
  // const response = await prismic.getByUID('posts', String(slug));

  // TODO
  return {
    props: {},
  };
};
