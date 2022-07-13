import { GetStaticPaths, GetStaticProps } from 'next';

import Head from 'next/head';
import { title } from 'process';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { RichText } from 'prismic-dom';
import Image from 'next/image';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { formatDate } from '../../lib/formatDate';

interface Post {
  first_publication_date: string | null;
  readingTime: number;
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
  return (
    <>
      <Head>
        <title>{`${title} | spacetraveling`}</title>
      </Head>
      <Header />
      <main className={styles.container}>
        {post ? (
          <>
            <img src={post.data.banner.url} alt="" />

            <section className={styles.content}>
              <h1>{post.data.title}</h1>

              <div className={styles.infos}>
                <FiCalendar />
                <time>{post.first_publication_date}</time>
                <FiUser />
                <span>{post.data.author}</span>
                <FiClock />
                <time>{post.readingTime} min</time>
              </div>
              {post.data.content.map(group => {
                return (
                  <div key={group.heading} className={styles.contentGroup}>
                    <h2>{group.heading}</h2>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: RichText.asHtml(group.body),
                      }}
                    />
                  </div>
                );
              })}
            </section>
          </>
        ) : (
          <div className={styles.loading}>
            <div>
              <img src="/loading.svg" alt="" />
              <span>Carregando...</span>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');
  const postsToBuild = posts.results
    .map(post => {
      return {
        params: {
          slug: post.uid,
        },
      };
    })
    .slice(0, 3);

  // TODO
  return {
    paths: postsToBuild,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(slug));

  const readingTime = Math.round(
    response.data.content.reduce((acc, group) => {
      let currentAcc = acc;

      const words = RichText.asText(group.body).split(' ');

      currentAcc += words.length;

      return currentAcc;
    }, 0) / 200
  );

  const post: Post = {
    first_publication_date: formatDate(response.first_publication_date),
    readingTime,
    data: {
      title: response.data.title,
      banner: { url: response.data.banner.url },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
      readingTime,
    },
  };
};
