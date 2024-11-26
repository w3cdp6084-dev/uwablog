import { getSinglePost } from '~/server/services/notion'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug
  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug is required'
    })
  }

  try {
    const post = await getSinglePost(slug)
    return post
  } catch (error) {
    console.error('Error fetching post:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch post'
    })
  }
}) 