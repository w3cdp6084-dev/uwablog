import { getAllPosts } from '~/server/services/notion'

export default defineEventHandler(async () => {
  try {
    const posts = await getAllPosts()
    console.log('API response posts:', posts)
    return posts
  } catch (error) {
    console.error('Error in API handler:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch posts'
    })
  }
}) 