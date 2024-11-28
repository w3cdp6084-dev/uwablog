import { Client } from '@notionhq/client'

export default defineEventHandler(async (event) => {
  try {
    const slug = event.context.params?.slug
    console.log('Searching for post with slug:', slug)

    if (!slug) {
      throw createError({
        statusCode: 400,
        message: 'Slug is required'
      })
    }

    const notion = new Client({
      auth: process.env.NOTION_API_KEY
    })

    // データベースクエリ
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID as string,
      filter: {
        and: [
          {
            property: 'Slug',
            rich_text: {
              equals: slug
            }
          },
          {
            property: 'Published',
            checkbox: {
              equals: true
            }
          }
        ]
      }
    })

    if (!response.results.length) {
      console.log('No post found with slug:', slug)
      throw createError({
        statusCode: 404,
        message: 'Post not found'
      })
    }

    const post = response.results[0]
    
    try {
      // ページの内容を取得
      const blocks = await notion.blocks.children.list({
        block_id: post.id,
      })

      return {
        metadata: getPageMetaData(post),
        content: blocks.results
      }
    } catch (error) {
      console.error('Error fetching post content:', error)
      throw createError({
        statusCode: 500,
        message: 'Error fetching post content'
      })
    }

  } catch (error: any) {
    console.error('Error in getSinglePost:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: `Error fetching post: ${error.message}`
    })
  }
})

// メタデータの取得関数
const getPageMetaData = (post: any) => {
  // サムネイル画像の取得
  const getThumbnailUrl = (thumbnail: any) => {
    if (!thumbnail) return null
    if (thumbnail.type === 'external') return thumbnail.external.url
    if (thumbnail.type === 'file') return thumbnail.file.url
    return null
  }

  const metadata = {
    id: post.id,
    title: post.properties.Name?.title[0]?.plain_text || 'Untitled',
    description: post.properties.Description?.rich_text[0]?.plain_text || '',
    date: post.properties.Date?.date?.start || '',
    slug: post.properties.Slug?.rich_text[0]?.plain_text || '',
    tags: post.properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
    thumbnail: getThumbnailUrl(post.properties.Thumbnail?.files[0])
  }
  return metadata
} 