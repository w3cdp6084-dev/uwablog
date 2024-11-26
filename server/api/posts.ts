import { getPostsForTopPage } from '~/server/services/notion'

export default defineEventHandler(async () => {
  try {
    const posts = await getPostsForTopPage()
    console.log('Fetched posts:', posts)
    return posts
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}) 