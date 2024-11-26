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
    if (!post?.properties) {
      throw new Error('No properties found in post')
    }

    // タイトルの取得
    const title = post.properties.Name?.title[0]?.plain_text || 
                 post.properties.Title?.title[0]?.plain_text || 
                 'Untitled'

    // Slugプロパティから取得を試みる
    let slug = post.properties.Slug?.rich_text?.[0]?.plain_text || ''

    // Slugが空の場合、タイトルからスラッグを生成
    if (!slug) {
      // 日本語の場合はローマ字に変換するか、IDを使用
      if (/^[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf]+$/.test(title)) {
        // 日本語の場合はIDベースのスラッグを使用
        slug = `post-${post.id}`
      } else {
        // 英数字の場合は通常のスラッグ生成
        slug = title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      }
    }

    // スラッグが空の場合はIDを使用
    if (!slug) {
      slug = `post-${post.id}`
    }

    console.log('Generated metadata:', { title, slug }) // デバッグ用

    return {
      id: post.id,
      title,
      description: post.properties.Description?.rich_text[0]?.plain_text || '',
      date: post.properties.Date?.date?.start || '',
      slug,
      tags: post.properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      thumbnail: post.properties.Thumbnail?.files[0]?.file?.url || 
                post.properties.Thumbnail?.files[0]?.external?.url || null
    }
  } catch (error) {
    console.error('Error in getPageMetaData:', error)
    // エラー時は必ずIDベースのスラッグを返す
    return {
      id: post.id || '',
      title: post.properties?.Name?.title[0]?.plain_text || 'Error loading post',
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