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
  try {
    // デバッグ用
    console.log('Raw post data:', post)
    console.log('Properties:', post.properties)

    // プロパティの存在確認
    if (!post?.properties) {
      throw new Error('No properties found in post')
    }

    const properties = post.properties

    // 各プロパティの安全な取得
    const title = properties.Title?.title?.[0]?.plain_text || 'Untitled'
    const description = properties.Description?.rich_text?.[0]?.plain_text || ''
    const date = properties.Date?.date?.start || ''
    const slug = properties.Slug?.formula?.string || ''
    const tags = properties.Tags?.multi_select?.map((tag: any) => tag.name) || []
    const thumbnail = properties.Thumbnail?.files?.[0]?.file?.url || 
                     properties.Thumbnail?.files?.[0]?.external?.url || null

    const metadata = {
      id: post.id || '',
      title,
      description,
      date,
      slug,
      tags,
      thumbnail
    }

    // デバッグ用
    console.log('Formatted metadata:', metadata)

    return metadata
  } catch (error) {
    console.error('Error in getPageMetaData:', error)
    console.error('Problem post:', post)
    
    // エラー時のデフォルト値を返す
    return {
      id: post?.id || '',
      title: 'Error loading post',
      description: '',
      date: '',
      slug: '',
      tags: [],
      thumbnail: null
    }
  }
}

// 全記事の取得
const getAllPosts = async () => {
  try {
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

    // デバッグ用
    console.log('Number of posts found:', posts.results.length)
    if (posts.results.length > 0) {
      console.log('Sample post:', posts.results[0])
    }

    if (!posts.results.length) {
      return []
    }

    return posts.results.map((post: any) => getPageMetaData(post))

  } catch (error) {
    console.error('Error in getAllPosts:', error)
    return []
  }
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

// 関連記事の取得
export const getRelatedPosts = async (slug: string) => {
  try {
    // 現在の記事を取得してタグを取得
    const currentPost = await getSinglePost(slug)
    const currentTags = currentPost.metadata.tags || []

    if (!currentTags.length) {
      return []
    }

    // 同じタグを持つ記事を検索
    const response = await notion.databases.query({
      database_id: config.notionDatabaseId,
      filter: {
        and: [
          {
            property: 'Published',
            checkbox: {
              equals: true,
            },
          },
          {
            property: 'Tags',
            multi_select: {
              contains: currentTags[0] // 最初のタグで検索
            }
          },
          {
            property: 'Slug',
            formula: {
              string: {
                does_not_equal: slug // 現在の記事を除外
              }
            }
          }
        ]
      },
      page_size: 3, // 3件まで取得
      sorts: [
        {
          property: 'Date',
          direction: 'descending'
        }
      ]
    })

    const relatedPosts = response.results.map(post => {
      const metadata = getPageMetaData(post)
      return {
        metadata
      }
    })

    return relatedPosts

  } catch (error) {
    console.error('Error in getRelatedPosts:', error)
    return []
  }
}

// 必要な関数をすべてエクスポート
export {
  getAllPosts,
  getPageMetaData
} 