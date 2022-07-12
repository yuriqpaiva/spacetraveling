import { GetStaticProps } from 'next';

import Head from 'next/head';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const { next_page, results } = postsPagination;

  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.content}>
          {results.map(post => {
            return (
              <Link href={`/post/${post.uid}`} key={post.uid}>
                <a>
                  <strong>{post.data.title}</strong>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.infos}>
                    <FiCalendar width={20} height={20} />
                    <time>{post.first_publication_date}</time>
                    <FiUser width={20} height={20} />
                    <span>{post.data.author}</span>
                  </div>
                </a>
              </Link>
            );
          })}
          {next_page && <button type="button">Carregar mais posts</button>}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});

  const postsResponse = await prismic.getByType('posts');

  // uid?: string;
  // first_publication_date: string | null;
  // data: {
  //   title: string;
  //   subtitle: string;
  //   author: string;
  // };

  const posts = postsResponse.results.map(post => {
    const date = format(
      new Date(post.first_publication_date),
      "dd' 'MMMM' 'yyyy",
      {
        locale: ptBR,
      }
    ).split(' ');

    const formattedDate = date.reduce((acc, value, index) => {
      let currentAcc = acc;

      if (index !== 1) {
        currentAcc += value;
      } else {
        currentAcc += ` ${value.charAt(0).toUpperCase() + value.slice(1, 3)} `;
      }

      return currentAcc;
    }, '');

    return {
      uid: post.uid,
      first_publication_date: formattedDate,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        results: posts,
        next_page: postsResponse.next_page,
      },
    },
  };
};
