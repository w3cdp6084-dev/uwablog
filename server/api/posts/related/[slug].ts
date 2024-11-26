import { getRelatedPosts } from '~/server/services/notion'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug
  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug is required'
    })
  }

  try {
    const relatedPosts = await getRelatedPosts(slug)
    return relatedPosts
  } catch (error) {
    console.error('Error fetching related posts:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch related posts'
    })
  }
}) 