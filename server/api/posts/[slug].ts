import { Client } from '@notionhq/client'

// メタデータの取得関数を追加
const getPageMetaData = (post: any) => {
  try {
    if (!post?.properties) {
      throw new Error('No properties found in post')
    }

    // サムネイル画像の取得
    const getThumbnailUrl = (thumbnail: any) => {
      if (!thumbnail) return null
      if (thumbnail.type === 'external') return thumbnail.external.url
      if (thumbnail.type === 'file') return thumbnail.file.url
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
        or: [
          {
            property: 'Slug',
            rich_text: {
              equals: slug
            }
          },
          {
            property: 'Name',
            title: {
              equals: slug
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
    
    // ページの内容を取得
    const blocks = await notion.blocks.children.list({
      block_id: post.id,
    })

    // 結果を返す
    return {
      metadata: getPageMetaData(post),
      content: blocks.results
    }

  } catch (error: any) {
    console.error('Error in getSinglePost:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: `Error fetching post: ${error.message}`
    })
  }
}) 