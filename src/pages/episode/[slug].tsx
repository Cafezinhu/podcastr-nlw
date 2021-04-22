import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';

type Episode = {
    id: string;
    title: string;
    members: string;
    published_at: string;
    publishedAt: string;
    thumbnail: string;
    description: string;
    durationAsString: string;
    file: {
      url: string;
      type: string;
      duration: number;
    }
}

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({episode}: EpisodeProps){
    return(
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar"/>
                    </button>
                </Link>
                <Image 
                    width={700} 
                    height={160} 
                    src={episode.thumbnail} 
                    objectFit="cover" 
                />
                <button type='button'>
                    <img src="/play.svg" alt="Tocar episódio"/>
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt} </span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}} />
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const {slug} = ctx.params;
    const {data} = await api.get(`/episodes/${slug}`);

    const { id, description, file, members, published_at, thumbnail, title} = data;

    const episode =  {
      id,
      title,
      thumbnail,
      description,
      members,
      duration: Number(file.duration),
      durationAsString: convertDurationToTimeString(Number(file.duration)),
      publishedAt: format(parseISO(published_at), 'd MMM yy', {locale: ptBR})
    };
    
    return{
        props: {episode},
        revalidate: 60 * 60 * 24, // 24 horas
    }
}