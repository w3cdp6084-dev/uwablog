import { getPostsForTopPage } from '~/server/services/notion'

export default defineEventHandler(async (event) => {
  try {
    // 環境変数のチェック
    const config = useRuntimeConfig()
    
    
    if (!config.notionApiKey || !config.notionDatabaseId) {
      throw createError({
        statusCode: 500,
        message: 'Server configuration error'
      })
    }

    const posts = await getPostsForTopPage()
    return posts

  } catch (error: any) {
    console.error('Error fetching posts:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch posts',
      cause: error
    })
  }
}) 