import { getSinglePost } from '~/server/services/notion'

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

    const post = await getSinglePost(slug)
    
    if (!post) {
      throw createError({
        statusCode: 404,
        message: 'Post not found'
      })
    }

    return post

  } catch (error: any) {
    console.error('Error in getSinglePost API:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: `Error fetching post: ${error.message}`
    })
  }
})