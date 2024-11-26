import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { NUMBER_OF_POSTS_PER_PAGE } from '~/constants/constants'

const config = useRuntimeConfig()

const notion = new Client({
  auth: config.notionApiKey
})

const n2m = new NotionToMarkdown({ notionClient: notion })

// メタデータの取得
const getPageMetaData = (post: any) => {
  const getTags = (tags: any) => {
    return tags.map((tag: any) => tag.name)
  }

  return {
    id: post.id,
    title: post.properties.Name.title[0].plain_text,
    description: post.properties.Description.rich_text[0].plain_text,
    date: post.properties.Date.date.start,
    slug: post.properties.Slug.rich_text[0].plain_text,
    tags: getTags(post.properties.Tags.multi_select),
    thumbnail: post.properties.Thumbnail?.files[0]?.file?.url || null,
  }
}

// 全記事の取得
const getAllPosts = async () => {
  const posts = await notion.databases.query({
    database_id: config.notionDatabaseId,
    page_size: 100,
    filter: {
      property: 'Published',
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
  })

  return posts.results.map(post => getPageMetaData(post))
}

// トップページ用の記事取得 - exportを追加
export const getPostsForTopPage = async () => {
  try {
    const posts = await notion.databases.query({
      database_id: config.notionDatabaseId,
      page_size: NUMBER_OF_POSTS_PER_PAGE,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    })

    return posts.results.map(post => getPageMetaData(post))
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return []
  }
}

// 単一記事の取得
export const getSinglePost = async (slug: string) => {
  const response = await notion.databases.query({
    database_id: config.notionDatabaseId,
    filter: {
      property: 'Slug',
      formula: {
        string: {
          equals: slug,
        },
      },
    },
  })

  const page = response.results[0]
  const metadata = getPageMetaData(page)
  const mdBlocks = await n2m.pageToMarkdown(page.id)
  const mdString = n2m.toMarkdownString(mdBlocks)

  return {
    metadata,
    markdown: mdString,
  }
}

// 必要な関数をすべてエクスポート
export {
  getAllPosts,
  getPageMetaData
} 