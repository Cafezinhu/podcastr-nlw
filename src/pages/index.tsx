import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss';
import { usePlayer } from '../contexts/PlayerContext';
import Head from 'next/head';
import jsonFile from '../../server.json';

type Episode = {
  id: string;
  title: string;
  members: string;
  published_at: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  durationAsString: string;
  duration: number;
  url: string;
  file: {
    url: string;
    type: string;
    duration: number;
  }
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer();

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
            return(
              <li key={episode.id}>
                <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title} 
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>
                <button type="button" onClick={() => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            );
          })}
          <li className={styles.latestEpisodesSpacer} />
        </ul>
      </section>

      <section className={styles.allEpisodes}>
          <h2>Todos episódios</h2>

          <table cellSpacing={0}>
            <thead>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>
                <span>Data</span>
                <span>Duração</span>
              </th>
            </thead>
            <tbody>
              {allEpisodes.map((episode, index) => {
                return(
                  <tr key={episode.id}>
                    <td className={styles.tdImage}>
                      <Image 
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                      />
                    </td>
                    <td>
                      <Link href={`/episode/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{episode.members}</td>
                    <div className={styles.timeAndPlay}>
                      <div className={styles.timeInfo}>
                        <td style={{ width: 100 }}>{episode.publishedAt}</td>
                        <td>{episode.durationAsString}</td>
                      </div>
                      <td>
                        <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                          <img src="/play-green.svg" alt="Tocar episódio"/>
                        </button>
                      </td>
                    </div>
                  </tr>
                );
              })}
            </tbody>
          </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
    const episodes = jsonFile.episodes.map((episode) => {
    const { id, description, file, members, published_at, thumbnail, title} = episode;

    return {
      id,
      title,
      thumbnail,
      description,
      members,
      duration: Number(file.duration),
      url: file.url,
      durationAsString: convertDurationToTimeString(Number(file.duration)),
      publishedAt: format(parseISO(published_at), 'd MMM yy', {locale: ptBR})
    };
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length - 1);

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8
  }
}