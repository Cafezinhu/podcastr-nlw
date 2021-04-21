import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { Header } from "../components/Header";
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

type Episode = {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  description: string;
  file: {
    url: string;
    type: string;
    duration: number;
  }
}

type HomeProps = {
  episodes: Episode[]
}

export default function Home(props: HomeProps) {

  return (
    <div>{JSON.stringify(props.episodes)}</div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map((episode: Episode) => {
    const { id, description, file, members, published_at, thumbnail, title} = episode;

    return {
      id,
      title,
      thumbnail,
      description,
      members,
      duration: Number(file.duration),
      durationAsString: convertDurationToTimeString(Number(file.duration)),
      publishedAt: format(parseISO(published_at), 'd MMM yy', {locale: ptBR})
    };
  });

  return {
    props: {
      episodes
    },
    revalidate: 60 * 60 * 8
  }
}