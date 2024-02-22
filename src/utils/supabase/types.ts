import { SELECT_ARTICLES } from '@/hooks/useArticles';
import { createClient } from './server';
import { Database } from './types.autogen';

export type Article = Database['public']['Tables']['articles']['Row'];
export type ArticleInsert = Database['public']['Tables']['articles']['Insert'];

const supabase = createClient()
const getArticles = async () => await supabase.from("articles").select(SELECT_ARTICLES).single()

export type ArticlesSB = NonNullable<Awaited<ReturnType<typeof getArticles>>["data"]>