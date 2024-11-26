import { getSinglePost } from '~/server/services/notion'

export default defineEventHandler(async (event) => {
  try {
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
        message: `Post not found: ${slug}`
      })
    }

    return post

  } catch (error) {
    console.error('Error in post handler:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch post',
      cause: error
    })
  }
}) 