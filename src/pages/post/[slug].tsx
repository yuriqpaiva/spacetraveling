import { GetStaticPaths, GetStaticProps } from 'next';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { title } from 'process';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { RichText } from 'prismic-dom';
import Header from '../../components/Header';
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
  return (
    <>
      <Head>
        <title>{`${title} | spacetraveling`}</title>
      </Head>
      <Header />
      <main className={styles.container}>
        <img src="/Banner.png" alt="" />

        <section className={styles.content}>
          <h1>Criando um app CRA do zero</h1>

          <div className={styles.infos}>
            <FiCalendar />
            <time>15 Mar 2021</time>
            <FiUser />
            <span>Yuri Paiva</span>
            <FiClock />
            <time>4 min</time>
          </div>
        </section>
      </main>
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
  const response = await prismic.getByUID('posts', String(slug));

  const postContent = response.data.content.map(element => {
    return {
      heading: element.heading,
      body: RichText.asHtml(element.body),
    };
  });

  // const something = postContent.map(element => {
  //   return RichText.asHtml(element);
  // });

  const post: Post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: { url: response.data.banner.url },
      author: response.data.author,
      content: postContent,
    },
  };

  console.log(JSON.stringify(postContent, null, 2));

  // TODO
  return {
    props: {},
  };
};
