import { getPostsForTopPage } from '~/server/services/notion'

export default defineEventHandler(async () => {
  return await getPostsForTopPage()
}) 