import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { NUMBER_OF_POSTS_PER_PAGE } from '~/constants/constants'

// 定数の定義を追加
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1秒

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const config = useRuntimeConfig()

const notion = new Client({
  auth: config.notionApiKey
})

const n2m = new NotionToMarkdown({ notionClient: notion })

// メタデータの取得
const getPageMetaData = (post: any) => {
  try {
    if (!post?.properties) {
      throw new Error('No properties found in post')
    }

    // サムネイル画像の取得方法を改善
    const getThumbnailUrl = (thumbnail: any) => {
      if (!thumbnail) return null
      
      // 外部URLの場合
      if (thumbnail.type === 'external') {
        return thumbnail.external.url
      }
      
      // Notionにアップロードされた画像の場合
      if (thumbnail.type === 'file') {
        // 永続的なURLを使用（もしくはプロキシを経由）
        return thumbnail.file.url
      }
      
      return null
    }

    return {
      id: post.id,
      title: post.properties.Name?.title[0]?.plain_text || 
             post.properties.Title?.title[0]?.plain_text || 
             'Untitled',
      description: post.properties.Description?.rich_text[0]?.plain_text || '',
      date: post.properties.Date?.date?.start || '',
      slug: post.properties.Slug?.rich_text[0]?.plain_text || `post-${post.id}`,
      tags: post.properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      // サムネイルの取得方法を変更
      thumbnail: getThumbnailUrl(post.properties.Thumbnail?.files[0])
    }
  } catch (error) {
    console.error('Error in getPageMetaData:', error)
    return {
      id: post.id,
      title: 'Error loading post',
      description: '',
      date: '',
      slug: `post-${post.id}`,
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
export async function getPostsForTopPage() {
  let lastError

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Initializing Notion client...`)
      const notion = new Client({
        auth: process.env.NOTION_API_KEY,
      })

      if (!process.env.NOTION_DATABASE_ID) {
        throw new Error('NOTION_DATABASE_ID is not configured')
      }

      console.log('Fetching database...')
      const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        sorts: [
          {
            property: 'Date',
            direction: 'descending',
          },
        ],
      })

      console.log('Database response:', {
        results: response.results.length,
        success: !!response.results
      })

      // 記事のメタデータを整形して返す
      return response.results.map(post => getPageMetaData(post))

    } catch (error: any) {
      lastError = error
      console.error(`Attempt ${attempt} failed:`, {
        message: error.message,
        code: error.code,
        status: error.status
      })

      if (attempt < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY}ms...`)
        await delay(RETRY_DELAY)
      }
    }
  }

  console.error('All retry attempts failed')
  throw lastError
}

// 単一記事の取得
export const getSinglePost = async (slug: string) => {
  try {
    console.log('Searching for post with slug:', slug) // デバッグ用

    // IDベースのスラッグかどうかをチェック
    const isIdBasedSlug = slug.startsWith('post-')
    const postId = isIdBasedSlug ? slug.replace('post-', '') : null

    let response

    if (postId) {
      // IDで直接検索
      try {
        const page = await notion.pages.retrieve({
          page_id: postId
        })
        response = { results: [page] }
      } catch (error) {
        console.error('Error retrieving page by ID:', error)
        response = { results: [] }
      }
    } else {
      // スラッグで検索
      response = await notion.databases.query({
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
              or: [
                {
                  property: 'Name',
                  title: {
                    equals: decodeURIComponent(slug),
                  },
                },
                {
                  property: 'Slug',
                  formula: {
                    string: {
                      equals: slug,
                    },
                  },
                },
              ],
            },
          ],
        },
      })
    }

    console.log('Search results:', response.results) // デバッグ用

    if (!response.results.length) {
      console.log('No post found with slug:', slug)
      return null
    }

    const post = response.results[0]
    
    // ページの内容を取得
    const blocks = await notion.blocks.children.list({
      block_id: post.id,
    })

    return {
      metadata: getPageMetaData(post),
      content: blocks.results
    }

  } catch (error) {
    console.error('Error in getSinglePost:', error)
    throw error
  }
}

// 記事コンテンツの取得
const getPostContent = async (pageId: string) => {
  try {
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
    })
    return blocks.results
  } catch (error) {
    console.error('Error getting post content:', error)
    return []
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