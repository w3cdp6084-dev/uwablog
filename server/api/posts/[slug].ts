import { getSinglePost } from '~/server/services/notion'

export default defineEventHandler(async (event) => {
  try {
    // 環境変数のチェック
    const apiKey = process.env.NOTION_API_KEY
    const databaseId = process.env.NOTION_DATABASE_ID

    if (!apiKey || !databaseId) {
      throw createError({
        statusCode: 500,
        message: 'Server configuration error'
      })
    }

    const slug = getRouterParam(event, 'slug')
    if (!slug) {
      throw createError({
        statusCode: 400,
        message: 'Slug is required'
      })
    }

    const post = await getSinglePost(slug)
    if (!post) {
      throw createError({
        statusCode: 404,
        message: 'Post not found'
      })
    }

    return post

  } catch (error: any) {
    console.error('Error fetching post:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch post',
      cause: error
    })
  }
}) 