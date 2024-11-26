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
        message: `記事が見つかりません`,
        fatal: true
      })
    }

    return post

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal Server Error',
      fatal: true
    })
  }
}) 