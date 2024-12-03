import { defineEventHandler } from 'h3'

// いいねデータを保存するためのMap
let likesMap = new Map()

export default defineEventHandler(async (event) => {
  const slug = event.context.params.slug
  const method = event.method

  // GETリクエスト（いいね数の取得）
  if (method === 'GET') {
    return {
      count: likesMap.get(slug) || 0
    }
  }

  // POSTリクエスト（いいねの更新）
  if (method === 'POST') {
    const body = await readBody(event)
    const currentCount = likesMap.get(slug) || 0
    const newCount = currentCount + (body.increment ? 1 : -1)
    likesMap.set(slug, Math.max(0, newCount))
    
    return {
      count: newCount
    }
  }
}) 